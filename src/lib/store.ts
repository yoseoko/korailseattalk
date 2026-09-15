import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SeatOption, TrainKindFilter } from "./types";

export const POLL_SEC_FLOOR = 5;
export const POLL_SEC_CEIL = 120;

export type AppSettings = {
  korailId: string;
  korailPw: string;
  telegramToken: string;
  telegramChatId: string;
  pollMinSec: number;
  pollMaxSec: number;
  autoReserve: boolean;
  tryWaiting: boolean;
  seatOption: SeatOption;
  adults: number;
  children: number;
  seniors: number;
  kind: TrainKindFilter;
  lastDep: string;
  lastArr: string;
  lastDate: string;
  lastTimeStart: string;
  lastTimeEnd: string;
};

const defaults: AppSettings = {
  korailId: "",
  korailPw: "",
  telegramToken: "",
  telegramChatId: "",
  pollMinSec: 5,
  pollMaxSec: 10,
  autoReserve: false,
  tryWaiting: false,
  seatOption: "general-first",
  adults: 1,
  children: 0,
  seniors: 0,
  kind: "ktx",
  lastDep: "서울",
  lastArr: "부산",
  lastDate: "",
  lastTimeStart: "09:00",
  lastTimeEnd: "12:00",
};

export function clampPollSec(value: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(POLL_SEC_CEIL, Math.max(POLL_SEC_FLOOR, value));
}

export function clampPollRange(minSec: number, maxSec: number): { pollMinSec: number; pollMaxSec: number } {
  let min = clampPollSec(minSec, defaults.pollMinSec);
  let max = clampPollSec(maxSec, defaults.pollMaxSec);
  if (min > max) [min, max] = [max, min];
  return { pollMinSec: min, pollMaxSec: max };
}

export function randomPollDelayMs(minSec: number, maxSec: number): number {
  const { pollMinSec, pollMaxSec } = clampPollRange(minSec, maxSec);
  const sec = pollMinSec + Math.random() * (pollMaxSec - pollMinSec);
  return Math.max(POLL_SEC_FLOOR * 1000, Math.round(sec * 1000));
}

export function formatPollSec(sec: number): string {
  const rounded = Math.round(sec * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function formatPollRange(minSec: number, maxSec: number): string {
  const { pollMinSec, pollMaxSec } = clampPollRange(minSec, maxSec);
  const a = formatPollSec(pollMinSec);
  const b = formatPollSec(pollMaxSec);
  return a === b ? `${a}초` : `${a}–${b}초`;
}

type SettingsStore = AppSettings & {
  patch: (partial: Partial<AppSettings>) => void;
};

type LegacySettings = Partial<AppSettings> & { pollSec?: number };

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaults,
      patch: (partial) =>
        set((state) => {
          const next = { ...state, ...partial };
          const range = clampPollRange(next.pollMinSec, next.pollMaxSec);
          return { ...next, ...range };
        }),
    }),
    {
      name: "jaritok-settings",
      version: 1,
      migrate: (persisted, version) => {
        const state = { ...(persisted as LegacySettings) };
        if (version < 1) {
          const old = Number(state.pollSec);
          if (state.pollMinSec == null && Number.isFinite(old) && old > 0) {
            const min = clampPollSec(old, 8);
            state.pollMinSec = min;
            state.pollMaxSec = clampPollSec(old + 4, min);
          }
          delete state.pollSec;
        }
        const range = clampPollRange(
          Number(state.pollMinSec) || defaults.pollMinSec,
          Number(state.pollMaxSec) || defaults.pollMaxSec,
        );
        return { ...defaults, ...state, ...range };
      },
      partialize: (state) => {
        const { patch: _patch, ...rest } = state;
        return rest;
      },
    },
  ),
);
