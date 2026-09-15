export class TelegramError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TelegramError";
  }
}

type TelegramResult = {
  ok: boolean;
  description?: string;
  result?: {
    id?: number;
    first_name?: string;
    username?: string;
    message?: { chat?: { id?: number; title?: string; first_name?: string; type?: string } };
    message_id?: number;
    chat?: { id?: number };
  };
};

async function telegramCall(token: string, method: string, body?: Record<string, unknown>) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = (await response.json()) as TelegramResult;
  if (!json.ok) {
    throw new TelegramError(json.description || "텔레그램 요청이 실패했습니다.");
  }
  return json;
}

export async function getTelegramMe(token: string) {
  const json = await telegramCall(token, "getMe");
  return {
    username: json.result?.username || "",
    name: json.result?.first_name || "",
  };
}

export async function sendTelegramMessage(token: string, chatId: string, text: string) {
  await telegramCall(token, "sendMessage", {
    chat_id: chatId,
    text,
    disable_web_page_preview: true,
  });
}

export async function discoverTelegramChatId(token: string): Promise<string> {
  const json = await telegramCall(token, "getUpdates", { limit: 20, timeout: 0 });
  const updates = (json.result as unknown as Array<{ message?: { chat?: { id?: number } } }>) || [];
  for (let i = updates.length - 1; i >= 0; i--) {
    const id = updates[i]?.message?.chat?.id;
    if (id != null) return String(id);
  }
  throw new TelegramError("최근 대화가 없습니다. 봇에게 아무 메시지나 보낸 뒤 다시 시도하세요.");
}
