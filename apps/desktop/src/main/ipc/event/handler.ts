import { BrowserWindow } from "electron";

type IpcEvent<Args = []> = Args;

type IpcEvents = {
    "event:one": IpcEvent<[{ id: number; name: string }]>;
};

export function sendIpc<Channel extends keyof IpcEvents>(window: BrowserWindow, channel: Channel, ...args: IpcEvents[Channel]) {
    window.webContents.send(channel, ...args);
}
