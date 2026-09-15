//#region node_modules/.nitro/vite/services/ssr/assets/format-Ct9r7IUy.js
var KST = "Asia/Seoul";
function kstNow() {
	return new Date((/* @__PURE__ */ new Date()).toLocaleString("en-US", { timeZone: KST }));
}
function toYmd(date) {
	return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}
function ymdToInput(ymd) {
	if (ymd.length !== 8) return ymd;
	return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
}
function inputToYmd(value) {
	return value.replaceAll("-", "");
}
function hhmmssToInput(value) {
	const v = value.padStart(6, "0");
	return `${v.slice(0, 2)}:${v.slice(2, 4)}`;
}
function inputToHhmmss(value) {
	return `${value.replaceAll(":", "").padEnd(4, "0")}00`.slice(0, 6);
}
function formatHm(hhmmss) {
	const v = hhmmss.padStart(6, "0");
	return `${v.slice(0, 2)}:${v.slice(2, 4)}`;
}
function formatYmdKorean(ymd) {
	if (ymd.length !== 8) return ymd;
	return `${Number(ymd.slice(4, 6))}월 ${Number(ymd.slice(6, 8))}일`;
}
function formatDuration(runMinutes) {
	const raw = runMinutes.replace(/\D/g, "").padStart(4, "0");
	const h = Number(raw.slice(0, 2));
	const m = Number(raw.slice(2, 4));
	if (h <= 0) return `${m}분`;
	return `${h}시간 ${m}분`;
}
function formatFare(n) {
	return `${n.toLocaleString("ko-KR")}원`;
}
function formatClock(ts) {
	return new Date(ts).toLocaleTimeString("ko-KR", {
		timeZone: KST,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false
	});
}
function seatState(code) {
	const c = code.trim();
	if (c === "11") return "available";
	if (c === "13") return "soldout";
	if (c === "00" || c === "") return "none";
	return "soldout";
}
function seatLabel(state) {
	if (state === "available") return "예약가능";
	if (state === "soldout") return "매진";
	if (state === "waiting") return "대기";
	return "없음";
}
function trainHeadline(train) {
	return `${train.trainTypeName} ${train.trainNo}  ${train.depName} ${formatHm(train.depTime)} → ${train.arrName} ${formatHm(train.arrTime)}`;
}
var HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
//#endregion
export { formatHm as a, inputToHhmmss as c, seatLabel as d, seatState as f, ymdToInput as h, formatFare as i, inputToYmd as l, trainHeadline as m, formatClock as n, formatYmdKorean as o, toYmd as p, formatDuration as r, hhmmssToInput as s, HOURS as t, kstNow as u };
