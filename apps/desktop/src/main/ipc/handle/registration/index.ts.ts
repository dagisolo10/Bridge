import { handleIpc } from "@main/ipc/handle/handler";
import { app, safeStorage } from "electron";
import fs from "fs";
import path from "path";

const TOKEN_FILE_PATH = path.join(app.getPath("userData"), "bridge_auth.enc");

export function registerIpcHandlers() {
    handleIpc("auth:set-token", ({ token }) => {
        if (!safeStorage.isEncryptionAvailable()) {
            throw new Error("Encryption is not available on this system.");
        }

        const encryptedBuffer = safeStorage.encryptString(token);

        fs.writeFileSync(TOKEN_FILE_PATH, encryptedBuffer);
    });

    handleIpc("auth:get-token", () => {
        if (!fs.existsSync(TOKEN_FILE_PATH)) return null;

        if (!safeStorage.isEncryptionAvailable()) {
            throw new Error("Encryption is not available on this system.");
        }

        try {
            return safeStorage.decryptString(fs.readFileSync(TOKEN_FILE_PATH));
        } catch {
            fs.rmSync(TOKEN_FILE_PATH, { force: true });
            return null;
        }
    });

    handleIpc("auth:clear-token", () => {
        if (fs.existsSync(TOKEN_FILE_PATH)) {
            fs.unlinkSync(TOKEN_FILE_PATH);
        }
    });
}
