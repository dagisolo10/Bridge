import { TokenService } from "@/config/auth/token/token.service";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
    exports: [TokenService],
    providers: [TokenService],
})
export class TokenModule {}
