import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const staticDir = join(root, ".vercel", "output", "static");
const webDir = join(root, "www");

const build = spawnSync("npm", ["run", "build"], { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
if (build.status !== 0) process.exit(build.status ?? 1);
if (!existsSync(staticDir)) throw new Error(`Android web assets were not created: ${staticDir}`);

const entry = readdirSync(join(staticDir, "assets")).find((name) => /^index-[\w-]+\.js$/.test(name));
if (!entry) throw new Error("Could not find the Android client entry bundle.");

const preview = spawnSync("node", ["scripts/preview.mjs", "restart"], { cwd: root, stdio: "inherit" });
if (preview.status !== 0) process.exit(preview.status ?? 1);

let shell;
try {
  const response = await fetch("http://127.0.0.1:8081/");
  if (!response.ok) throw new Error(`Could not render Android shell (${response.status}).`);
  shell = await response.text();
} finally {
  spawnSync("node", ["scripts/preview.mjs", "stop"], { cwd: root, stdio: "inherit" });
}

// The local document must never reload the deployed web app. Capacitor owns
// navigation from this point, while the bundled JS calls Korail through its
// native HTTP bridge on the phone.
shell = shell.replace(/<script src="https:\/\/grok\.com\/grok-app-builder\/extensions\.js" defer><\/script>/, "");

rmSync(webDir, { recursive: true, force: true });
mkdirSync(webDir, { recursive: true });
cpSync(staticDir, webDir, { recursive: true });

writeFileSync(join(webDir, "index.html"), shell);

const copiedAssets = shell.includes(entry);
if (!copiedAssets) throw new Error("Android client entry was not written.");
console.log(`[android-web] bundled local client: assets/${entry}`);
