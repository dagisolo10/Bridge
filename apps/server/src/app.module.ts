import { AuthGuard } from "@/config/auth/auth.guard";
import { TokenInterceptor } from "@/config/auth/token/token.interceptor";
import { TokenModule } from "@/config/auth/token/token.module";
import { PrismaModule } from "@/config/prisma/prisma.module";
import { RequestModule } from "@/config/request/request.module";
import { SocketIoModule } from "@/config/socket.io/socket.io.module";
import { DeviceModule } from "@/features/device/device.module";
import { PeerRequestModule } from "@/features/peer-request/peer-request.module";
import { PeerModule } from "@/features/peer/peer.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";

@Module({
    providers: [
        { useClass: AuthGuard, provide: APP_GUARD },
        { useClass: TokenInterceptor, provide: APP_INTERCEPTOR },
    ],
    imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, TokenModule, DeviceModule, RequestModule, SocketIoModule, PeerModule, PeerRequestModule],
})
export class AppModule {}
