import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const candidates = [
  ".vercel/output/static",
  "dist/client",
  "dist",
  ".output/public",
];

function hasShell(dir) {
  return (
    existsSync(join(dir, "index.html")) ||
    existsSync(join(dir, "_shell.html")) ||
    existsSync(join(dir, ".html"))
  );
}

const src = candidates.find((dir) => existsSync(dir) && hasShell(dir));
if (!src) {
  console.error("Native web bundle not found. Looked in:", candidates.join(", "));
  process.exit(1);
}

rmSync("www", { recursive: true, force: true });
mkdirSync("www", { recursive: true });
cpSync(src, "www", { recursive: true });

if (!existsSync("www/index.html") && existsSync("www/.html")) {
  cpSync("www/.html", "www/index.html");
}
if (!existsSync("www/index.html") && existsSync("www/_shell.html")) {
  cpSync("www/_shell.html", "www/index.html");
}

if (!existsSync("www/index.html")) {
  console.error("Copied", src, "but www/index.html is missing");
  process.exit(1);
}

writeFileSync(join("www", ".jaritok-native"), `from ${src}\n`);
console.log(`copied ${src} -> www`);
