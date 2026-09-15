import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { formatHm, formatYmdKorean, trainHeadline } from "./format";
import { KorailClient, KorailError, matchesKind, trainMatchesSeat } from "./korail.server";
import {
  discoverTelegramChatId,
  getTelegramMe,
  sendTelegramMessage,
  TelegramError,
} from "./telegram.server";
import type { ReservationResult, SeatOption, Train, WatchHit } from "./types";

const passengersSchema = z.object({
  adults: z.number().int().min(1).max(9),
  children: z.number().int().min(0).max(8),
  seniors: z.number().int().min(0).max(8),
});

const searchSchema = z
  .object({
    dep: z.string().min(1),
    arr: z.string().min(1),
    date: z.string().regex(/^\d{8}$/),
    timeStart: z.string().regex(/^\d{6}$/),
    timeEnd: z.string().regex(/^\d{6}$/),
    kind: z.enum(["all", "ktx", "itx", "mugunghwa"]),
  })
  .merge(passengersSchema);

const credentialsSchema = z.object({
  korailId: z.string(),
  korailPw: z.string(),
});

const telegramSchema = z.object({
  token: z.string().min(10),
  chatId: z.string().optional(),
});

const trainSchema = z.object({
  id: z.string(),
  trainNo: z.string(),
  trainType: z.string(),
  trainTypeName: z.string(),
  trainGroup: z.string(),
  trainGroupName: z.string(),
  depName: z.string(),
  depCode: z.string(),
  arrName: z.string(),
  arrCode: z.string(),
  depDate: z.string(),
  depTime: z.string(),
  arrDate: z.string(),
  arrTime: z.string(),
  runDate: z.string(),
  runMinutes: z.string(),
  generalSeat: z.string(),
  specialSeat: z.string(),
  waitFlag: z.string(),
  reservePossible: z.boolean(),
  priceLabel: z.string(),
  specialPriceLabel: z.string(),
  fare: z.number(),
  delayText: z.string(),
});

function failMessage(error: unknown): string {
  if (error instanceof KorailError || error instanceof TelegramError) return error.message;
  if (error instanceof Error) return error.message;
  return "요청을 처리하지 못했습니다.";
}

export const searchTrains = createServerFn({ method: "POST" })
  .validator(searchSchema)
  .handler(async ({ data }): Promise<{ trains: Train[]; error?: string }> => {
    try {
      const client = new KorailClient();
      const trains = await client.searchWindow(data);
      const filtered = trains.filter((train) => matchesKind(train, data.kind));
      return { trains: filtered };
    } catch (error) {
      return { trains: [], error: failMessage(error) };
    }
  });

export const testKorailLogin = createServerFn({ method: "POST" })
  .validator(credentialsSchema)
  .handler(async ({ data }): Promise<{ ok: boolean; name?: string; membershipNumber?: string; error?: string }> => {
    if (!data.korailId.trim() || !data.korailPw) {
      return { ok: false, error: "코레일 아이디와 비밀번호를 입력하세요." };
    }
    try {
      const client = new KorailClient();
      const profile = await client.login(data.korailId, data.korailPw);
      return { ok: true, ...profile };
    } catch (error) {
      return { ok: false, error: failMessage(error) };
    }
  });

export const testTelegram = createServerFn({ method: "POST" })
  .validator(telegramSchema)
  .handler(async ({ data }): Promise<{ ok: boolean; username?: string; error?: string }> => {
    try {
      const me = await getTelegramMe(data.token);
      if (data.chatId) {
        await sendTelegramMessage(
          data.token,
          data.chatId,
          "자리톡 연결 확인\n이 채팅으로 좌석·예매 알림을 보냅니다.",
        );
      }
      return { ok: true, username: me.username || me.name };
    } catch (error) {
      return { ok: false, error: failMessage(error) };
    }
  });

export const findTelegramChat = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string().min(10) }))
  .handler(async ({ data }): Promise<{ ok: boolean; chatId?: string; error?: string }> => {
    try {
      const chatId = await discoverTelegramChatId(data.token);
      return { ok: true, chatId };
    } catch (error) {
      return { ok: false, error: failMessage(error) };
    }
  });

const reserveSchema = credentialsSchema
  .merge(passengersSchema)
  .extend({
    train: trainSchema,
    seatClass: z.enum(["general", "special"]),
    waiting: z.boolean(),
    telegramToken: z.string(),
    telegramChatId: z.string(),
  });

