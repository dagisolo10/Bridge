declare global {
    namespace Express {
        interface Request {
            token?: string;
            deviceId: string;
        }
    }
}

export {};
