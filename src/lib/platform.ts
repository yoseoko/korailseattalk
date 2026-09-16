import { Capacitor } from "@capacitor/core";

export const APK_RELEASES_URL = "https://github.com/yoseoko/korailseattalk/releases/latest";

export const NEED_APP_MESSAGE =
  "브라우저에서는 코레일에 연결할 수 없습니다. 안드로이드 앱을 설치하면 휴대폰에서 바로 조회합니다.";

export function isNativeApp() {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}
