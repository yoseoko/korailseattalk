import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("jaritokDesktop", {
  request: (request) => ipcRenderer.invoke("jaritok:http", request),
});
