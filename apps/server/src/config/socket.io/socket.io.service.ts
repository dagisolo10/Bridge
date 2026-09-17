import { TypedServer } from "@/types/socket-server";
import { Injectable } from "@nestjs/common";
import { DaemonToClientEvent, DaemonToClientEvents } from "@package/socket";

@Injectable()
export class SocketIoService {
    private server!: TypedServer;

    setServer(server: TypedServer) {
        this.server = server;
    }

    getServer() {
        return this.server;
    }

    emit<Event extends DaemonToClientEvent>(event: Event, to?: string, ...args: Parameters<DaemonToClientEvents[Event]>) {
        if (to) this.server.to(to).emit(event, ...args);
        else this.server.emit(event, ...args);
    }
}