async function notifyTelegram(token: string, chatId: string, text: string) {
  if (!token || !chatId) return;
  try {
    await sendTelegramMessage(token, chatId, text);
  } catch {
    // Notification failure should not roll back a successful hold.
  }
}

export const reserveTrain = createServerFn({ method: "POST" })
  .validator(reserveSchema)
  .handler(async ({ data }): Promise<{ ok: boolean; reservation?: ReservationResult; error?: string }> => {
    try {
      const client = new KorailClient();
      await client.login(data.korailId, data.korailPw);
      const reservation = await client.reserve({
        train: data.train,
        adults: data.adults,
        children: data.children,
        seniors: data.seniors,
        seatClass: data.seatClass,
        waiting: data.waiting,
      });
      const pay =
        reservation.payByDate && reservation.payByTime
          ? `${formatYmdKorean(reservation.payByDate)} ${formatHm(reservation.payByTime)}`
          : "확인 필요";
      await notifyTelegram(
        data.telegramToken,
        data.telegramChatId,
        [
          "자리톡 예매 완료",
          trainHeadline(data.train),
          `예약번호 ${reservation.pnr}`,
          `인원 ${reservation.seatCount} · ${reservation.fare.toLocaleString("ko-KR")}원`,
          `결제 기한 ${pay}`,
          "코레일에서 10분 안에 결제하세요.",
          "https://www.korail.com",
        ].join("\n"),
      );
      return { ok: true, reservation };
    } catch (error) {
      return { ok: false, error: failMessage(error) };
    }
  });

const watchSchema = searchSchema.extend({
  trainIds: z.array(z.string()).min(1),
  seatOption: z.enum(["general-first", "general-only", "special-first", "special-only"]),
  autoReserve: z.boolean(),
  tryWaiting: z.boolean(),
  korailId: z.string(),
  korailPw: z.string(),
  telegramToken: z.string(),
  telegramChatId: z.string(),
});

export const pollWatch = createServerFn({ method: "POST" })
  .validator(watchSchema)
  .handler(
    async ({
      data,
    }): Promise<{
      trains: Train[];
      hits: WatchHit[];
      error?: string;
    }> => {
      try {
        const client = new KorailClient();
        const trains = (await client.searchWindow(data)).filter((train) => matchesKind(train, data.kind));
        const wanted = new Set(data.trainIds);
        const hits: WatchHit[] = [];

        for (const train of trains) {
          if (!wanted.has(train.id)) continue;
          const seatClass = trainMatchesSeat(train, data.seatOption as SeatOption);
          const waitingOk = data.tryWaiting && train.waitFlag.trim() === "9";
          if (!seatClass && !waitingOk) continue;

          let reservation: ReservationResult | null = null;
          if (data.autoReserve && data.korailId && data.korailPw) {
            try {
              await client.login(data.korailId, data.korailPw);
              reservation = await client.reserve({
                train,
                adults: data.adults,
                children: data.children,
                seniors: data.seniors,
                seatClass: seatClass ?? "general",
                waiting: !seatClass && waitingOk,
              });
              const pay =
                reservation.payByDate && reservation.payByTime
                  ? `${formatYmdKorean(reservation.payByDate)} ${formatHm(reservation.payByTime)}`
                  : "확인 필요";
              await notifyTelegram(
                data.telegramToken,
                data.telegramChatId,
                [
                  "자리톡 예매 완료",
                  trainHeadline(train),
                  `예약번호 ${reservation.pnr}`,
                  `결제 기한 ${pay}`,
                  "코레일에서 바로 결제하세요.",
                  "https://www.korail.com",
                ].join("\n"),
              );
            } catch (error) {
              await notifyTelegram(
                data.telegramToken,
                data.telegramChatId,
                `자리톡 좌석 발생 · 예매 실패\n${trainHeadline(train)}\n${failMessage(error)}`,
              );
            }
          } else {
            await notifyTelegram(
              data.telegramToken,
              data.telegramChatId,
              `자리톡 좌석 발생\n${trainHeadline(train)}\n${seatClass === "special" ? "특실" : "일반실"} 예약 가능\n감시 화면에서 예매하세요.`,
            );
          }

          hits.push({ train, seatClass: seatClass ?? "general", reservation });
          if (reservation) break;
        }

        return { trains, hits };
      } catch (error) {
        return { trains: [], hits: [], error: failMessage(error) };
      }
    },
  );
