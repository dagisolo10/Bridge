import { TokenService } from "@/config/auth/token/token.service";
import { SocketIoService } from "@/config/socket.io/socket.io.service";
import type { TypedServer, TypedSocket } from "@/types/socket-server";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ClientToDaemonEvent } from "@package/socket";

export const Subscribe = (event: ClientToDaemonEvent) => SubscribeMessage(event);

// todo: add allowlist for origins
@WebSocketGateway({ cors: { credentials: true, origin: "*" } })
export class SocketIoGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly tokenService: TokenService,
        private readonly socketIoService: SocketIoService,
    ) {}

    @WebSocketServer()
    private readonly server!: TypedServer;

    afterInit() {
        this.socketIoService.setServer(this.server);
    }

    async handleConnection(@ConnectedSocket() client: TypedSocket) {
        try {
            const token = client.handshake.auth["token"] as string | undefined;

            if (!token) {
                client.disconnect();
                return;
            }

            const { deviceId } = await this.tokenService.verifyToken(token);

            client.deviceId = deviceId;

            await client.join(deviceId);

            const { newToken } = await this.tokenService.refreshToken(token);

            client.emit("token:new", { newToken });

            console.log("✅  Socket connected:", client.id);
        } catch (error) {
            setImmediate(() => client.disconnect());
            console.log("❌  Socket authentication failed:", (error as Error).message);
        }
    }

    handleDisconnect() {
        console.log("❌  Socket disconnected:");
    }
}
