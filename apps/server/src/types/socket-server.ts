import { ClientToDaemonEvents, DaemonToClientEvents } from "@package/socket";
import { Server, Socket } from "socket.io";

export type TypedSocket = Socket<ClientToDaemonEvents, DaemonToClientEvents>;
export type TypedServer = Server<ClientToDaemonEvents, DaemonToClientEvents>;
