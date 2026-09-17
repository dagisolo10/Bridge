import { electronAPI } from "@electron-toolkit/preload";
import { IpcHandlers } from "@shared/types/ipc-handlers";
import { contextBridge, ipcRenderer } from "electron";

const api = {
    invoke<Channel extends keyof IpcHandlers>(channel: Channel, ...args: IpcHandlers[Channel]["args"]): Promise<IpcHandlers[Channel]["return"]> {
        return ipcRenderer.invoke(channel, ...args).catch((err: Error) => {
            const match = /Error:\s(.*)$/m.exec(err.message);
            throw new Error(match ? match[1] : err.message);
        });
    },
};

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld("api", api);
        contextBridge.exposeInMainWorld("electron", electronAPI);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = api;
}
