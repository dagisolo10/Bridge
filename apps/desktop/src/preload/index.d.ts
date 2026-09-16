import { IpcHandlers } from "../shared/types/ipc-handlers";

import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
    interface Window {
        electron: ElectronAPI;
        api: {
            invoke<Channel extends keyof IpcHandlers>(channel: Channel, ...args: IpcHandlers[Channel]["args"]): Promise<IpcHandlers[Channel]["return"]> | IpcHandlers[Channel]["return"];
        };
    }
}
