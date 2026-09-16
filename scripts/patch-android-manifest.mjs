import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const manifestPath = join("android", "app", "src", "main", "AndroidManifest.xml");
let xml = readFileSync(manifestPath, "utf8");

const permissions = [
  "android.permission.INTERNET",
  "android.permission.ACCESS_NETWORK_STATE",
  "android.permission.WAKE_LOCK",
  "android.permission.POST_NOTIFICATIONS",
];

for (const name of permissions) {
  if (xml.includes(name)) continue;
  xml = xml.replace(
    "<application",
    `    <uses-permission android:name="${name}" />\n    <application`,
  );
}

if (!xml.includes("android:usesCleartextTraffic")) {
  xml = xml.replace("<application", '<application android:usesCleartextTraffic="false"');
}

writeFileSync(manifestPath, xml);
console.log("patched", manifestPath);
