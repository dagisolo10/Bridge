import { TokenService } from "@/config/auth/token/token.service";
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { tap } from "rxjs";

@Injectable()
export class TokenInterceptor implements NestInterceptor {
    constructor(private readonly tokenService: TokenService) {}

    private logger = new Logger();

    intercept(context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
            tap(() => {
                const request = context.switchToHttp().getRequest<Request>();

                if (request.token) {
                    this.logger.debug("🔄️ Token Refreshed");
                    void this.tokenService.refreshToken(request.token);
                }
            }),
        );
    }
}
