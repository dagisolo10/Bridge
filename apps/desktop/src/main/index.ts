import { electronApp, optimizer } from "@electron-toolkit/utils";
import { registerIpcHandlers } from "@main/ipc/handle/registration/index.ts";
import { createWindow } from "@main/window/main";
import { app, BrowserWindow, dialog } from "electron";

let mainWindow: BrowserWindow | null = null;

export function getMainWindow() {
    return mainWindow;
}

process.on("unhandledRejection", (reason) => dialog.showErrorBox("Unhandled Rejection", String(reason)));
process.on("uncaughtException", (error) => dialog.showErrorBox("Main Process Error", error.stack || error.message));

void app.whenReady().then(() => {
    electronApp.setAppUserModelId("com.bridge.app");

    app.on("browser-window-created", (_, window) => optimizer.watchWindowShortcuts(window));

    registerIpcHandlers();
    createAndCloseWindow();

    app.on("activate", () => BrowserWindow.getAllWindows().length === 0 && createAndCloseWindow());
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

function createAndCloseWindow() {
    mainWindow = createWindow();

    if (mainWindow) {
        mainWindow.on("closed", () => {
            mainWindow = null;
        });
    }
}
