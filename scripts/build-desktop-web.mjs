import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawn, spawnSync } from "node:child_process";

const root = process.cwd();
const staticDir = join(root, ".vercel", "output", "static");
const desktopWebDir = join(root, "desktop-web");

const build = spawnSync("npm", ["run", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (build.status !== 0) process.exit(build.status ?? 1);
if (!existsSync(staticDir)) throw new Error(`Desktop web assets were not created: ${staticDir}`);

const entry = readdirSync(join(staticDir, "assets")).find((name) => /^index-[\w-]+\.js$/.test(name));
if (!entry) throw new Error("Could not find the desktop client entry bundle.");

const previewUrl = "http://127.0.0.1:8081/";
const preview = spawn("npm", ["run", "preview"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
let previewFailure = null;
preview.on("error", (error) => {
  previewFailure = `could not start preview: ${error.message}`;
});
preview.on("exit", (code, signal) => {
  previewFailure = `preview exited early (${signal ?? `code ${code}`})`;
});

let shell;
try {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline && previewFailure === null) {
    try {
      const response = await fetch(previewUrl, { signal: AbortSignal.timeout(2_000) });
      if (!response.ok) throw new Error(`Could not render desktop shell (${response.status}).`);
      shell = await response.text();
      break;
    } catch (error) {
      if (String(error.message || error).startsWith("Could not render desktop shell")) throw error;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  if (!shell) {
    throw new Error(previewFailure ?? `Nothing answered on ${previewUrl} within 60 seconds.`);
  }
} finally {
  if (!preview.killed) preview.kill();
}

rmSync(desktopWebDir, { recursive: true, force: true });
mkdirSync(desktopWebDir, { recursive: true });
cpSync(staticDir, desktopWebDir, { recursive: true });
writeFileSync(join(desktopWebDir, "index.html"), shell);

if (!shell.includes(entry)) throw new Error("Desktop client entry was not written.");
console.log(`[desktop-web] bundled local client: assets/${entry}`);
