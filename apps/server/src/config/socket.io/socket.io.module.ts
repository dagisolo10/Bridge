import { SocketIoGateway } from "@/config/socket.io/socket.io.gateway";
import { SocketIoService } from "@/config/socket.io/socket.io.service";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
    exports: [SocketIoService],
    providers: [SocketIoGateway, SocketIoService],
})
export class SocketIoModule {}
