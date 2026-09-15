import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent$1, t as Dialog$1, u as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as formatHm, c as inputToHhmmss, d as seatLabel, f as seatState, h as ymdToInput, i as formatFare, l as inputToYmd, m as trainHeadline, n as formatClock, o as formatYmdKorean, p as toYmd, r as formatDuration, s as hhmmssToInput, t as HOURS, u as kstNow } from "./format-Ct9r7IUy.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
import { a as Radio, c as ArrowLeftRight, i as Settings2, o as LoaderCircle, r as TrainFront, s as Bell, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CFWbpAtA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-11 w-full rounded-[var(--radius-sm)] bg-surface px-3 text-sm text-foreground shadow-[var(--shadow-border)] outline-none transition-[box-shadow] duration-[var(--motion-quick)] placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium tracking-wide text-muted", className),
		...props
	});
}
var STATIONS = [
	"서울",
	"용산",
	"영등포",
	"광명",
	"수원",
	"평택지제",
	"천안아산",
	"오송",
	"대전",
	"김천구미",
	"구미",
	"서대구",
	"동대구",
	"경주",
	"울산",
	"부산",
	"행신",
	"청량리",
	"상봉",
	"양평",
	"만종",
	"서원주",
	"강릉",
	"정동진",
	"동해",
	"포항",
	"서대전",
	"계룡",
	"논산",
	"익산",
	"김제",
	"정읍",
	"광주송정",
	"나주",
	"목포",
	"전주",
	"남원",
	"곡성",
	"구례구",
	"순천",
	"여천",
	"여수엑스포",
	"밀양",
	"구포",
	"창원중앙",
	"창원",
	"마산",
	"진주",
	"공주",
	"안동",
	"영주",
	"제천",
	"충주",
	"단양",
	"영천",
	"경산",
	"왜관",
	"영동",
	"옥천",
	"조치원",
	"신탄진",
	"천안",
	"평택",
	"서빙고",
	"왕십리",
	"부강",
	"논산",
	"강경"
];
var POPULAR_ROUTES = [
	{
		dep: "서울",
		arr: "부산",
		label: "서울 → 부산"
	},
	{
		dep: "서울",
		arr: "동대구",
		label: "서울 → 동대구"
	},
	{
		dep: "서울",
		arr: "대전",
		label: "서울 → 대전"
	},
	{
		dep: "용산",
		arr: "광주송정",
		label: "용산 → 광주송정"
	},
	{
		dep: "서울",
		arr: "강릉",
		label: "서울 → 강릉"
	},
	{
		dep: "동대구",
		arr: "서울",
		label: "동대구 → 서울"
	},
	{
		dep: "부산",
		arr: "서울",
		label: "부산 → 서울"
	},
	{
		dep: "광명",
		arr: "부산",
		label: "광명 → 부산"
	}
];
function filterStations(query) {
	const q = query.trim();
	if (!q) return [...STATIONS];
	return STATIONS.filter((name) => name.includes(q));
}
function StationField({ label, value, onChange }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const options = (0, import_react.useMemo)(() => filterStations(value).slice(0, 8), [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-w-0 flex-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value,
				autoComplete: "off",
				onFocus: () => setOpen(true),
				onBlur: () => window.setTimeout(() => setOpen(false), 120),
				onChange: (event) => onChange(event.target.value),
				className: "mt-1.5 font-display text-lg font-medium"
			}),
			open && options.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-[var(--radius-md)] bg-elevated py-1 shadow-[var(--shadow-border)]",
				children: options.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cn("flex h-10 w-full items-center px-3 text-left text-sm hover:bg-surface", name === value && "text-accent"),
					onMouseDown: (event) => event.preventDefault(),
					onClick: () => {
						onChange(name);
						setOpen(false);
					},
					children: name
				}) }, name))
			}) : null
		]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide", {
	variants: { tone: {
		muted: "bg-surface-2 text-muted",
		available: "bg-success-soft text-success",
		soldout: "bg-danger-soft text-danger",
		live: "bg-accent text-accent-foreground",
		warn: "bg-warn-soft text-warn"
	} },
	defaultVariants: { tone: "muted" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({
			tone,
			className
		})),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-medium transition-[opacity,transform,background-color,color,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-smooth-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-foreground hover:opacity-90",
			secondary: "bg-surface text-foreground shadow-[var(--shadow-border)] hover:bg-surface-2",
			outline: "bg-transparent text-foreground shadow-[var(--shadow-border)] hover:bg-surface",
			ghost: "text-muted hover:bg-surface hover:text-foreground",
			danger: "bg-danger text-white hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
var Dialog = Dialog$1;
function DialogContent({ className, children, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-black/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[min(100%-2rem,440px)] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl)] bg-elevated p-5 text-foreground shadow-[var(--shadow-border)] outline-none", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "font-display text-lg font-medium tracking-tight",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
				className: "grid size-10 place-items-center rounded-[var(--radius-sm)] text-muted hover:bg-surface hover:text-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			})]
		}), children]
	})] });
}
function Separator({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-px w-full bg-border", className) });
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-surface-2 shadow-[var(--shadow-border)] transition-colors duration-[var(--motion-quick)] data-[state=checked]:bg-accent", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-foreground shadow-sm transition-transform duration-[var(--motion-quick)] data-[state=checked]:translate-x-[22px] data-[state=checked]:bg-accent-foreground" })
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
var searchTrains = createServerFn({ method: "POST" }).validator(searchSchema).handler(createSsrRpc("194f62e30a69493071c30bf86bb1612b7a1b12d6a5a82445b493c0f341999e1f"));
var testKorailLogin = createServerFn({ method: "POST" }).validator(credentialsSchema).handler(createSsrRpc("db6f308da843a67b507e3f458e4e572936ac3152c0c1ee9295db9da650c99449"));
var testTelegram = createServerFn({ method: "POST" }).validator(telegramSchema).handler(createSsrRpc("de68c38e075fd2c5f08bf51dc9dd88a616c3cbc985f7796dce36b14da91f464b"));
var findTelegramChat = createServerFn({ method: "POST" }).validator(object({ token: string().min(10) })).handler(createSsrRpc("b7728bd98ec6434b14a19a9b118925e2b846e9c61c1790e11d0a11348467bb42"));
var reserveSchema = credentialsSchema.merge(passengersSchema).extend({
	train: trainSchema,
	seatClass: _enum(["general", "special"]),
	waiting: boolean(),
	telegramToken: string(),
	telegramChatId: string()
});
var reserveTrain = createServerFn({ method: "POST" }).validator(reserveSchema).handler(createSsrRpc("f00ef4987275c96ea8790c04a8e75886ba76bd7201e5acf9dae45a4d86541eae"));
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
var pollWatch = createServerFn({ method: "POST" }).validator(watchSchema).handler(createSsrRpc("9200974f3e2d878910790e3754251ee458d9be7f74794b34e06c74314a9f581a"));
var defaults = {
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
	lastTimeEnd: "12:00"
};
function clampPollSec(value, fallback) {
	if (!Number.isFinite(value)) return fallback;
	return Math.min(120, Math.max(5, value));
}
function clampPollRange(minSec, maxSec) {
	let min = clampPollSec(minSec, defaults.pollMinSec);
	let max = clampPollSec(maxSec, defaults.pollMaxSec);
	if (min > max) [min, max] = [max, min];
	return {
		pollMinSec: min,
		pollMaxSec: max
	};
}
function randomPollDelayMs(minSec, maxSec) {
	const { pollMinSec, pollMaxSec } = clampPollRange(minSec, maxSec);
	const sec = pollMinSec + Math.random() * (pollMaxSec - pollMinSec);
	return Math.max(5e3, Math.round(sec * 1e3));
}
function formatPollSec(sec) {
	const rounded = Math.round(sec * 10) / 10;
	return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
function formatPollRange(minSec, maxSec) {
	const { pollMinSec, pollMaxSec } = clampPollRange(minSec, maxSec);
	const a = formatPollSec(pollMinSec);
	const b = formatPollSec(pollMaxSec);
	return a === b ? `${a}초` : `${a}–${b}초`;
}
var useSettings = create()(persist((set) => ({
	...defaults,
	patch: (partial) => set((state) => {
		const next = {
			...state,
			...partial
		};
		const range = clampPollRange(next.pollMinSec, next.pollMaxSec);
		return {
			...next,
			...range
		};
	})
}), {
	name: "jaritok-settings",
	version: 1,
	migrate: (persisted, version) => {
		const state = { ...persisted };
		if (version < 1) {
			const old = Number(state.pollSec);
			if (state.pollMinSec == null && Number.isFinite(old) && old > 0) {
				const min = clampPollSec(old, 8);
				state.pollMinSec = min;
				state.pollMaxSec = clampPollSec(old + 4, min);
			}
			delete state.pollSec;
		}
		const range = clampPollRange(Number(state.pollMinSec) || defaults.pollMinSec, Number(state.pollMaxSec) || defaults.pollMaxSec);
		return {
			...defaults,
			...state,
			...range
		};
	},
	partialize: (state) => {
		const { patch: _patch, ...rest } = state;
		return rest;
	}
}));
function chime() {
	try {
		const ctx = new AudioContext();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "sine";
		osc.frequency.setValueAtTime(784, ctx.currentTime);
		osc.frequency.setValueAtTime(1046, ctx.currentTime + .14);
		gain.gain.setValueAtTime(1e-4, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.08, ctx.currentTime + .03);
		gain.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + .55);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start();
		osc.stop(ctx.currentTime + .6);
	} catch {}
}
function newLog(level, message) {
	return {
		id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
		at: Date.now(),
		level,
		message
	};
}
function useWatcher() {
	const [watching, setWatching] = (0, import_react.useState)(false);
	const [selectedIds, setSelectedIds] = (0, import_react.useState)([]);
	const [trains, setTrains] = (0, import_react.useState)([]);
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [pollCount, setPollCount] = (0, import_react.useState)(0);
	const [lastCheck, setLastCheck] = (0, import_react.useState)(null);
	const [nextWaitSec, setNextWaitSec] = (0, import_react.useState)(null);
	const [hit, setHit] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const stopRef = (0, import_react.useRef)(false);
	const lockRef = (0, import_react.useRef)(null);
	const timerRef = (0, import_react.useRef)(null);
	const pushLog = (0, import_react.useCallback)((level, message) => {
		setLogs((prev) => [newLog(level, message), ...prev].slice(0, 80));
	}, []);
	const toggleTrain = (0, import_react.useCallback)((id) => {
		setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	}, []);
	const selectMany = (0, import_react.useCallback)((ids) => {
		setSelectedIds(ids);
	}, []);
	const clearTimer = (0, import_react.useCallback)(() => {
		if (timerRef.current != null) {
			window.clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			stopRef.current = true;
			clearTimer();
			lockRef.current?.release();
		};
	}, [clearTimer]);
	const stop = (0, import_react.useCallback)(() => {
		stopRef.current = true;
		setWatching(false);
		setNextWaitSec(null);
		clearTimer();
		lockRef.current?.release();
		lockRef.current = null;
		pushLog("info", "감시를 멈췄습니다.");
	}, [clearTimer, pushLog]);
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
		start: (0, import_react.useCallback)(async (settings, watchTrains) => {
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
				lockRef.current = await navigator.wakeLock?.request("screen") ?? null;
			} catch {
				pushLog("warn", "화면 꺼짐 방지를 사용할 수 없습니다. 탭을 켜 두세요.");
			}
			const scheduleNext = () => {
				const ms = randomPollDelayMs(settings.pollMinSec, settings.pollMaxSec);
				const sec = ms / 1e3;
				setNextWaitSec(sec);
				timerRef.current = window.setTimeout(() => void tick(), ms);
				return sec;
			};
			const tick = async () => {
				if (stopRef.current) return;
				let result;
				try {
					result = await pollWatch({ data: {
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
						telegramChatId: settings.telegramChatId
					} });
				} catch (error) {
					if (stopRef.current) return;
					const wait = scheduleNext();
					pushLog("error", `${error instanceof Error ? error.message : "조회에 실패했습니다."} · ${formatPollSec(wait)}초 후`);
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
				if (result.error) pushLog("error", result.error);
				else {
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
						if (Notification.permission === "granted") new Notification("자리톡", { body: `${found.train.trainTypeName} ${found.train.trainNo} 좌석 발생` });
					} catch {}
					if (found.reservation) {
						pushLog("ok", `예매 완료 · 예약번호 ${found.reservation.pnr}`);
						stopRef.current = true;
						setWatching(false);
						setNextWaitSec(null);
						clearTimer();
						return;
					}
					pushLog("ok", `${found.train.trainTypeName} ${found.train.trainNo} 좌석 발생`);
					if (settings.autoReserve) pushLog("warn", "자동 예매가 켜져 있지만 예약이 끝나지 않았습니다.");
				}
				const wait = scheduleNext();
				if (!result.error && result.hits.length === 0) pushLog("info", `${formatClock(Date.now())} 아직 빈자리 없음 · ${formatPollSec(wait)}초 후`);
				else if (result.error) pushLog("info", `${formatPollSec(wait)}초 후 다시 조회`);
			};
			tick();
		}, [
			clearTimer,
			pushLog,
			selectedIds
		]),
		stop,
		reserveNow: (0, import_react.useCallback)(async (train, settings, seatClass) => {
			setBusy(true);
			try {
				const result = await reserveTrain({ data: {
					korailId: settings.korailId,
					korailPw: settings.korailPw,
					train,
					adults: settings.adults,
					children: settings.children,
					seniors: settings.seniors,
					seatClass,
					waiting: false,
					telegramToken: settings.telegramToken,
					telegramChatId: settings.telegramChatId
				} });
				if (!result.ok || !result.reservation) {
					pushLog("error", result.error || "예매에 실패했습니다.");
					return null;
				}
				pushLog("ok", `예매 완료 · 예약번호 ${result.reservation.pnr}`);
				setHit({
					train,
					seatClass,
					reservation: result.reservation
				});
				stop();
				return result.reservation;
			} finally {
				setBusy(false);
			}
		}, [pushLog, stop])
	};
}
function tomorrowYmd() {
	const d = kstNow();
	d.setDate(d.getDate() + 1);
	return toYmd(d);
}
function Stepper({ label, value, onChange, min = 0, max = 9 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-surface px-3 py-2 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-9 place-items-center rounded-[var(--radius-sm)] bg-surface-2 text-foreground",
					onClick: () => onChange(Math.max(min, value - 1)),
					children: "−"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-4 text-center font-mono text-sm tabular-nums",
					children: value
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-9 place-items-center rounded-[var(--radius-sm)] bg-surface-2 text-foreground",
					onClick: () => onChange(Math.min(max, value + 1)),
					children: "+"
				})
			]
		})]
	});
}
function SeatChip({ label, state }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex min-w-16 flex-col rounded-[var(--radius-sm)] px-2 py-1", state === "available" && "bg-success-soft", state === "soldout" && "bg-danger-soft", state === "none" && "bg-surface-2"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("text-xs font-medium", state === "available" && "text-success", state === "soldout" && "text-danger", state === "none" && "text-muted"),
			children: seatLabel(state)
		})]
	});
}
function TrainRow({ train, selected, watching, onToggle, onReserve, canReserve }) {
	const general = seatState(train.generalSeat);
	const special = seatState(train.specialSeat);
	const open = general === "available" || special === "available";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("rounded-[var(--radius-lg)] bg-elevated p-3 shadow-[var(--shadow-border)] transition-[box-shadow] duration-[var(--motion-quick)]", selected && "shadow-[var(--shadow-border-hover)]"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onToggle,
					className: cn("mt-1 grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] shadow-[var(--shadow-border)]", selected ? "bg-accent text-accent-foreground" : "bg-surface text-muted"),
					"aria-pressed": selected,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainFront, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-display text-sm font-medium",
									children: [
										train.trainTypeName,
										" ",
										train.trainNo
									]
								}),
								open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "available",
									children: "빈자리"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "soldout",
									children: "매진"
								}),
								watching && selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "live",
									children: "감시중"
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-mono text-lg tabular-nums tracking-tight",
							children: [
								formatHm(train.depTime),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mx-2 text-subtle",
									children: "→"
								}),
								formatHm(train.arrTime)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-xs text-muted",
							children: [
								train.depName,
								" → ",
								train.arrName,
								" · ",
								formatDuration(train.runMinutes),
								train.fare ? ` · ${formatFare(train.fare)}` : ""
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 flex-col gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeatChip, {
						label: "일반",
						state: general
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeatChip, {
						label: "특실",
						state: special
					})]
				})
			]
		}), open && canReserve ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex gap-2",
			children: [general === "available" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "secondary",
				className: "flex-1",
				onClick: () => onReserve("general"),
				children: "일반실 예매"
			}) : null, special === "available" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "secondary",
				className: "flex-1",
				onClick: () => onReserve("special"),
				children: "특실 예매"
			}) : null]
		}) : null]
	});
}
function SettingsForm({ settings, patch }) {
	const [busy, setBusy] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-sm font-medium",
					children: "코레일 계정"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted",
					children: "회원번호·휴대폰·이메일 중 하나로 로그인합니다. 정보는 이 기기에만 저장됩니다."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "korail-id",
							children: "아이디"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "korail-id",
							className: "mt-1.5",
							value: settings.korailId,
							autoComplete: "username",
							onChange: (e) => patch({ korailId: e.target.value })
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "korail-pw",
							children: "비밀번호"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "korail-pw",
							className: "mt-1.5",
							type: "password",
							value: settings.korailPw,
							autoComplete: "current-password",
							onChange: (e) => patch({ korailPw: e.target.value })
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							disabled: busy !== null,
							onClick: async () => {
								setBusy("korail");
								const result = await testKorailLogin({ data: {
									korailId: settings.korailId,
									korailPw: settings.korailPw
								} });
								setBusy(null);
								if (result.ok) toast.success(`${result.name || "회원"} 로그인 확인`);
								else toast.error(result.error);
							},
							children: [busy === "korail" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, "로그인 확인"]
						})
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-sm font-medium",
					children: "텔레그램 알림"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-2 list-decimal space-y-1 pl-4 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "텔레그램에서 BotFather에게 /newbot 으로 봇을 만듭니다." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "받은 토큰을 아래에 붙여 넣습니다." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "봇에게 아무 말이나 보낸 뒤 채팅 ID를 찾습니다." })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "tg-token",
							children: "봇 토큰"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "tg-token",
							className: "mt-1.5",
							type: "password",
							value: settings.telegramToken,
							onChange: (e) => patch({ telegramToken: e.target.value })
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "tg-chat",
							children: "채팅 ID"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "tg-chat",
								value: settings.telegramChatId,
								onChange: (e) => patch({ telegramChatId: e.target.value })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								className: "shrink-0",
								disabled: busy !== null,
								onClick: async () => {
									setBusy("chat");
									const result = await findTelegramChat({ data: { token: settings.telegramToken } });
									setBusy(null);
									if (result.ok && result.chatId) {
										patch({ telegramChatId: result.chatId });
										toast.success("채팅 ID를 넣었습니다.");
									} else toast.error(result.error);
								},
								children: "찾기"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							disabled: busy !== null,
							onClick: async () => {
								setBusy("tg");
								const result = await testTelegram({ data: {
									token: settings.telegramToken,
									chatId: settings.telegramChatId
								} });
								setBusy(null);
								if (result.ok) toast.success(`@${result.username} 연결됨`);
								else toast.error(result.error);
							},
							children: [busy === "tg" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }), "테스트 메시지"]
						})
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-sm font-medium",
						children: "감시 동작"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "poll-min",
							children: "최소 간격 (초)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "poll-min",
							className: "mt-1.5",
							type: "number",
							min: 5,
							max: 120,
							step: .1,
							value: settings.pollMinSec,
							onChange: (e) => patch({ pollMinSec: Number(e.target.value) })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "poll-max",
							children: "최대 간격 (초)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "poll-max",
							className: "mt-1.5",
							type: "number",
							min: 5,
							max: 120,
							step: .1,
							value: settings.pollMaxSec,
							onChange: (e) => patch({ pollMaxSec: Number(e.target.value) })
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							"조회마다 ",
							formatPollRange(settings.pollMinSec, settings.pollMaxSec),
							" 사이에서 임의의 초를 고릅니다. 간격이 일정하지 않습니다."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "좌석 우선" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "mt-1.5 flex h-11 w-full rounded-[var(--radius-sm)] bg-surface px-3 text-sm shadow-[var(--shadow-border)]",
						value: settings.seatOption,
						onChange: (e) => patch({ seatOption: e.target.value }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "general-first",
								children: "일반실 우선"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "general-only",
								children: "일반실만"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "special-first",
								children: "특실 우선"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "special-only",
								children: "특실만"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-surface px-3 py-3 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: "빈자리 생기면 자동 예매"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: settings.autoReserve,
							onCheckedChange: (v) => patch({ autoReserve: v })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-surface px-3 py-3 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: "예약대기까지 시도"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: settings.tryWaiting,
							onCheckedChange: (v) => patch({ tryWaiting: v })
						})]
					}),
					settings.autoReserve ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-warn",
						children: "좌석이 열리는 즉시 코레일에 예약이 들어갑니다. 결제는 직접 해야 하며 보통 10분 안에 만료됩니다."
					}) : null
				]
			})
		]
	});
}
function SeatBoard() {
	const settings = useSettings();
	const watcher = useWatcher();
	const [searching, setSearching] = (0, import_react.useState)(false);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [now, setNow] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!settings.lastDate) settings.patch({ lastDate: tomorrowYmd() });
	}, [settings]);
	(0, import_react.useEffect)(() => {
		setNow(Date.now());
		const id = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(id);
	}, []);
	const dateInput = settings.lastDate ? ymdToInput(settings.lastDate) : ymdToInput(tomorrowYmd());
	const selectedTrains = (0, import_react.useMemo)(() => watcher.trains.filter((t) => watcher.selectedIds.includes(t.id)), [watcher.trains, watcher.selectedIds]);
	const pollLabel = watcher.watching && watcher.nextWaitSec != null ? `${formatPollSec(watcher.nextWaitSec)}s` : formatPollRange(settings.pollMinSec, settings.pollMaxSec).replace("초", "s");
	async function onSearch() {
		setSearching(true);
		try {
			const result = await searchTrains({ data: {
				dep: settings.lastDep.trim(),
				arr: settings.lastArr.trim(),
				date: settings.lastDate || tomorrowYmd(),
				timeStart: inputToHhmmss(settings.lastTimeStart),
				timeEnd: inputToHhmmss(settings.lastTimeEnd),
				kind: settings.kind,
				adults: settings.adults,
				children: settings.children,
				seniors: settings.seniors
			} });
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-28 pt-4 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] tracking-[0.18em] text-subtle",
					children: "KORAIL SEAT WATCH"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-medium tracking-tight",
					children: "자리톡"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden items-center gap-2 rounded-full bg-surface px-3 py-2 font-mono text-xs tabular-nums text-muted shadow-[var(--shadow-border)] sm:flex",
						children: watcher.watching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot size-2 rounded-full bg-success" }),
							"감시 ",
							watcher.pollCount
						] }) : now === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "opacity-0",
							children: "00:00:00"
						}) : formatClock(now)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "icon",
						onClick: () => setSettingsOpen(true),
						"aria-label": "설정",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-[var(--radius-xl)] bg-elevated p-4 shadow-[var(--shadow-border)] sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: POPULAR_ROUTES.map((route) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: cn("h-9 rounded-full px-3 text-xs shadow-[var(--shadow-border)]", settings.lastDep === route.dep && settings.lastArr === route.arr ? "bg-accent text-accent-foreground" : "bg-surface text-muted hover:text-foreground"),
								onClick: () => settings.patch({
									lastDep: route.dep,
									lastArr: route.arr
								}),
								children: route.label
							}, route.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-end gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StationField, {
									label: "출발",
									value: settings.lastDep,
									onChange: (lastDep) => settings.patch({ lastDep })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mb-0.5 grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-surface text-muted shadow-[var(--shadow-border)] hover:text-foreground",
									onClick: () => settings.patch({
										lastDep: settings.lastArr,
										lastArr: settings.lastDep
									}),
									"aria-label": "출발 도착 바꾸기",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StationField, {
									label: "도착",
									value: settings.lastArr,
									onChange: (lastArr) => settings.patch({ lastArr })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 sm:col-span-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "date",
										children: "날짜"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "date",
										className: "mt-1.5",
										type: "date",
										min: ymdToInput(toYmd(kstNow())),
										value: dateInput,
										onChange: (e) => settings.patch({ lastDate: inputToYmd(e.target.value) })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "t0",
									children: "시작"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									id: "t0",
									className: "mt-1.5 flex h-11 w-full rounded-[var(--radius-sm)] bg-surface px-3 text-sm shadow-[var(--shadow-border)]",
									value: hhmmssToInput(inputToHhmmss(settings.lastTimeStart)),
									onChange: (e) => settings.patch({ lastTimeStart: e.target.value }),
									children: HOURS.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: h }, h))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "t1",
									children: "끝"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									id: "t1",
									className: "mt-1.5 flex h-11 w-full rounded-[var(--radius-sm)] bg-surface px-3 text-sm shadow-[var(--shadow-border)]",
									value: hhmmssToInput(inputToHhmmss(settings.lastTimeEnd)),
									onChange: (e) => settings.patch({ lastTimeEnd: e.target.value }),
									children: HOURS.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: h }, h))
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-3 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
									label: "어른",
									value: settings.adults,
									min: 1,
									onChange: (adults) => settings.patch({ adults })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
									label: "어린이",
									value: settings.children,
									onChange: (children) => settings.patch({ children })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
									label: "경로",
									value: settings.seniors,
									onChange: (seniors) => settings.patch({ seniors })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [
								["ktx", "KTX"],
								["itx", "ITX·새마을"],
								["mugunghwa", "무궁화"],
								["all", "전체"]
							].map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: cn("h-9 rounded-full px-3 text-xs shadow-[var(--shadow-border)]", settings.kind === value ? "bg-accent text-accent-foreground" : "bg-surface text-muted"),
								onClick: () => settings.patch({ kind: value }),
								children: label
							}, value))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "mt-4 w-full",
							disabled: searching || watcher.watching,
							onClick: () => void onSearch(),
							children: [searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-4" }), "열차 조회"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "rounded-[var(--radius-xl)] bg-elevated p-4 shadow-[var(--shadow-border)] sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-sm font-medium",
								children: "감시"
							}), watcher.watching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "live",
								children: "LIVE"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [watcher.selectedIds.length, "대 선택"] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted",
							children: [
								"이 화면을 켜 둔 동안에만 조회합니다. 조회 간격은 ",
								formatPollRange(settings.pollMinSec, settings.pollMaxSec),
								" ",
								"사이에서 매번 달라집니다."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-3 gap-2 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[var(--radius-md)] bg-surface px-2 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-lg tabular-nums",
										children: watcher.pollCount
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-subtle",
										children: "조회"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[var(--radius-md)] bg-surface px-2 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-lg tabular-nums",
										children: selectedTrains.length
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-subtle",
										children: "대상"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[var(--radius-md)] bg-surface px-2 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-lg tabular-nums",
										children: pollLabel
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-subtle",
										children: watcher.watching && watcher.nextWaitSec != null ? "다음" : "간격"
									})]
								})
							]
						}),
						watcher.lastCheck ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 font-mono text-xs text-subtle",
							children: ["마지막 조회 ", formatClock(watcher.lastCheck)]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex gap-2",
							children: watcher.watching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								className: "flex-1",
								onClick: watcher.stop,
								children: "감시 중지"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "flex-1",
								disabled: watcher.selectedIds.length === 0,
								onClick: () => void watcher.start(settings, watcher.trains),
								children: "감시 시작"
							})
						}),
						settings.autoReserve && !settings.korailId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-warn",
							children: "자동 예매를 쓰려면 설정에서 코레일 로그인을 넣으세요."
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-medium text-muted",
							children: "기록"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-2 max-h-56 space-y-1.5 overflow-auto",
							children: watcher.logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-xs text-subtle",
								children: "조회하면 여기에 남습니다."
							}) : watcher.logs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: cn("font-mono text-[11px] leading-5", log.level === "ok" && "text-success", log.level === "error" && "text-danger", log.level === "warn" && "text-warn", log.level === "info" && "text-muted"),
								children: log.message
							}, log.id))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-sm font-medium",
						children: "시간표"
					}), watcher.trains.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-xs text-muted hover:text-foreground",
						onClick: () => watcher.selectMany(watcher.selectedIds.length === watcher.trains.length ? [] : watcher.trains.map((t) => t.id)),
						children: watcher.selectedIds.length === watcher.trains.length ? "선택 해제" : "모두 감시"
					}) : null]
				}), watcher.trains.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[var(--radius-xl)] bg-elevated px-5 py-16 text-center shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: "아직 조회한 열차가 없습니다"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "구간과 시간을 고른 뒤 열차를 불러오세요."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2",
					children: watcher.trains.map((train) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainRow, {
						train,
						selected: watcher.selectedIds.includes(train.id),
						watching: watcher.watching,
						canReserve: Boolean(settings.korailId && settings.korailPw) && !watcher.busy,
						onToggle: () => watcher.toggleTrain(train.id),
						onReserve: (seatClass) => void watcher.reserveNow(train, settings, seatClass)
					}, train.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-10 pb-6 text-center text-[11px] leading-5 text-subtle",
				children: "자리톡은 코레일 공식 서비스가 아닙니다. 예약 후 결제 기한 안에 코레일에서 직접 결제해야 합니다. 자동 반복 조회는 이용 약관에 따라 제한될 수 있습니다."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: settingsOpen,
				onOpenChange: setSettingsOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "설정",
					className: "max-h-[min(88dvh,720px)] overflow-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsForm, {
						settings,
						patch: settings.patch
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(watcher.hit),
				onOpenChange: (open) => !open && watcher.setHit(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: watcher.hit?.reservation ? "예매 완료" : "빈자리",
					children: watcher.hit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-base",
							children: trainHeadline(watcher.hit.train)
						}), watcher.hit.reservation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-sm",
								children: ["예약번호 ", watcher.hit.reservation.pnr]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									"결제 기한",
									" ",
									watcher.hit.reservation.payByDate ? `${formatYmdKorean(watcher.hit.reservation.payByDate)} ${formatHm(watcher.hit.reservation.payByTime)}` : "코레일에서 확인"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "https://www.korail.com",
									target: "_blank",
									rel: "noreferrer",
									children: "코레일에서 결제"
								})
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [watcher.hit.seatClass === "special" ? "특실" : "일반실", " 예약이 가능합니다."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: watcher.busy || !settings.korailId,
							onClick: () => void watcher.reserveNow(watcher.hit.train, settings, watcher.hit.seatClass),
							children: "지금 예매"
						})] })]
					}) : null
				})
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeatBoard, {});
}
//#endregion
export { Home as component };
