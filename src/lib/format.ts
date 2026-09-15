import type { SeatState, Train } from "./types";

const KST = "Asia/Seoul";

export function kstNow(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: KST }));
}

export function toYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export function ymdToInput(ymd: string): string {
  if (ymd.length !== 8) return ymd;
  return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
}

export function inputToYmd(value: string): string {
  return value.replaceAll("-", "");
}

export function hhmmssToInput(value: string): string {
  const v = value.padStart(6, "0");
  return `${v.slice(0, 2)}:${v.slice(2, 4)}`;
}

export function inputToHhmmss(value: string): string {
  const digits = value.replaceAll(":", "");
  return `${digits.padEnd(4, "0")}00`.slice(0, 6);
}

export function formatHm(hhmmss: string): string {
  const v = hhmmss.padStart(6, "0");
  return `${v.slice(0, 2)}:${v.slice(2, 4)}`;
}

export function formatYmdKorean(ymd: string): string {
  if (ymd.length !== 8) return ymd;
  return `${Number(ymd.slice(4, 6))}월 ${Number(ymd.slice(6, 8))}일`;
}

export function formatDuration(runMinutes: string): string {
  const raw = runMinutes.replace(/\D/g, "").padStart(4, "0");
  const h = Number(raw.slice(0, 2));
  const m = Number(raw.slice(2, 4));
  if (h <= 0) return `${m}분`;
  return `${h}시간 ${m}분`;
}

export function formatFare(n: number): string {
  return `${n.toLocaleString("ko-KR")}원`;
}

export function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString("ko-KR", {
    timeZone: KST,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function seatState(code: string): SeatState {
  const c = code.trim();
  if (c === "11") return "available";
  if (c === "13") return "soldout";
  if (c === "00" || c === "") return "none";
  return "soldout";
}

export function seatLabel(state: SeatState): string {
  if (state === "available") return "예약가능";
  if (state === "soldout") return "매진";
  if (state === "waiting") return "대기";
  return "없음";
}

export function trainHeadline(train: Train): string {
  return `${train.trainTypeName} ${train.trainNo}  ${train.depName} ${formatHm(train.depTime)} → ${train.arrName} ${formatHm(train.arrTime)}`;
}

export function hasWaiting(flag: string): boolean {
  return flag.trim() === "9";
}

export const HOURS = Array.from({ length: 24 }, (_, i) =>
  `${String(i).padStart(2, "0")}:00`,
);
