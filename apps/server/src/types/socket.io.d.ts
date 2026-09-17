import "socket.io";

declare module "socket.io" {
    interface Socket {
        deviceId?: string;
    }
}

export {};
