import { app, BrowserWindow, ipcMain, protocol, shell } from "electron";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { basename, extname, isAbsolute, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

const devUrl = "http://127.0.0.1:8080";
const appUrl = "jaritok://app/";
const allowedHosts = new Set(["smart.letskorail.com", "api.telegram.org"]);
let devServer;

protocol.registerSchemesAsPrivileged([
  { scheme: "jaritok", privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

function mimeType(file) {
  return (
    {
      ".css": "text/css",
      ".html": "text/html",
      ".js": "text/javascript",
      ".json": "application/json",
      ".svg": "image/svg+xml",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".woff2": "font/woff2",
    }[extname(file).toLowerCase()] || "application/octet-stream"
  );
}

function registerPackagedAppProtocol() {
  const webRoot = join(process.resourcesPath, "desktop-web");
  protocol.handle("jaritok", async (request) => {
    const url = new URL(request.url);
    const requestedPath = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\/+/, "");
    const filePath = normalize(join(webRoot, requestedPath));
    const relativePath = relative(webRoot, filePath);
    if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
      return new Response("Not found", { status: 404 });
    }
    try {
      return new Response(await readFile(filePath), {
        headers: { "content-type": mimeType(basename(filePath)) },
      });
    } catch {
      return new Response("Not found", { status: 404 });
    }
  });
}

function isAllowedUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && allowedHosts.has(url.hostname);
  } catch {
    return false;
  }
}

async function waitForApp() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`${devUrl}/`);
      if (response.ok) return;
    } catch {
      // The Vite server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("자리톡 화면을 시작하지 못했습니다.");
}

async function directRequest(_event, request) {
  if (!request || !isAllowedUrl(request.url)) throw new Error("허용되지 않은 직접 요청입니다.");
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    Math.max(1000, Number(request.connectTimeout || 0) + Number(request.readTimeout || 0) || 25000),
  );
  try {
    const response = await fetch(request.url, {
      method: request.method === "POST" ? "POST" : "GET",
      headers: request.headers,
      body: request.method === "POST" ? request.body : undefined,
      signal: controller.signal,
    });
    const cookies = typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : [];
    const headers = Object.fromEntries(response.headers.entries());
    if (cookies.length) headers["set-cookie"] = cookies.join(", ");
    return { status: response.status, headers, data: await response.text() };
  } finally {
    clearTimeout(timeout);
  }
}

async function createWindow() {
  if (!app.isPackaged) await waitForApp();
  const window = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 390,
    minHeight: 680,
    backgroundColor: "#09090b",
    title: "자리톡",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: fileURLToPath(new URL("./preload.mjs", import.meta.url)),
    },
  });
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://www.korail.com")) void shell.openExternal(url);
    return { action: "deny" };
  });
  await window.loadURL(app.isPackaged ? appUrl : devUrl);
}

ipcMain.handle("jaritok:http", directRequest);

app.whenReady().then(async () => {
  if (app.isPackaged) {
    registerPackagedAppProtocol();
  } else {
    devServer = spawn("npm", ["run", "dev"], { stdio: "inherit", shell: process.platform === "win32" });
  }
  await createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) void createWindow();
  });
});

app.on("window-all-closed", () => app.quit());
app.on("before-quit", () => devServer?.kill());
