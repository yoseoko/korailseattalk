import { useCallback, useEffect, useRef, useState } from "react";
import { pollWatch, reserveTrain } from "@/lib/functions";
import { formatClock } from "@/lib/format";
import {
  formatPollRange,
  formatPollSec,
  randomPollDelayMs,
  type AppSettings,
} from "@/lib/store";
import type { PollLog, Train, WatchHit } from "@/lib/types";

function chime() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(784, ctx.currentTime);
    osc.frequency.setValueAtTime(1046, ctx.currentTime + 0.14);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.55);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    /* ignore */
  }
}

function newLog(level: PollLog["level"], message: string): PollLog {
  return { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, at: Date.now(), level, message };
}

export function useWatcher() {
  const [watching, setWatching] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [logs, setLogs] = useState<PollLog[]>([]);
  const [pollCount, setPollCount] = useState(0);
  const [lastCheck, setLastCheck] = useState<number | null>(null);
  const [nextWaitSec, setNextWaitSec] = useState<number | null>(null);
  const [hit, setHit] = useState<WatchHit | null>(null);
  const [busy, setBusy] = useState(false);
  const stopRef = useRef(false);
  const lockRef = useRef<WakeLockSentinel | null>(null);
  const timerRef = useRef<number | null>(null);

  const pushLog = useCallback((level: PollLog["level"], message: string) => {
    setLogs((prev) => [newLog(level, message), ...prev].slice(0, 80));
  }, []);

  const toggleTrain = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const selectMany = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopRef.current = true;
      clearTimer();
      void lockRef.current?.release();
    };
  }, [clearTimer]);

  const stop = useCallback(() => {
    stopRef.current = true;
    setWatching(false);
    setNextWaitSec(null);
    clearTimer();
    void lockRef.current?.release();
    lockRef.current = null;
    pushLog("info", "감시를 멈췄습니다.");
  }, [clearTimer, pushLog]);

  const start = useCallback(
    async (settings: AppSettings, watchTrains: Train[]) => {
      if (selectedIds.length === 0) {
        pushLog("warn", "감시할 열차를 먼저 고르세요.");
        return;
      }
      stopRef.current = false;
      clearTimer();
      setWatching(true);
      setHit(null);
      setPollCount(0);
      setNextWaitSec(null);
      pushLog("ok", `${selectedIds.length}개 열차 감시 시작 · ${formatPollRange(settings.pollMinSec, settings.pollMaxSec)} 무작위`);
      try {
        lockRef.current = (await navigator.wakeLock?.request("screen")) ?? null;
      } catch {
        pushLog("warn", "화면 꺼짐 방지를 사용할 수 없습니다. 탭을 켜 두세요.");
      }

      const scheduleNext = () => {
        const ms = randomPollDelayMs(settings.pollMinSec, settings.pollMaxSec);
        const sec = ms / 1000;
        setNextWaitSec(sec);
        timerRef.current = window.setTimeout(() => void tick(), ms);
        return sec;
      };

      const tick = async () => {
        if (stopRef.current) return;
        let result: Awaited<ReturnType<typeof pollWatch>> | undefined;
        try {
          result = await pollWatch({
            data: {
              dep: settings.lastDep,
              arr: settings.lastArr,
              date: settings.lastDate,
              timeStart: settings.lastTimeStart.replace(":", "") + "00",
              timeEnd: settings.lastTimeEnd.replace(":", "") + "00",
              kind: settings.kind,
              adults: settings.adults,
              children: settings.children,
              seniors: settings.seniors,
              trainIds: selectedIds,
              seatOption: settings.seatOption,
              autoReserve: settings.autoReserve,
              tryWaiting: settings.tryWaiting,
              korailId: settings.korailId,
              korailPw: settings.korailPw,
              telegramToken: settings.telegramToken,
              telegramChatId: settings.telegramChatId,
            },
          });
        } catch (error) {
          if (stopRef.current) return;
          const wait = scheduleNext();
          pushLog(
            "error",
            `${error instanceof Error ? error.message : "조회에 실패했습니다."} · ${formatPollSec(wait)}초 후`,
          );
          return;
        }
        if (stopRef.current) return;
        setPollCount((n) => n + 1);
        setLastCheck(Date.now());
        if (!result) {
          const wait = scheduleNext();
          pushLog("error", `조회 응답이 비었습니다 · ${formatPollSec(wait)}초 후`);
          return;
        }
        if (result.error) {
          pushLog("error", result.error);
        } else {
          const watched = result.trains.filter((t) => selectedIds.includes(t.id));
          setTrains((prev) => {
            const others = prev.filter((t) => !selectedIds.includes(t.id));
            const merged = [...watched];
            for (const t of others) if (!merged.some((m) => m.id === t.id)) merged.push(t);
            return merged.sort((a, b) => a.depTime.localeCompare(b.depTime));
          });
        }

        if (result.hits[0]) {
          const found = result.hits[0];
          setHit(found);
          chime();
          try {
            await Notification.requestPermission();
            if (Notification.permission === "granted") {
              new Notification("자리톡", { body: `${found.train.trainTypeName} ${found.train.trainNo} 좌석 발생` });
            }
          } catch {
            /* ignore */
          }
          if (found.reservation) {
            pushLog("ok", `예매 완료 · 예약번호 ${found.reservation.pnr}`);
            stopRef.current = true;
            setWatching(false);
            setNextWaitSec(null);
            clearTimer();
            return;
          }
          pushLog("ok", `${found.train.trainTypeName} ${found.train.trainNo} 좌석 발생`);
          if (settings.autoReserve) {
            pushLog("warn", "자동 예매가 켜져 있지만 예약이 끝나지 않았습니다.");
          }
        }

        const wait = scheduleNext();
        if (!result.error && result.hits.length === 0) {
          pushLog("info", `${formatClock(Date.now())} 아직 빈자리 없음 · ${formatPollSec(wait)}초 후`);
        } else if (result.error) {
          pushLog("info", `${formatPollSec(wait)}초 후 다시 조회`);
        }
      };

      void tick();
      void watchTrains;
    },
    [clearTimer, pushLog, selectedIds],
  );

  const reserveNow = useCallback(
    async (train: Train, settings: AppSettings, seatClass: "general" | "special") => {
      setBusy(true);
      try {
        const result = await reserveTrain({
          data: {
            korailId: settings.korailId,
            korailPw: settings.korailPw,
            train,
            adults: settings.adults,
            children: settings.children,
            seniors: settings.seniors,
            seatClass,
            waiting: false,
            telegramToken: settings.telegramToken,
            telegramChatId: settings.telegramChatId,
          },
        });
        if (!result.ok || !result.reservation) {
          pushLog("error", result.error || "예매에 실패했습니다.");
          return null;
        }
        pushLog("ok", `예매 완료 · 예약번호 ${result.reservation.pnr}`);
        setHit({ train, seatClass, reservation: result.reservation });
        stop();
        return result.reservation;
      } finally {
        setBusy(false);
      }
    },
    [pushLog, stop],
  );

  return {
    watching,
    selectedIds,
    trains,
    setTrains,
    logs,
    pushLog,
    pollCount,
    lastCheck,
    nextWaitSec,
    hit,
    setHit,
    busy,
    toggleTrain,
    selectMany,
    start,
    stop,
    reserveNow,
  };
}
