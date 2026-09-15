export type SeatOption =
  | "general-first"
  | "general-only"
  | "special-first"
  | "special-only";

export type TrainKindFilter = "all" | "ktx" | "itx" | "mugunghwa";

export type SeatState = "available" | "soldout" | "none" | "waiting";

export type Train = {
  id: string;
  trainNo: string;
  trainType: string;
  trainTypeName: string;
  trainGroup: string;
  trainGroupName: string;
  depName: string;
  depCode: string;
  arrName: string;
  arrCode: string;
  depDate: string;
  depTime: string;
  arrDate: string;
  arrTime: string;
  runDate: string;
  runMinutes: string;
  generalSeat: string;
  specialSeat: string;
  waitFlag: string;
  reservePossible: boolean;
  priceLabel: string;
  specialPriceLabel: string;
  fare: number;
  delayText: string;
};

export type SearchQuery = {
  dep: string;
  arr: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  adults: number;
  children: number;
  seniors: number;
  kind: TrainKindFilter;
};

export type ReservationResult = {
  pnr: string;
  trainSummary: string;
  fare: number;
  seatCount: number;
  payByDate: string;
  payByTime: string;
  message: string;
};

export type WatchHit = {
  train: Train;
  seatClass: "general" | "special";
  reservation: ReservationResult | null;
};

export type PollLog = {
  id: string;
  at: number;
  level: "info" | "ok" | "warn" | "error";
  message: string;
};
