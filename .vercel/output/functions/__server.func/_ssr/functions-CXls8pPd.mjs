import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as formatHm, m as trainHeadline, o as formatYmdKorean } from "./format-Ct9r7IUy.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
import { createCipheriv } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/functions-CXls8pPd.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var BASE_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var TABLE_INDEX = 1;
var RANDOM_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
var I8 = 161;
var I9 = 30;
var I10 = 2;
var APP_ID = "com.korail.talk";
var OS_TYPE = "Android";
var SDK_VERSION = "v1.0.3";
var AS_VALUE = "[38ff229cb34c7dda8e28220a2d750cce]";
var DEVICE_MODEL = "SM-S928N";
var OS_VERSION = "15";
function primeTable(count = 100) {
	const primes = [];
	let candidate = 2;
	while (primes.length < count + 1) {
		let isPrime = true;
		for (const prime of primes) {
			if (prime * prime > candidate) break;
			if (candidate % prime === 0) {
				isPrime = false;
				break;
			}
		}
		if (isPrime) primes.push(candidate);
		candidate += 1;
	}
	return primes.slice(1);
}
var PRIMES = primeTable();
function sdkPermuteAlphabet(value, multiplier, step) {
	const length = value.length;
	let blockSize = 1;
	for (const prime of PRIMES) if (prime <= length) blockSize = prime;
	else break;
	const counts = new Array(blockSize).fill(0);
	const chars = new Array(blockSize).fill("");
	let factor = 1;
	for (let idx = 0; idx < blockSize; idx++) {
		const target = factor % blockSize * step % blockSize;
		counts[target] += 1;
		if (counts[target] === 1) chars[idx] = value[target] ?? "";
		factor = factor * multiplier % blockSize;
	}
	const encoded = [];
	const missing = [];
	for (let idx = 0; idx < chars.length; idx++) {
		const ch = chars[idx];
		if (ch) {
			encoded.push(ch);
			continue;
		}
		for (let missingIdx = 0; missingIdx < blockSize; missingIdx++) if (counts[missingIdx] === 0) {
			const replacement = value[missingIdx] ?? "";
			chars[idx] = replacement;
			missing.push(replacement);
			counts[missingIdx] = 1;
			break;
		}
	}
	while (blockSize < length) {
		missing.push(value[blockSize] ?? "");
		blockSize += 1;
	}
	const missingText = missing.join("");
	if (missingText.length < (PRIMES[0] ?? 3)) return encoded.join("") + missingText;
	return encoded.join("") + sdkPermuteAlphabet(missingText, multiplier, step);
}
function encodingTable(index = TABLE_INDEX) {
	return sdkPermuteAlphabet(BASE_ALPHABET, PRIMES[index % 29] ?? 3, PRIMES[Math.floor(index / 29) % 29] ?? 3);
}
function buildPrefix(table, tableIndex = TABLE_INDEX, i11 = 2, i12 = 30) {
	return `${String.fromCharCode(tableIndex + 97)}${table[2]}${table[37]}${table[i11]}${table[i12 - 1]}`;
}
function stringToXa1s(data) {
	const result = [];
	for (const ch of data) {
		const cp = ch.codePointAt(0) ?? 0;
		if (cp < 128) result.push(cp);
		else if (cp < 2048) {
			result.push(128 | cp >> 7 & 15);
			result.push(cp & 127);
		} else if (cp >= 262144) {
			result.push(160);
			result.push(cp >> 14 & 127);
			result.push(cp >> 7 & 127);
			result.push(cp & 127);
		} else if ((63488 & cp) !== 55296) {
			result.push(cp >> 14 & 15 | 144);
			result.push(cp >> 7 & 127);
			result.push(cp & 127);
		}
	}
	return result;
}
function makeDynapathKey(key) {
	let value = 0n;
	for (const ch of key) {
		const cp = ch.codePointAt(0) ?? 0;
		let bit = 32768;
		for (let i = 0; i < 16; i++) {
			if (bit & cp) break;
			bit >>= 1;
		}
		value = value * BigInt(bit << 1) + BigInt(cp);
	}
	return value;
}
function pickTableChar(baseTable, remainder, used) {
	let count = 0;
	for (const ch of baseTable) if (!used.includes(ch)) {
		if (count === remainder) return ch;
		count += 1;
	}
	return " ";
}
function makeEncodeTable(num, encodeSize, baseTable) {
	let result = "";
	let temp = num;
	for (let i = 0; i < encodeSize; i++) {
		const divisor = BigInt(encodeSize - i);
		const remainder = Number(temp % divisor);
		result += pickTableChar(baseTable, remainder, result);
		temp = temp / divisor;
	}
	return result;
}
function encodeNormalBe(data, table, i8 = I8, i9 = I9, i10 = I10) {
	const bytesLike = stringToXa1s(data);
	const out = [];
	const arr = new Array(i10 + 1).fill(0);
	let idx = 0;
	let remain = bytesLike.length % i10;
	const fullLen = bytesLike.length - remain;
	while (idx < fullLen) {
		let val = 0;
		for (let i = 0; i < i10; i++) {
			val = val * i8 + (bytesLike[idx] ?? 0);
			idx += 1;
		}
		for (let i = 0; i < i10 + 1; i++) {
			arr[i] = val % i9;
			val = Math.floor(val / i9);
		}
		for (let i = i10; i >= 0; i--) out.push(table[arr[i] ?? 0] ?? "");
	}
	if (remain > 0) {
		let val = 0;
		for (let i = 0; i < remain; i++) {
			val = val * i8 + (bytesLike[idx] ?? 0);
			idx += 1;
		}
		for (let i = 0; i < remain + 1; i++) {
			arr[i] = val % i9;
			val = Math.floor(val / i9);
		}
		while (remain >= 0) {
			out.push(table[arr[remain] ?? 0] ?? "");
			remain -= 1;
		}
	}
	return out.join("");
}
function javaUrlEncode(value) {
	return encodeURIComponent(value).replace(/%20/g, "+").replace(/[!'()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`).replace(/%7E/gi, "%7E");
}
function javaFormEncode(fields) {
	return fields.map(([k, v]) => `${javaUrlEncode(k)}=${javaUrlEncode(v)}`).join("&");
}
function randomText() {
	const bytes = /* @__PURE__ */ new Uint8Array(4);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (b) => RANDOM_ALPHABET[b % 62]).join("");
}
function randomDeviceId() {
	const bytes = /* @__PURE__ */ new Uint8Array(8);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
function createDynapathIdentity() {
	return {
		deviceId: randomDeviceId(),
		appStartTs: String(Date.now() - 9e4)
	};
}
function generateDynapathToken(identity, opts) {
	const table = encodingTable(TABLE_INDEX);
	const ts = opts?.timestampMs ?? Date.now();
	const rand = opts?.randomText ?? randomText();
	const payload = javaFormEncode([
		["ai", APP_ID],
		["di", identity.deviceId],
		["as", AS_VALUE],
		["su", "false"],
		["dbg", "false"],
		["emu", "false"],
		["hk", "false"],
		["it", identity.appStartTs],
		["ts", String(ts)],
		["rt", "0"],
		["os", OS_VERSION],
		["dm", DEVICE_MODEL],
		["st", OS_TYPE],
		["sv", SDK_VERSION]
	]);
	const dynKey = `${SDK_VERSION}+${rand}+${ts}`;
	const encodedKey = encodeNormalBe(dynKey, table);
	const encodedBody = encodeNormalBe(payload, makeEncodeTable(makeDynapathKey(dynKey), I9, table));
	return `${buildPrefix(table, TABLE_INDEX, I10, I9)}${table[encodedKey.length] ?? table[encodedKey.length % table.length] ?? "A"}${encodedKey}${encodedBody}`;
}
var KORAIL_USER_AGENT = "Dalvik/2.1.0 (Linux; U; Android 15; SM-S928N Build/AP3A.240905.015.A2)";
var BASE = "https://smart.letskorail.com";
var DEVICE = "AD";
var VERSION = "250601003";
var APP_KEY = "korail1234567890";
var PATHS = {
	code: "/classes/com.korail.mobile.common.code.do",
	login: "/classes/com.korail.mobile.login.Login",
	search: "/classes/com.korail.mobile.seatMovie.ScheduleView",
	reserve: "/classes/com.korail.mobile.certification.TicketReservation"
};
var DYNAPATH_PATHS = /* @__PURE__ */ new Set([
	PATHS.login,
	PATHS.search,
	PATHS.reserve
]);
var KorailError = class extends Error {
	code;
	constructor(message, code = "KORAIL") {
		super(message);
		this.name = "KorailError";
		this.code = code;
	}
};
function asRecord(value) {
	return value && typeof value === "object" ? value : {};
}
function str(value, fallback = "") {
	if (value == null) return fallback;
	return String(value).trim();
}
function digits(value) {
	const n = Number(value.replace(/\D/g, ""));
	return Number.isFinite(n) ? n : 0;
}
function cookieHeader(jar) {
	return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}
function absorbCookies(jar, response) {
	const cookies = typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : [];
	for (const raw of cookies) {
		const pair = raw.split(";", 1)[0];
		if (!pair) continue;
		const eq = pair.indexOf("=");
		if (eq < 0) continue;
		jar.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
	}
}
function encryptPassword(password, aesKey) {
	const key = Buffer.from(aesKey, "utf8");
	const iv = key.subarray(0, 16);
	const algo = key.length === 32 ? "aes-256-cbc" : key.length === 24 ? "aes-192-cbc" : "aes-128-cbc";
	const cipher = createCipheriv(algo, key.subarray(0, algo === "aes-128-cbc" ? 16 : key.length), iv);
	const encrypted = Buffer.concat([cipher.update(password, "utf8"), cipher.final()]);
	return Buffer.from(encrypted.toString("base64")).toString("base64");
}
function loginFlag(id) {
	if (id.includes("@")) return "5";
	const digitsOnly = id.replace(/\D/g, "");
	if (digitsOnly.length >= 10 && digitsOnly.startsWith("01")) return "4";
	return "2";
}
function normalizeMemberId(id) {
	const trimmed = id.trim();
	if (loginFlag(trimmed) !== "4") return trimmed;
	const d = trimmed.replace(/\D/g, "");
	if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
	if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
	return trimmed;
}
function parseTrains(payload) {
	const raw = asRecord(payload.trn_infos).trn_info;
	return (Array.isArray(raw) ? raw : raw ? [raw] : []).map((item) => {
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
			delayText: str(t.h_stn_sale_txt)
		};
	});
}
function bumpTime(hhmmss) {
	const padded = hhmmss.padStart(6, "0");
	const h = Number(padded.slice(0, 2));
	const m = Number(padded.slice(2, 4));
	const total = h * 60 + m + 1;
	if (total >= 1440) return "235900";
	const nh = Math.floor(total / 60);
	const nm = total % 60;
	return `${String(nh).padStart(2, "0")}${String(nm).padStart(2, "0")}00`;
}
function groupCode(kind) {
	if (kind === "ktx") return "100";
	if (kind === "itx") return "101";
	if (kind === "mugunghwa") return "102";
	return "109";
}
function sameStation(actual, wanted) {
	return actual.replace(/\s+/g, "") === wanted.replace(/\s+/g, "");
}
function trainMatchesSeat(train, option) {
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
var KorailClient = class {
	identity = createDynapathIdentity();
	cookies = /* @__PURE__ */ new Map();
	sessionKey = APP_KEY;
	membershipNumber = "";
	displayName = "";
	async request(path, params, method = "GET") {
		const url = new URL(path, BASE);
		const body = new URLSearchParams(params);
		const headers = {
			"User-Agent": KORAIL_USER_AGENT,
			Accept: "application/json, text/javascript, */*;q=0.1"
		};
		if (this.cookies.size) headers.Cookie = cookieHeader(this.cookies);
		if (DYNAPATH_PATHS.has(path)) headers["x-dynapath-m-token"] = generateDynapathToken(this.identity);
		let response;
		if (method === "GET") {
			url.search = body.toString();
			response = await fetch(url, {
				method: "GET",
				headers
			});
		} else {
			headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
			response = await fetch(url, {
				method: "POST",
				headers,
				body
			});
		}
		absorbCookies(this.cookies, response);
		const dynapathResult = response.headers.get("DynaPath-Result") ?? response.headers.get("dynapath-result");
		const text = await response.text();
		if (response.status === 403 || dynapathResult != null && Number(dynapathResult) < 0) throw new KorailError("코레일 보안 검증에 실패했습니다. 잠시 후 다시 조회하세요.", "DYNAPATH");
		let json;
		try {
			json = JSON.parse(text);
		} catch {
			throw new KorailError(response.ok ? "코레일 응답을 해석하지 못했습니다." : `코레일 서버 오류 (${response.status})`, "PARSE");
		}
		const code = str(json.h_msg_cd);
		const message = str(json.h_msg_txt) || "코레일 요청이 실패했습니다.";
		const result = str(json.strResult);
		if (!response.ok) throw new KorailError(message, code || `HTTP_${response.status}`);
		if (code === "MACRO ERROR" || result === "FAIL") throw new KorailError(message, code || "FAIL");
		if (code && !code.startsWith("I") && !code.startsWith("P") && code !== "API.I00000") throw new KorailError(message, code);
		if (!code && !result) throw new KorailError("코레일에서 빈 응답을 받았습니다.", "EMPTY");
		return json;
	}
	async searchPage(input) {
		const group = groupCode(input.kind ?? "all");
		return parseTrains(await this.request(PATHS.search, {
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
			txtTrnGpCd: group
		}));
	}
	async searchWindow(input) {
		const seen = /* @__PURE__ */ new Set();
		const all = [];
		let cursor = input.timeStart;
		for (let i = 0; i < 8; i++) {
			let page = [];
			try {
				page = await this.searchPage({
					...input,
					time: cursor
				});
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
	async login(memberId, password) {
		const cphd = asRecord(asRecord(await this.request(PATHS.code, {
			code: "app.login.cphd",
			Device: DEVICE,
			Version: VERSION
		}, "POST"))["app.login.cphd"]);
		const idx = str(cphd.idx);
		const aesKey = str(cphd.key);
		if (!idx || !aesKey) throw new KorailError("로그인 암호키를 받지 못했습니다.", "LOGIN_KEY");
		const normalized = normalizeMemberId(memberId);
		const payload = await this.request(PATHS.login, {
			Device: DEVICE,
			Version: "231231001",
			txtInputFlg: loginFlag(normalized),
			txtMemberNo: normalized,
			txtPwd: encryptPassword(password, aesKey),
			idx
		}, "POST");
		this.sessionKey = str(payload.Key, this.sessionKey);
		this.membershipNumber = str(payload.strMbCrdNo);
		this.displayName = str(payload.strCustNm);
		if (!this.membershipNumber && !this.displayName) throw new KorailError(str(payload.h_msg_txt, "로그인에 실패했습니다."), str(payload.h_msg_cd, "LOGIN"));
		return {
			name: this.displayName,
			membershipNumber: this.membershipNumber
		};
	}
	async reserve(input) {
		const passengers = [];
		if (input.adults > 0) passengers.push({
			type: "1",
			disc: "000",
			count: input.adults
		});
		if (input.children > 0) passengers.push({
			type: "3",
			disc: "000",
			count: input.children
		});
		if (input.seniors > 0) passengers.push({
			type: "1",
			disc: "131",
			count: input.seniors
		});
		if (passengers.length === 0) passengers.push({
			type: "1",
			disc: "000",
			count: 1
		});
		const total = passengers.reduce((sum, p) => sum + p.count, 0);
		const params = {
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
			txtChgFlg2: ""
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
		if (!pnr) throw new KorailError(str(payload.h_msg_txt, "예매에 실패했습니다."), str(payload.h_msg_cd, "RESERVE"));
		return {
			pnr,
			trainSummary: `${input.train.trainTypeName} ${input.train.trainNo}`,
			fare: digits(str(payload.h_rsv_amt)) || input.train.fare,
			seatCount: digits(str(payload.h_tot_seat_cnt)) || total,
			payByDate: str(payload.h_ntisu_lmt_dt),
			payByTime: str(payload.h_ntisu_lmt_tm),
			message: str(payload.h_msg_txt, "예약되었습니다.")
		};
	}
};
function matchesKind(train, kind) {
	if (kind === "ktx") return train.trainGroup === "100" || train.trainTypeName.includes("KTX");
	if (kind === "itx") return /ITX|새마을/.test(train.trainTypeName);
	if (kind === "mugunghwa") return train.trainTypeName.includes("무궁화") || train.trainTypeName.includes("누리로");
	return true;
}
var TelegramError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "TelegramError";
	}
};
async function telegramCall(token, method, body) {
	const json = await (await fetch(`https://api.telegram.org/bot${token}/${method}`, {
		method: body ? "POST" : "GET",
		headers: body ? { "Content-Type": "application/json" } : void 0,
		body: body ? JSON.stringify(body) : void 0
	})).json();
	if (!json.ok) throw new TelegramError(json.description || "텔레그램 요청이 실패했습니다.");
	return json;
}
async function getTelegramMe(token) {
	const json = await telegramCall(token, "getMe");
	return {
		username: json.result?.username || "",
		name: json.result?.first_name || ""
	};
}
async function sendTelegramMessage(token, chatId, text) {
	await telegramCall(token, "sendMessage", {
		chat_id: chatId,
		text,
		disable_web_page_preview: true
	});
}
async function discoverTelegramChatId(token) {
	const updates = (await telegramCall(token, "getUpdates", {
		limit: 20,
		timeout: 0
	})).result || [];
	for (let i = updates.length - 1; i >= 0; i--) {
		const id = updates[i]?.message?.chat?.id;
		if (id != null) return String(id);
	}
	throw new TelegramError("최근 대화가 없습니다. 봇에게 아무 메시지나 보낸 뒤 다시 시도하세요.");
}
var passengersSchema = object({
	adults: number().int().min(1).max(9),
	children: number().int().min(0).max(8),
	seniors: number().int().min(0).max(8)
});
var searchSchema = object({
	dep: string().min(1),
	arr: string().min(1),
	date: string().regex(/^\d{8}$/),
	timeStart: string().regex(/^\d{6}$/),
	timeEnd: string().regex(/^\d{6}$/),
	kind: _enum([
		"all",
		"ktx",
		"itx",
		"mugunghwa"
	])
}).merge(passengersSchema);
var credentialsSchema = object({
	korailId: string(),
	korailPw: string()
});
var telegramSchema = object({
	token: string().min(10),
	chatId: string().optional()
});
var trainSchema = object({
	id: string(),
	trainNo: string(),
	trainType: string(),
	trainTypeName: string(),
	trainGroup: string(),
	trainGroupName: string(),
	depName: string(),
	depCode: string(),
	arrName: string(),
	arrCode: string(),
	depDate: string(),
	depTime: string(),
	arrDate: string(),
	arrTime: string(),
	runDate: string(),
	runMinutes: string(),
	generalSeat: string(),
	specialSeat: string(),
	waitFlag: string(),
	reservePossible: boolean(),
	priceLabel: string(),
	specialPriceLabel: string(),
	fare: number(),
	delayText: string()
});
function failMessage(error) {
	if (error instanceof KorailError || error instanceof TelegramError) return error.message;
	if (error instanceof Error) return error.message;
	return "요청을 처리하지 못했습니다.";
}
var searchTrains_createServerFn_handler = createServerRpc({
	id: "194f62e30a69493071c30bf86bb1612b7a1b12d6a5a82445b493c0f341999e1f",
	name: "searchTrains",
	filename: "src/lib/functions.ts"
}, (opts) => searchTrains.__executeServer(opts));
var searchTrains = createServerFn({ method: "POST" }).validator(searchSchema).handler(searchTrains_createServerFn_handler, async ({ data }) => {
	try {
		return { trains: (await new KorailClient().searchWindow(data)).filter((train) => matchesKind(train, data.kind)) };
	} catch (error) {
		return {
			trains: [],
			error: failMessage(error)
		};
	}
});
var testKorailLogin_createServerFn_handler = createServerRpc({
	id: "db6f308da843a67b507e3f458e4e572936ac3152c0c1ee9295db9da650c99449",
	name: "testKorailLogin",
	filename: "src/lib/functions.ts"
}, (opts) => testKorailLogin.__executeServer(opts));
var testKorailLogin = createServerFn({ method: "POST" }).validator(credentialsSchema).handler(testKorailLogin_createServerFn_handler, async ({ data }) => {
	if (!data.korailId.trim() || !data.korailPw) return {
		ok: false,
		error: "코레일 아이디와 비밀번호를 입력하세요."
	};
	try {
		return {
			ok: true,
			...await new KorailClient().login(data.korailId, data.korailPw)
		};
	} catch (error) {
		return {
			ok: false,
			error: failMessage(error)
		};
	}
});
var testTelegram_createServerFn_handler = createServerRpc({
	id: "de68c38e075fd2c5f08bf51dc9dd88a616c3cbc985f7796dce36b14da91f464b",
	name: "testTelegram",
	filename: "src/lib/functions.ts"
}, (opts) => testTelegram.__executeServer(opts));
var testTelegram = createServerFn({ method: "POST" }).validator(telegramSchema).handler(testTelegram_createServerFn_handler, async ({ data }) => {
	try {
		const me = await getTelegramMe(data.token);
		if (data.chatId) await sendTelegramMessage(data.token, data.chatId, "자리톡 연결 확인\n이 채팅으로 좌석·예매 알림을 보냅니다.");
		return {
			ok: true,
			username: me.username || me.name
		};
	} catch (error) {
		return {
			ok: false,
			error: failMessage(error)
		};
	}
});
var findTelegramChat_createServerFn_handler = createServerRpc({
	id: "b7728bd98ec6434b14a19a9b118925e2b846e9c61c1790e11d0a11348467bb42",
	name: "findTelegramChat",
	filename: "src/lib/functions.ts"
}, (opts) => findTelegramChat.__executeServer(opts));
var findTelegramChat = createServerFn({ method: "POST" }).validator(object({ token: string().min(10) })).handler(findTelegramChat_createServerFn_handler, async ({ data }) => {
	try {
		return {
			ok: true,
			chatId: await discoverTelegramChatId(data.token)
		};
	} catch (error) {
		return {
			ok: false,
			error: failMessage(error)
		};
	}
});
var reserveSchema = credentialsSchema.merge(passengersSchema).extend({
	train: trainSchema,
	seatClass: _enum(["general", "special"]),
	waiting: boolean(),
	telegramToken: string(),
	telegramChatId: string()
});
async function notifyTelegram(token, chatId, text) {
	if (!token || !chatId) return;
	try {
		await sendTelegramMessage(token, chatId, text);
	} catch {}
}
var reserveTrain_createServerFn_handler = createServerRpc({
	id: "f00ef4987275c96ea8790c04a8e75886ba76bd7201e5acf9dae45a4d86541eae",
	name: "reserveTrain",
	filename: "src/lib/functions.ts"
}, (opts) => reserveTrain.__executeServer(opts));
var reserveTrain = createServerFn({ method: "POST" }).validator(reserveSchema).handler(reserveTrain_createServerFn_handler, async ({ data }) => {
	try {
		const client = new KorailClient();
		await client.login(data.korailId, data.korailPw);
		const reservation = await client.reserve({
			train: data.train,
			adults: data.adults,
			children: data.children,
			seniors: data.seniors,
			seatClass: data.seatClass,
			waiting: data.waiting
		});
		const pay = reservation.payByDate && reservation.payByTime ? `${formatYmdKorean(reservation.payByDate)} ${formatHm(reservation.payByTime)}` : "확인 필요";
		await notifyTelegram(data.telegramToken, data.telegramChatId, [
			"자리톡 예매 완료",
			trainHeadline(data.train),
			`예약번호 ${reservation.pnr}`,
			`인원 ${reservation.seatCount} · ${reservation.fare.toLocaleString("ko-KR")}원`,
			`결제 기한 ${pay}`,
			"코레일에서 10분 안에 결제하세요.",
			"https://www.korail.com"
		].join("\n"));
		return {
			ok: true,
			reservation
		};
	} catch (error) {
		return {
			ok: false,
			error: failMessage(error)
		};
	}
});
var watchSchema = searchSchema.extend({
	trainIds: array(string()).min(1),
	seatOption: _enum([
		"general-first",
		"general-only",
		"special-first",
		"special-only"
	]),
	autoReserve: boolean(),
	tryWaiting: boolean(),
	korailId: string(),
	korailPw: string(),
	telegramToken: string(),
	telegramChatId: string()
});
var pollWatch_createServerFn_handler = createServerRpc({
	id: "9200974f3e2d878910790e3754251ee458d9be7f74794b34e06c74314a9f581a",
	name: "pollWatch",
	filename: "src/lib/functions.ts"
}, (opts) => pollWatch.__executeServer(opts));
var pollWatch = createServerFn({ method: "POST" }).validator(watchSchema).handler(pollWatch_createServerFn_handler, async ({ data }) => {
	try {
		const client = new KorailClient();
		const trains = (await client.searchWindow(data)).filter((train) => matchesKind(train, data.kind));
		const wanted = new Set(data.trainIds);
		const hits = [];
		for (const train of trains) {
			if (!wanted.has(train.id)) continue;
			const seatClass = trainMatchesSeat(train, data.seatOption);
			const waitingOk = data.tryWaiting && train.waitFlag.trim() === "9";
			if (!seatClass && !waitingOk) continue;
			let reservation = null;
			if (data.autoReserve && data.korailId && data.korailPw) try {
				await client.login(data.korailId, data.korailPw);
				reservation = await client.reserve({
					train,
					adults: data.adults,
					children: data.children,
					seniors: data.seniors,
					seatClass: seatClass ?? "general",
					waiting: !seatClass && waitingOk
				});
				const pay = reservation.payByDate && reservation.payByTime ? `${formatYmdKorean(reservation.payByDate)} ${formatHm(reservation.payByTime)}` : "확인 필요";
				await notifyTelegram(data.telegramToken, data.telegramChatId, [
					"자리톡 예매 완료",
					trainHeadline(train),
					`예약번호 ${reservation.pnr}`,
					`결제 기한 ${pay}`,
					"코레일에서 바로 결제하세요.",
					"https://www.korail.com"
				].join("\n"));
			} catch (error) {
				await notifyTelegram(data.telegramToken, data.telegramChatId, `자리톡 좌석 발생 · 예매 실패\n${trainHeadline(train)}\n${failMessage(error)}`);
			}
			else await notifyTelegram(data.telegramToken, data.telegramChatId, `자리톡 좌석 발생\n${trainHeadline(train)}\n${seatClass === "special" ? "특실" : "일반실"} 예약 가능\n감시 화면에서 예매하세요.`);
			hits.push({
				train,
				seatClass: seatClass ?? "general",
				reservation
			});
			if (reservation) break;
		}
		return {
			trains,
			hits
		};
	} catch (error) {
		return {
			trains: [],
			hits: [],
			error: failMessage(error)
		};
	}
});
//#endregion
export { findTelegramChat_createServerFn_handler, pollWatch_createServerFn_handler, reserveTrain_createServerFn_handler, searchTrains_createServerFn_handler, testKorailLogin_createServerFn_handler, testTelegram_createServerFn_handler };
