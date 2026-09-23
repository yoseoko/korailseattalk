import { isCapacitorNative, isNativeApp, isTauriApp, NEED_APP_MESSAGE } from "./platform";

export type NativeHttpResponse = {
  status: number;
  headers: Record<string, string>;
  data: string;
};

function encodeBody(data: unknown): string | undefined {
  if (data == null) return undefined;
  if (typeof data === "string") return data;
  return JSON.stringify(data);
}

export async function nativeRequest(input: {
  url: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  data?: unknown;
}): Promise<NativeHttpResponse> {
  if (!isNativeApp()) {
    throw new Error(NEED_APP_MESSAGE);
  }

  const method = input.method ?? "GET";
  const headers = input.headers ?? {};
  const body = encodeBody(input.data);

  if (isTauriApp()) {
    const { invoke } = await import("@tauri-apps/api/core");
    const response = await invoke<{
      status: number;
      headers: Record<string, string>;
      body: string;
    }>("native_request", {
      url: input.url,
      method,
      headers,
      body: body ?? null,
    });
    return {
      status: response.status,
      headers: response.headers ?? {},
      data: response.body ?? "",
    };
  }

  if (isCapacitorNative()) {
    const { CapacitorHttp } = await import("@capacitor/core");
    const response = await CapacitorHttp.request({
      url: input.url,
      method,
      headers,
      data: body,
      responseType: "text",
      connectTimeout: 20_000,
      readTimeout: 25_000,
    });
    return {
      status: response.status,
      headers: (response.headers ?? {}) as Record<string, string>,
      data: typeof response.data === "string" ? response.data : JSON.stringify(response.data ?? {}),
    };
  }

  throw new Error(NEED_APP_MESSAGE);
}
