import { Capacitor } from "@capacitor/core";

export const APK_RELEASES_URL = "https://github.com/yoseoko/korailseattalk/releases/tag/android-latest";
export const EXE_RELEASES_URL = "https://github.com/yoseoko/korailseattalk/releases/tag/win-99b2ea4";

export const NEED_APP_MESSAGE =
  "브라우저에서는 코레일에 연결할 수 없습니다. 윈도우 프로그램을 실행하면 이 컴퓨터에서 바로 조회합니다.";

export function isTauriApp() {
  try {
    if (typeof window === "undefined") return false;
    const win = window as Window & { __TAURI_INTERNALS__?: unknown; __TAURI__?: unknown };
    return Boolean(win.__TAURI_INTERNALS__ || win.__TAURI__);
  } catch {
    return false;
  }
}

export function isCapacitorNative() {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function isNativeApp() {
  return isTauriApp() || isCapacitorNative();
}

export function nativeKind(): "windows" | "android" | "web" {
  if (isTauriApp()) return "windows";
  if (isCapacitorNative()) return "android";
  return "web";
}
