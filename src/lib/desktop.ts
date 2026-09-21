export type DesktopHttpRequest = {
  url: string;
  method: "GET" | "POST";
  headers?: Record<string, string>;
  body?: string | Record<string, unknown>;
  responseType?: "text" | "json";
  connectTimeout?: number;
  readTimeout?: number;
};

export type DesktopHttpResponse = {
  status: number;
  headers: Record<string, string>;
  data: string;
};

declare global {
  interface Window {
    jaritokDesktop?: {
      request: (request: DesktopHttpRequest) => Promise<DesktopHttpResponse>;
    };
  }
}

export function isDesktopApp() {
  return typeof window !== "undefined" && typeof window.jaritokDesktop?.request === "function";
}

export async function desktopRequest(request: DesktopHttpRequest): Promise<DesktopHttpResponse> {
  const bridge = typeof window !== "undefined" ? window.jaritokDesktop : undefined;
  if (!bridge) throw new Error("데스크톱 연결을 찾을 수 없습니다.");
  return bridge.request(request);
}
