import { AuthGuard } from "@/config/auth/auth.guard";
import { TokenInterceptor } from "@/config/auth/token/token.interceptor";
import { TokenModule } from "@/config/auth/token/token.module";
import { PrismaModule } from "@/config/prisma/prisma.module";
import { DeviceModule } from "@/features/device/device.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";

@Module({
    providers: [
        { useClass: AuthGuard, provide: APP_GUARD },
        { useClass: TokenInterceptor, provide: APP_INTERCEPTOR },
    ],
    controllers: [],
    imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, TokenModule, DeviceModule],
})
export class AppModule {}
