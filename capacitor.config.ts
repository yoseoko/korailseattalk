import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.jaritok.app",
  appName: "자리톡",
  webDir: "www",
  backgroundColor: "#09090b",
  server: {
    url: "https://korailseattalk.grok.me",
    androidScheme: "https",
    allowNavigation: [
      "korailseattalk.grok.me",
      "korailseattalk.vercel.app",
      "smart.letskorail.com",
      "www.letskorail.com",
      "www.korail.com",
      "api.telegram.org",
    ],
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    CapacitorCookies: {
      enabled: true,
    },
    StatusBar: {
      backgroundColor: "#09090b",
      style: "DARK",
    },
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#09090b",
    webContentsDebuggingEnabled: false,
  },
};

export default config;
