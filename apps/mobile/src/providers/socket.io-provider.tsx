import { useAuth } from "@/contexts/auth-context";
import { SocketIoContext, TypedSocket } from "@/contexts/socket.io-context";
import { SERVER_URL } from "@/lib/api/axios";
import { ClientToDaemonEvent, ClientToDaemonEvents, DaemonToClientData } from "@package/socket";
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function SocketIoProvider({ children }: PropsWithChildren) {
    const { token, authenticated, updateToken } = useAuth();

    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState<TypedSocket | null>(null);

    const updateTokenRef = useRef(updateToken);
    useEffect(() => {
        updateTokenRef.current = updateToken;
    }, [updateToken]);

    const tokenRef = useRef(token);
    useEffect(() => {
        tokenRef.current = token;
    }, [token]);

    useEffect(() => {
        if (!authenticated) return;

        console.log("🔌  Initializing Socket connection");

        const instance: TypedSocket = io(SERVER_URL, {
            autoConnect: true,
            reconnection: true,
            transports: ["websocket"],
            auth: { token: tokenRef.current },
        });

        instance.on("connect", () => {
            setConnected(true);
            setSocket(instance);
            console.log("✅  Connected to PC NestJS Gateway!");
        });

        instance.on("connect_error", (err) => {
            setConnected(false);
            console.error("❌  Socket Connection Error:", err.message);
        });

        instance.on("disconnect", (reason) => {
            setSocket(null);
            setConnected(false);
            console.log("❌  Disconnected from PC:", reason);
        });

        instance.on("token:new", async ({ newToken }: DaemonToClientData<"token:new">) => {
            console.log("🔄  Received updated token from server");
            instance.auth = { token: newToken };
            await updateTokenRef.current(newToken);
        });

        return () => {
            console.log("🧹  Cleaning up socket instance...");
            instance.removeAllListeners();
            instance.disconnect();
            setSocket(null);
            setConnected(false);
        };
    }, [authenticated]);

    const emit = useCallback(
        <Event extends ClientToDaemonEvent>(event: Event, ...args: Parameters<ClientToDaemonEvents[Event]>) => {
            if (!socket || !socket.connected) return;
            socket.emit(event, ...args);
        },
        [socket],
    );

    return <SocketIoContext.Provider value={{ connected: Boolean(token && connected), socket: token ? socket : null, emit }}>{children}</SocketIoContext.Provider>;
}
