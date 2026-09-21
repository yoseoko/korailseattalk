import { Capacitor } from "@capacitor/core";
import { isDesktopApp } from "./desktop";

export const APK_RELEASES_URL = "https://github.com/yoseoko/korailseattalk/releases/latest";

export const NEED_APP_MESSAGE =
  "일반 브라우저에서는 코레일에 연결할 수 없습니다. 자리톡 안드로이드·데스크톱 앱에서 바로 조회하세요.";

export function isNativeApp() {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function isDirectApp() {
  return isNativeApp() || isDesktopApp();
}

export function directAppLabel() {
  if (isNativeApp()) return "휴대폰";
  if (isDesktopApp()) return "컴퓨터";
  return "기기";
}
