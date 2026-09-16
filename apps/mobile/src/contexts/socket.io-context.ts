import { ClientToDaemonEvent, ClientToDaemonEvents, DaemonToClientEvents } from "@package/socket";
import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

export type TypedSocket = Socket<DaemonToClientEvents, ClientToDaemonEvents>;

type SocketIoContextType = {
    connected: boolean;
    socket: TypedSocket | null;
    emit: <Event extends ClientToDaemonEvent>(event: Event, ...args: Parameters<ClientToDaemonEvents[Event]>) => void;
};

export const SocketIoContext = createContext<SocketIoContextType>({
    socket: null,
    emit: () => {},
    connected: false,
});

export function useSocketIo() {
    return useContext(SocketIoContext);
}
