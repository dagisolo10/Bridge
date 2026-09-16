import { ipcMain } from "electron";
import { IpcHandlers } from "@shared/types/ipc-handlers";

type IpcHandleListener<Channel extends keyof IpcHandlers> = (...args: IpcHandlers[Channel]["args"]) => IpcHandlers[Channel]["return"] | Promise<IpcHandlers[Channel]["return"]>;

export function handleIpc<Channel extends keyof IpcHandlers>(channel: Channel, listener: IpcHandleListener<Channel>) {
    ipcMain.handle(channel, async (_event, ...args: IpcHandlers[Channel]["args"]) => listener(...args));
}
