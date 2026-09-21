import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

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

const preview = spawnSync("node", ["scripts/preview.mjs", "restart"], { cwd: root, stdio: "inherit" });
if (preview.status !== 0) process.exit(preview.status ?? 1);

let shell;
try {
  const response = await fetch("http://127.0.0.1:8081/");
  if (!response.ok) throw new Error(`Could not render desktop shell (${response.status}).`);
  shell = await response.text();
} finally {
  spawnSync("node", ["scripts/preview.mjs", "stop"], { cwd: root, stdio: "inherit" });
}

rmSync(desktopWebDir, { recursive: true, force: true });
mkdirSync(desktopWebDir, { recursive: true });
cpSync(staticDir, desktopWebDir, { recursive: true });
writeFileSync(join(desktopWebDir, "index.html"), shell);

if (!shell.includes(entry)) throw new Error("Desktop client entry was not written.");
console.log(`[desktop-web] bundled local client: assets/${entry}`);
