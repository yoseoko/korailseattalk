import { createCipheriv } from "node:crypto";
import {
  createDynapathIdentity,
  generateDynapathToken,
  KORAIL_USER_AGENT,
  type DynapathIdentity,
} from "./dynapath";
import type { ReservationResult, SeatOption, Train } from "./types";

const BASE = "https://smart.letskorail.com";
const DEVICE = "AD";
const VERSION = "250601003";
const APP_KEY = "korail1234567890";

const PATHS = {
  code: "/classes/com.korail.mobile.common.code.do",
  login: "/classes/com.korail.mobile.login.Login",
  search: "/classes/com.korail.mobile.seatMovie.ScheduleView",
  reserve: "/classes/com.korail.mobile.certification.TicketReservation",
} as const;

const DYNAPATH_PATHS: Set<string> = new Set([PATHS.login, PATHS.search, PATHS.reserve]);

export class KorailError extends Error {
  code: string;
  constructor(message: string, code = "KORAIL") {
    super(message);
    this.name = "KorailError";
    this.code = code;
  }
}

type JsonMap = Record<string, unknown>;

function asRecord(value: unknown): JsonMap {
  return value && typeof value === "object" ? (value as JsonMap) : {};
}

function str(value: unknown, fallback = ""): string {
  if (value == null) return fallback;
  return String(value).trim();
}

