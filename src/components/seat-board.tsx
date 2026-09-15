import { ArrowLeftRight, Bell, LoaderCircle, Radio, Settings2, TrainFront } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { StationField } from "@/components/station-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  findTelegramChat,
  searchTrains,
  testKorailLogin,
  testTelegram,
} from "@/lib/functions";
import {
  formatClock,
  formatDuration,
  formatFare,
  formatHm,
  formatYmdKorean,
  hhmmssToInput,
  HOURS,
  inputToHhmmss,
  inputToYmd,
  kstNow,
  seatLabel,
  seatState,
  toYmd,
  trainHeadline,
  ymdToInput,
} from "@/lib/format";
import { POPULAR_ROUTES } from "@/lib/stations";
import {
  formatPollRange,
  formatPollSec,
  POLL_SEC_CEIL,
  POLL_SEC_FLOOR,
  useSettings,
  type AppSettings,
} from "@/lib/store";
import type { SeatState, Train } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useWatcher } from "@/hooks/use-watcher";

function tomorrowYmd() {
  const d = kstNow();
  d.setDate(d.getDate() + 1);
  return toYmd(d);
}

function Stepper({
  label,
  value,
  onChange,
  min = 0,
  max = 9,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-surface px-3 py-2 shadow-[var(--shadow-border)]">
      <span className="text-sm text-muted">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="grid size-9 place-items-center rounded-[var(--radius-sm)] bg-surface-2 text-foreground"
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          −
        </button>
        <span className="w-4 text-center font-mono text-sm tabular-nums">{value}</span>
        <button
          type="button"
          className="grid size-9 place-items-center rounded-[var(--radius-sm)] bg-surface-2 text-foreground"
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}

function SeatChip({ label, state }: { label: string; state: SeatState }) {
  return (
    <span
      className={cn(
        "inline-flex min-w-16 flex-col rounded-[var(--radius-sm)] px-2 py-1",
        state === "available" && "bg-success-soft",
        state === "soldout" && "bg-danger-soft",
        state === "none" && "bg-surface-2",
      )}
    >
      <span className="text-[10px] text-subtle">{label}</span>
      <span
        className={cn(
          "text-xs font-medium",
          state === "available" && "text-success",
          state === "soldout" && "text-danger",
          state === "none" && "text-muted",
        )}
      >
        {seatLabel(state)}
      </span>
    </span>
  );
}

function TrainRow({
  train,
  selected,
  watching,
  onToggle,
  onReserve,
  canReserve,
}: {
  train: Train;
  selected: boolean;
  watching: boolean;
  onToggle: () => void;
  onReserve: (seatClass: "general" | "special") => void;
  canReserve: boolean;
}) {
  const general = seatState(train.generalSeat);
  const special = seatState(train.specialSeat);
  const open = general === "available" || special === "available";

  return (
    <article
      className={cn(
        "rounded-[var(--radius-lg)] bg-elevated p-3 shadow-[var(--shadow-border)] transition-[box-shadow] duration-[var(--motion-quick)]",
        selected && "shadow-[var(--shadow-border-hover)]",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "mt-1 grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] shadow-[var(--shadow-border)]",
            selected ? "bg-accent text-accent-foreground" : "bg-surface text-muted",
          )}
          aria-pressed={selected}
        >
          <TrainFront className="size-4" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-sm font-medium">
              {train.trainTypeName} {train.trainNo}
            </p>
            {open ? <Badge tone="available">빈자리</Badge> : <Badge tone="soldout">매진</Badge>}
            {watching && selected ? <Badge tone="live">감시중</Badge> : null}
          </div>
          <p className="mt-1 font-mono text-lg tabular-nums tracking-tight">
            {formatHm(train.depTime)}
            <span className="mx-2 text-subtle">→</span>
            {formatHm(train.arrTime)}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {train.depName} → {train.arrName} · {formatDuration(train.runMinutes)}
            {train.fare ? ` · ${formatFare(train.fare)}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <SeatChip label="일반" state={general} />
          <SeatChip label="특실" state={special} />
        </div>
      </div>
      {open && canReserve ? (
        <div className="mt-3 flex gap-2">
          {general === "available" ? (
            <Button size="sm" variant="secondary" className="flex-1" onClick={() => onReserve("general")}>
              일반실 예매
            </Button>
          ) : null}
          {special === "available" ? (
            <Button size="sm" variant="secondary" className="flex-1" onClick={() => onReserve("special")}>
              특실 예매
            </Button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function SettingsForm({
  settings,
  patch,
}: {
  settings: AppSettings;
  patch: (p: Partial<AppSettings>) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  return (
    <div className="grid gap-6">
      <section>
        <h3 className="font-display text-sm font-medium">코레일 계정</h3>
        <p className="mt-1 text-xs text-muted">
          회원번호·휴대폰·이메일 중 하나로 로그인합니다. 정보는 이 기기에만 저장됩니다.
        </p>
        <div className="mt-3 grid gap-3">
          <div>
            <Label htmlFor="korail-id">아이디</Label>
            <Input
              id="korail-id"
              className="mt-1.5"
              value={settings.korailId}
              autoComplete="username"
              onChange={(e) => patch({ korailId: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="korail-pw">비밀번호</Label>
            <Input
              id="korail-pw"
              className="mt-1.5"
              type="password"
              value={settings.korailPw}
              autoComplete="current-password"
              onChange={(e) => patch({ korailPw: e.target.value })}
            />
          </div>
          <Button
            variant="secondary"
            disabled={busy !== null}
            onClick={async () => {
              setBusy("korail");
              const result = await testKorailLogin({
                data: { korailId: settings.korailId, korailPw: settings.korailPw },
              });
              setBusy(null);
              if (result.ok) toast.success(`${result.name || "회원"} 로그인 확인`);
              else toast.error(result.error);
            }}
          >
            {busy === "korail" ? <LoaderCircle className="size-4 animate-spin" /> : null}
            로그인 확인
          </Button>
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="font-display text-sm font-medium">텔레그램 알림</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-muted">
          <li>텔레그램에서 BotFather에게 /newbot 으로 봇을 만듭니다.</li>
          <li>받은 토큰을 아래에 붙여 넣습니다.</li>
          <li>봇에게 아무 말이나 보낸 뒤 채팅 ID를 찾습니다.</li>
        </ol>
        <div className="mt-3 grid gap-3">
          <div>
            <Label htmlFor="tg-token">봇 토큰</Label>
            <Input
              id="tg-token"
              className="mt-1.5"
              type="password"
              value={settings.telegramToken}
              onChange={(e) => patch({ telegramToken: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="tg-chat">채팅 ID</Label>
            <div className="mt-1.5 flex gap-2">
              <Input
                id="tg-chat"
                value={settings.telegramChatId}
                onChange={(e) => patch({ telegramChatId: e.target.value })}
              />
              <Button
                variant="secondary"
                className="shrink-0"
                disabled={busy !== null}
                onClick={async () => {
                  setBusy("chat");
                  const result = await findTelegramChat({ data: { token: settings.telegramToken } });
                  setBusy(null);
                  if (result.ok && result.chatId) {
                    patch({ telegramChatId: result.chatId });
                    toast.success("채팅 ID를 넣었습니다.");
                  } else toast.error(result.error);
                }}
              >
                찾기
              </Button>
            </div>
          </div>
          <Button
            variant="secondary"
            disabled={busy !== null}
            onClick={async () => {
              setBusy("tg");
              const result = await testTelegram({
                data: { token: settings.telegramToken, chatId: settings.telegramChatId },
              });
              setBusy(null);
              if (result.ok) toast.success(`@${result.username} 연결됨`);
              else toast.error(result.error);
            }}
          >
            {busy === "tg" ? <LoaderCircle className="size-4 animate-spin" /> : <Bell className="size-4" />}
            테스트 메시지
          </Button>
        </div>
      </section>

      <Separator />

      <section className="grid gap-3">
        <h3 className="font-display text-sm font-medium">감시 동작</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="poll-min">최소 간격 (초)</Label>
            <Input
              id="poll-min"
              className="mt-1.5"
              type="number"
              min={POLL_SEC_FLOOR}
              max={POLL_SEC_CEIL}
              step={0.1}
              value={settings.pollMinSec}
              onChange={(e) => patch({ pollMinSec: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="poll-max">최대 간격 (초)</Label>
            <Input
              id="poll-max"
              className="mt-1.5"
              type="number"
              min={POLL_SEC_FLOOR}
              max={POLL_SEC_CEIL}
              step={0.1}
              value={settings.pollMaxSec}
              onChange={(e) => patch({ pollMaxSec: Number(e.target.value) })}
            />
          </div>
        </div>
        <p className="text-xs text-muted">
          조회마다 {formatPollRange(settings.pollMinSec, settings.pollMaxSec)} 사이에서 임의의 초를 고릅니다.
          간격이 일정하지 않습니다.
        </p>
        <div>
          <Label>좌석 우선</Label>
          <select
            className="mt-1.5 flex h-11 w-full rounded-[var(--radius-sm)] bg-surface px-3 text-sm shadow-[var(--shadow-border)]"
            value={settings.seatOption}
            onChange={(e) => patch({ seatOption: e.target.value as AppSettings["seatOption"] })}
          >
            <option value="general-first">일반실 우선</option>
            <option value="general-only">일반실만</option>
            <option value="special-first">특실 우선</option>
            <option value="special-only">특실만</option>
          </select>
        </div>
        <label className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-surface px-3 py-3 shadow-[var(--shadow-border)]">
          <span className="text-sm">빈자리 생기면 자동 예매</span>
          <Switch checked={settings.autoReserve} onCheckedChange={(v) => patch({ autoReserve: v })} />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-surface px-3 py-3 shadow-[var(--shadow-border)]">
          <span className="text-sm">예약대기까지 시도</span>
          <Switch checked={settings.tryWaiting} onCheckedChange={(v) => patch({ tryWaiting: v })} />
        </label>
        {settings.autoReserve ? (
          <p className="text-xs text-warn">
            좌석이 열리는 즉시 코레일에 예약이 들어갑니다. 결제는 직접 해야 하며 보통 10분 안에 만료됩니다.
          </p>
        ) : null}
      </section>
    </div>
  );
}

export function SeatBoard() {
  const settings = useSettings();
  const watcher = useWatcher();
  const [searching, setSearching] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!settings.lastDate) settings.patch({ lastDate: tomorrowYmd() });
  }, [settings]);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const dateInput = settings.lastDate ? ymdToInput(settings.lastDate) : ymdToInput(tomorrowYmd());
  const selectedTrains = useMemo(
    () => watcher.trains.filter((t) => watcher.selectedIds.includes(t.id)),
    [watcher.trains, watcher.selectedIds],
  );
  const pollLabel =
    watcher.watching && watcher.nextWaitSec != null
      ? `${formatPollSec(watcher.nextWaitSec)}s`
      : formatPollRange(settings.pollMinSec, settings.pollMaxSec).replace("초", "s");

  async function onSearch() {
    setSearching(true);
    try {
      const result = await searchTrains({
        data: {
          dep: settings.lastDep.trim(),
          arr: settings.lastArr.trim(),
          date: settings.lastDate || tomorrowYmd(),
          timeStart: inputToHhmmss(settings.lastTimeStart),
          timeEnd: inputToHhmmss(settings.lastTimeEnd),
          kind: settings.kind,
          adults: settings.adults,
          children: settings.children,
          seniors: settings.seniors,
        },
      });
      if (result.error) {
        toast.error(result.error);
        watcher.pushLog("error", result.error);
        return;
      }
      watcher.setTrains(result.trains);
      const keep = new Set(result.trains.map((t) => t.id));
      watcher.selectMany(watcher.selectedIds.filter((id) => keep.has(id)));
      watcher.pushLog("info", `${result.trains.length}개 열차 · ${formatYmdKorean(settings.lastDate || tomorrowYmd())}`);
      if (result.trains.length === 0) toast.message("해당 시간대에 열차가 없습니다.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "조회에 실패했습니다.";
      toast.error(message);
      watcher.pushLog("error", message);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-28 pt-4 sm:px-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-subtle">KORAIL SEAT WATCH</p>
          <h1 className="font-display text-2xl font-medium tracking-tight">자리톡</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full bg-surface px-3 py-2 font-mono text-xs tabular-nums text-muted shadow-[var(--shadow-border)] sm:flex">
            {watcher.watching ? (
              <>
                <span className="live-dot size-2 rounded-full bg-success" />
                감시 {watcher.pollCount}
              </>
            ) : now === null ? (
              <span className="opacity-0">00:00:00</span>
            ) : (
              formatClock(now)
            )}
          </div>
          <Button variant="secondary" size="icon" onClick={() => setSettingsOpen(true)} aria-label="설정">
            <Settings2 className="size-4" />
          </Button>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <section className="rounded-[var(--radius-xl)] bg-elevated p-4 shadow-[var(--shadow-border)] sm:p-5">
          <div className="flex flex-wrap gap-2">
            {POPULAR_ROUTES.map((route) => (
              <button
                key={route.label}
                type="button"
                className={cn(
                  "h-9 rounded-full px-3 text-xs shadow-[var(--shadow-border)]",
                  settings.lastDep === route.dep && settings.lastArr === route.arr
                    ? "bg-accent text-accent-foreground"
                    : "bg-surface text-muted hover:text-foreground",
                )}
                onClick={() => settings.patch({ lastDep: route.dep, lastArr: route.arr })}
              >
                {route.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-end gap-2">
            <StationField
              label="출발"
              value={settings.lastDep}
              onChange={(lastDep) => settings.patch({ lastDep })}
            />
            <button
              type="button"
              className="mb-0.5 grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-surface text-muted shadow-[var(--shadow-border)] hover:text-foreground"
              onClick={() => settings.patch({ lastDep: settings.lastArr, lastArr: settings.lastDep })}
              aria-label="출발 도착 바꾸기"
            >
              <ArrowLeftRight className="size-4" />
            </button>
            <StationField
              label="도착"
              value={settings.lastArr}
              onChange={(lastArr) => settings.patch({ lastArr })}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="date">날짜</Label>
              <Input
                id="date"
                className="mt-1.5"
                type="date"
                min={ymdToInput(toYmd(kstNow()))}
                value={dateInput}
                onChange={(e) => settings.patch({ lastDate: inputToYmd(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="t0">시작</Label>
              <select
                id="t0"
                className="mt-1.5 flex h-11 w-full rounded-[var(--radius-sm)] bg-surface px-3 text-sm shadow-[var(--shadow-border)]"
                value={hhmmssToInput(inputToHhmmss(settings.lastTimeStart))}
                onChange={(e) => settings.patch({ lastTimeStart: e.target.value })}
              >
                {HOURS.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="t1">끝</Label>
              <select
                id="t1"
                className="mt-1.5 flex h-11 w-full rounded-[var(--radius-sm)] bg-surface px-3 text-sm shadow-[var(--shadow-border)]"
                value={hhmmssToInput(inputToHhmmss(settings.lastTimeEnd))}
                onChange={(e) => settings.patch({ lastTimeEnd: e.target.value })}
              >
                {HOURS.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Stepper label="어른" value={settings.adults} min={1} onChange={(adults) => settings.patch({ adults })} />
            <Stepper label="어린이" value={settings.children} onChange={(children) => settings.patch({ children })} />
            <Stepper label="경로" value={settings.seniors} onChange={(seniors) => settings.patch({ seniors })} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(
              [
                ["ktx", "KTX"],
                ["itx", "ITX·새마을"],
                ["mugunghwa", "무궁화"],
                ["all", "전체"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={cn(
                  "h-9 rounded-full px-3 text-xs shadow-[var(--shadow-border)]",
                  settings.kind === value ? "bg-accent text-accent-foreground" : "bg-surface text-muted",
                )}
                onClick={() => settings.patch({ kind: value })}
              >
                {label}
              </button>
            ))}
          </div>

          <Button className="mt-4 w-full" disabled={searching || watcher.watching} onClick={() => void onSearch()}>
            {searching ? <LoaderCircle className="size-4 animate-spin" /> : <Radio className="size-4" />}
            열차 조회
          </Button>
        </section>

        <aside className="rounded-[var(--radius-xl)] bg-elevated p-4 shadow-[var(--shadow-border)] sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-medium">감시</h2>
            {watcher.watching ? (
              <Badge tone="live">LIVE</Badge>
            ) : (
              <Badge>{watcher.selectedIds.length}대 선택</Badge>
            )}
          </div>
          <p className="mt-2 text-xs text-muted">
            이 화면을 켜 둔 동안에만 조회합니다. 조회 간격은 {formatPollRange(settings.pollMinSec, settings.pollMaxSec)}{" "}
            사이에서 매번 달라집니다.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-[var(--radius-md)] bg-surface px-2 py-3">
              <p className="font-mono text-lg tabular-nums">{watcher.pollCount}</p>
              <p className="text-[11px] text-subtle">조회</p>
            </div>
            <div className="rounded-[var(--radius-md)] bg-surface px-2 py-3">
              <p className="font-mono text-lg tabular-nums">{selectedTrains.length}</p>
              <p className="text-[11px] text-subtle">대상</p>
            </div>
            <div className="rounded-[var(--radius-md)] bg-surface px-2 py-3">
              <p className="font-mono text-lg tabular-nums">{pollLabel}</p>
              <p className="text-[11px] text-subtle">{watcher.watching && watcher.nextWaitSec != null ? "다음" : "간격"}</p>
            </div>
          </div>
          {watcher.lastCheck ? (
            <p className="mt-3 font-mono text-xs text-subtle">마지막 조회 {formatClock(watcher.lastCheck)}</p>
          ) : null}
          <div className="mt-4 flex gap-2">
            {watcher.watching ? (
              <Button variant="danger" className="flex-1" onClick={watcher.stop}>
                감시 중지
              </Button>
            ) : (
              <Button
                className="flex-1"
                disabled={watcher.selectedIds.length === 0}
                onClick={() => void watcher.start(settings, watcher.trains)}
              >
                감시 시작
              </Button>
            )}
          </div>
          {settings.autoReserve && !settings.korailId ? (
            <p className="mt-3 text-xs text-warn">자동 예매를 쓰려면 설정에서 코레일 로그인을 넣으세요.</p>
          ) : null}
          <Separator className="my-4" />
          <h3 className="text-xs font-medium text-muted">기록</h3>
          <ol className="mt-2 max-h-56 space-y-1.5 overflow-auto">
            {watcher.logs.length === 0 ? (
              <li className="text-xs text-subtle">조회하면 여기에 남습니다.</li>
            ) : (
              watcher.logs.map((log) => (
                <li
                  key={log.id}
                  className={cn(
                    "font-mono text-[11px] leading-5",
                    log.level === "ok" && "text-success",
                    log.level === "error" && "text-danger",
                    log.level === "warn" && "text-warn",
                    log.level === "info" && "text-muted",
                  )}
                >
                  {log.message}
                </li>
              ))
            )}
          </ol>
        </aside>
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-sm font-medium">시간표</h2>
          {watcher.trains.length > 0 ? (
            <button
              type="button"
              className="text-xs text-muted hover:text-foreground"
              onClick={() =>
                watcher.selectMany(
                  watcher.selectedIds.length === watcher.trains.length ? [] : watcher.trains.map((t) => t.id),
                )
              }
            >
              {watcher.selectedIds.length === watcher.trains.length ? "선택 해제" : "모두 감시"}
            </button>
          ) : null}
        </div>
        {watcher.trains.length === 0 ? (
          <div className="rounded-[var(--radius-xl)] bg-elevated px-5 py-16 text-center shadow-[var(--shadow-border)]">
            <p className="font-display text-lg">아직 조회한 열차가 없습니다</p>
            <p className="mt-2 text-sm text-muted">구간과 시간을 고른 뒤 열차를 불러오세요.</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {watcher.trains.map((train) => (
              <TrainRow
                key={train.id}
                train={train}
                selected={watcher.selectedIds.includes(train.id)}
                watching={watcher.watching}
                canReserve={Boolean(settings.korailId && settings.korailPw) && !watcher.busy}
                onToggle={() => watcher.toggleTrain(train.id)}
                onReserve={(seatClass) => void watcher.reserveNow(train, settings, seatClass)}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="mt-10 pb-6 text-center text-[11px] leading-5 text-subtle">
        자리톡은 코레일 공식 서비스가 아닙니다. 예약 후 결제 기한 안에 코레일에서 직접 결제해야 합니다.
        자동 반복 조회는 이용 약관에 따라 제한될 수 있습니다.
      </footer>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent title="설정" className="max-h-[min(88dvh,720px)] overflow-auto">
          <SettingsForm settings={settings} patch={settings.patch} />
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(watcher.hit)} onOpenChange={(open) => !open && watcher.setHit(null)}>
        <DialogContent title={watcher.hit?.reservation ? "예매 완료" : "빈자리"}>
          {watcher.hit ? (
            <div className="grid gap-3">
              <p className="font-display text-base">{trainHeadline(watcher.hit.train)}</p>
              {watcher.hit.reservation ? (
                <>
                  <p className="font-mono text-sm">예약번호 {watcher.hit.reservation.pnr}</p>
                  <p className="text-sm text-muted">
                    결제 기한{" "}
                    {watcher.hit.reservation.payByDate
                      ? `${formatYmdKorean(watcher.hit.reservation.payByDate)} ${formatHm(watcher.hit.reservation.payByTime)}`
                      : "코레일에서 확인"}
                  </p>
                  <Button asChild>
                    <a href="https://www.korail.com" target="_blank" rel="noreferrer">
                      코레일에서 결제
                    </a>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted">
                    {watcher.hit.seatClass === "special" ? "특실" : "일반실"} 예약이 가능합니다.
                  </p>
                  <Button
                    disabled={watcher.busy || !settings.korailId}
                    onClick={() => void watcher.reserveNow(watcher.hit!.train, settings, watcher.hit!.seatClass)}
                  >
                    지금 예매
                  </Button>
                </>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