function digits(value: string): number {
  const n = Number(value.replace(/\D/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function cookieHeader(jar: Map<string, string>): string {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

function absorbCookies(jar: Map<string, string>, response: Response) {
  const cookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [];
  for (const raw of cookies) {
    const pair = raw.split(";", 1)[0];
    if (!pair) continue;
    const eq = pair.indexOf("=");
    if (eq < 0) continue;
    jar.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
  }
}

function encryptPassword(password: string, aesKey: string): string {
  const key = Buffer.from(aesKey, "utf8");
  const iv = key.subarray(0, 16);
  const algo = key.length === 32 ? "aes-256-cbc" : key.length === 24 ? "aes-192-cbc" : "aes-128-cbc";
  const cipher = createCipheriv(algo, key.subarray(0, algo === "aes-128-cbc" ? 16 : key.length), iv);
  const encrypted = Buffer.concat([cipher.update(password, "utf8"), cipher.final()]);
  return Buffer.from(encrypted.toString("base64")).toString("base64");
}

function loginFlag(id: string): "2" | "4" | "5" {
  if (id.includes("@")) return "5";
  const digitsOnly = id.replace(/\D/g, "");
  if (digitsOnly.length >= 10 && digitsOnly.startsWith("01")) return "4";
  return "2";
}

function normalizeMemberId(id: string): string {
  const trimmed = id.trim();
  if (loginFlag(trimmed) !== "4") return trimmed;
  const d = trimmed.replace(/\D/g, "");
  if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return trimmed;
}

function parseTrains(payload: JsonMap): Train[] {
  const infos = asRecord(payload.trn_infos);
  const raw = infos.trn_info;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return list.map((item) => {
    const t = asRecord(item);
    const trainNo = str(t.h_trn_no);
    const depTime = str(t.h_dpt_tm);
    const depDate = str(t.h_dpt_dt);
    const depCode = str(t.h_dpt_rs_stn_cd);
    const arrCode = str(t.h_arv_rs_stn_cd);
    return {
      id: `${depDate}-${trainNo}-${depTime}-${depCode}-${arrCode}`,
      trainNo,
      trainType: str(t.h_trn_clsf_cd),
      trainTypeName: str(t.h_trn_clsf_nm),
      trainGroup: str(t.h_trn_gp_cd),
      trainGroupName: str(t.h_trn_gp_nm),
      depName: str(t.h_dpt_rs_stn_nm),
      depCode,
      arrName: str(t.h_arv_rs_stn_nm),
      arrCode,
      depDate,
      depTime,
      arrDate: str(t.h_arv_dt),
      arrTime: str(t.h_arv_tm),
      runDate: str(t.h_run_dt),
      runMinutes: str(t.h_run_tm),
      generalSeat: str(t.h_gen_rsv_cd),
      specialSeat: str(t.h_spe_rsv_cd),
      waitFlag: str(t.h_wait_rsv_flg),
      reservePossible: str(t.h_rsv_psb_flg) === "Y",
      priceLabel: str(t.h_rsv_psb_nm).replace(/\n+/g, " · "),
      specialPriceLabel: str(t.h_spe_rsv_psb_nm).replace(/\n+/g, " · "),
      fare: digits(str(t.h_rcvd_amt)),
      delayText: str(t.h_stn_sale_txt),
    } satisfies Train;
  });
}

function bumpTime(hhmmss: string): string {
  const padded = hhmmss.padStart(6, "0");
  const h = Number(padded.slice(0, 2));
  const m = Number(padded.slice(2, 4));
  const total = h * 60 + m + 1;
  if (total >= 24 * 60) return "235900";
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}${String(nm).padStart(2, "0")}00`;
}

function groupCode(kind: string): string {
  if (kind === "ktx") return "100";
  if (kind === "itx") return "101";
  if (kind === "mugunghwa") return "102";
  return "109";
}

function sameStation(actual: string, wanted: string): boolean {
  return actual.replace(/\s+/g, "") === wanted.replace(/\s+/g, "");
}

export function trainMatchesSeat(train: Train, option: SeatOption): "general" | "special" | null {
  const gen = train.generalSeat === "11";
  const spe = train.specialSeat === "11";
  if (option === "general-only") return gen ? "general" : null;
  if (option === "special-only") return spe ? "special" : null;
  if (option === "special-first") {
    if (spe) return "special";
    if (gen) return "general";
    return null;
  }
  if (gen) return "general";
  if (spe) return "special";
  return null;
}

export class KorailClient {
  private identity: DynapathIdentity = createDynapathIdentity();
  private cookies = new Map<string, string>();
  private sessionKey = APP_KEY;
  membershipNumber = "";
  displayName = "";

  private async request(
    path: string,
    params: Record<string, string>,
    method: "GET" | "POST" = "GET",
  ): Promise<JsonMap> {
    const url = new URL(path, BASE);
    const body = new URLSearchParams(params);
    const headers: Record<string, string> = {
      "User-Agent": KORAIL_USER_AGENT,
      Accept: "application/json, text/javascript, */*;q=0.1",
    };
    if (this.cookies.size) headers.Cookie = cookieHeader(this.cookies);
    if (DYNAPATH_PATHS.has(path)) {
      headers["x-dynapath-m-token"] = generateDynapathToken(this.identity);
    }
    let response: Response;
    if (method === "GET") {
      url.search = body.toString();
      response = await fetch(url, { method: "GET", headers });
    } else {
      headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
      response = await fetch(url, { method: "POST", headers, body });
    }
    absorbCookies(this.cookies, response);
    const dynapathResult = response.headers.get("DynaPath-Result") ?? response.headers.get("dynapath-result");
    const text = await response.text();
    if (response.status === 403 || (dynapathResult != null && Number(dynapathResult) < 0)) {
      throw new KorailError("코레일 보안 검증에 실패했습니다. 잠시 후 다시 조회하세요.", "DYNAPATH");
    }
    let json: JsonMap;
    try {
      json = JSON.parse(text) as JsonMap;
    } catch {
      throw new KorailError(
        response.ok ? "코레일 응답을 해석하지 못했습니다." : `코레일 서버 오류 (${response.status})`,
        "PARSE",
      );
    }
    const code = str(json.h_msg_cd);
    const message = str(json.h_msg_txt) || "코레일 요청이 실패했습니다.";
    const result = str(json.strResult);
    if (!response.ok) {
      throw new KorailError(message, code || `HTTP_${response.status}`);
    }
    if (code === "MACRO ERROR" || result === "FAIL") {
      throw new KorailError(message, code || "FAIL");
    }
    if (code && !code.startsWith("I") && !code.startsWith("P") && code !== "API.I00000") {
      throw new KorailError(message, code);
    }
    if (!code && !result) {
      throw new KorailError("코레일에서 빈 응답을 받았습니다.", "EMPTY");
    }
    return json;
  }

  async searchPage(input: {
    dep: string;
    arr: string;
    date: string;
    time: string;
    adults: number;
    children: number;
    seniors: number;
    kind?: string;
  }): Promise<Train[]> {
    const group = groupCode(input.kind ?? "all");
    const payload = await this.request(PATHS.search, {
      Device: DEVICE,
      Version: VERSION,
      Key: this.sessionKey,
      Sid: "",
      radJobId: "1",
      selGoTrain: group,
      txtCardPsgCnt: "0",
      txtGdNo: "",
      txtGoAbrdDt: input.date,
      txtGoEnd: input.arr,
      txtGoHour: input.time,
      txtGoStart: input.dep,
      txtJobDv: "",
      txtMenuId: "11",
      txtPsgFlg_1: String(input.adults),
      txtPsgFlg_2: String(input.children),
      txtPsgFlg_8: "0",
      txtPsgFlg_3: String(input.seniors),
      txtPsgFlg_4: "0",
      txtPsgFlg_5: "0",
      txtSeatAttCd_2: "000",
      txtSeatAttCd_3: "000",
      txtSeatAttCd_4: "015",
      txtTrnGpCd: group,
    });
    return parseTrains(payload);
  }

  async searchWindow(input: {
    dep: string;
    arr: string;
    date: string;
    timeStart: string;
    timeEnd: string;
    adults: number;
    children: number;
    seniors: number;
    kind?: string;
  }): Promise<Train[]> {
    const seen = new Set<string>();
    const all: Train[] = [];
    let cursor = input.timeStart;
    for (let i = 0; i < 8; i++) {
      let page: Train[] = [];
      try {
        page = await this.searchPage({ ...input, time: cursor });
      } catch (error) {
        if (error instanceof KorailError && /없|결과/.test(error.message)) break;
        throw error;
      }
      if (page.length === 0) break;
      for (const train of page) {
        if (train.depTime > input.timeEnd) continue;
        if (!sameStation(train.depName, input.dep) || !sameStation(train.arrName, input.arr)) continue;
        if (seen.has(train.id)) continue;
        seen.add(train.id);
        all.push(train);
      }
      const last = page[page.length - 1];
      if (!last) break;
      if (last.depTime >= input.timeEnd || last.depTime >= "235800") break;
      cursor = bumpTime(last.depTime);
    }
    return all.sort((a, b) => a.depTime.localeCompare(b.depTime));
  }

  async login(memberId: string, password: string): Promise<{ name: string; membershipNumber: string }> {
    const codeJson = await this.request(
      PATHS.code,
      { code: "app.login.cphd", Device: DEVICE, Version: VERSION },
      "POST",
    );
    const cphd = asRecord(asRecord(codeJson)["app.login.cphd"]);
    const idx = str(cphd.idx);
    const aesKey = str(cphd.key);
    if (!idx || !aesKey) throw new KorailError("로그인 암호키를 받지 못했습니다.", "LOGIN_KEY");

    const normalized = normalizeMemberId(memberId);
    const payload = await this.request(
      PATHS.login,
      {
        Device: DEVICE,
        Version: "231231001",
        txtInputFlg: loginFlag(normalized),
        txtMemberNo: normalized,
        txtPwd: encryptPassword(password, aesKey),
        idx,
      },
      "POST",
    );
    this.sessionKey = str(payload.Key, this.sessionKey);
    this.membershipNumber = str(payload.strMbCrdNo);
    this.displayName = str(payload.strCustNm);
    if (!this.membershipNumber && !this.displayName) {
      throw new KorailError(str(payload.h_msg_txt, "로그인에 실패했습니다."), str(payload.h_msg_cd, "LOGIN"));
    }
    return { name: this.displayName, membershipNumber: this.membershipNumber };
  }

  async reserve(input: {
    train: Train;
    adults: number;
    children: number;
    seniors: number;
    seatClass: "general" | "special";
    waiting: boolean;
  }): Promise<ReservationResult> {
    const passengers: Array<{ type: string; disc: string; count: number }> = [];
    if (input.adults > 0) passengers.push({ type: "1", disc: "000", count: input.adults });
    if (input.children > 0) passengers.push({ type: "3", disc: "000", count: input.children });
    if (input.seniors > 0) passengers.push({ type: "1", disc: "131", count: input.seniors });
    if (passengers.length === 0) passengers.push({ type: "1", disc: "000", count: 1 });
    const total = passengers.reduce((sum, p) => sum + p.count, 0);

    const params: Record<string, string> = {
      Device: DEVICE,
      Version: VERSION,
      Key: this.sessionKey,
      txtGdNo: "",
      txtJobId: input.waiting ? "1102" : "1101",
      txtTotPsgCnt: String(total),
      txtSeatAttCd1: "000",
      txtSeatAttCd2: "000",
      txtSeatAttCd3: "000",
      txtSeatAttCd4: "015",
      txtSeatAttCd5: "000",
      hidFreeFlg: "N",
      txtStndFlg: "N",
      txtMenuId: "11",
      txtSrcarCnt: "0",
      txtJrnyCnt: "1",
      txtJrnySqno1: "001",
      txtJrnyTpCd1: "11",
      txtDptDt1: input.train.depDate,
      txtDptRsStnCd1: input.train.depCode,
      txtDptTm1: input.train.depTime,
      txtArvRsStnCd1: input.train.arrCode,
      txtTrnNo1: input.train.trainNo,
      txtRunDt1: input.train.runDate,
      txtTrnClsfCd1: input.train.trainType,
      txtPsrmClCd1: input.seatClass === "special" ? "2" : "1",
      txtTrnGpCd1: input.train.trainGroup,
      txtChgFlg1: "",
      txtJrnySqno2: "",
      txtJrnyTpCd2: "",
      txtDptDt2: "",
      txtDptRsStnCd2: "",
      txtDptTm2: "",
      txtArvRsStnCd2: "",
      txtTrnNo2: "",
      txtRunDt2: "",
      txtTrnClsfCd2: "",
      txtPsrmClCd2: "",
      txtChgFlg2: "",
    };
    passengers.forEach((p, i) => {
      const n = String(i + 1);
      params[`txtPsgTpCd${n}`] = p.type;
      params[`txtDiscKndCd${n}`] = p.disc;
      params[`txtCompaCnt${n}`] = String(p.count);
      params[`txtCardCode_${n}`] = "";
      params[`txtCardNo_${n}`] = "";
      params[`txtCardPw_${n}`] = "";
    });

    const payload = await this.request(PATHS.reserve, params, "GET");
    const pnr = str(payload.h_pnr_no);
    if (!pnr) {
      throw new KorailError(str(payload.h_msg_txt, "예매에 실패했습니다."), str(payload.h_msg_cd, "RESERVE"));
    }
    return {
      pnr,
      trainSummary: `${input.train.trainTypeName} ${input.train.trainNo}`,
      fare: digits(str(payload.h_rsv_amt)) || input.train.fare,
      seatCount: digits(str(payload.h_tot_seat_cnt)) || total,
      payByDate: str(payload.h_ntisu_lmt_dt),
      payByTime: str(payload.h_ntisu_lmt_tm),
      message: str(payload.h_msg_txt, "예약되었습니다."),
    };
  }
}

export function matchesKind(train: Train, kind: string): boolean {
  if (kind === "ktx") return train.trainGroup === "100" || train.trainTypeName.includes("KTX");
  if (kind === "itx") return /ITX|새마을/.test(train.trainTypeName);
  if (kind === "mugunghwa") return train.trainTypeName.includes("무궁화") || train.trainTypeName.includes("누리로");
  return true;
}
