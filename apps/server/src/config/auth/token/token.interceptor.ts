import { TokenService } from "@/config/auth/token/token.service";
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Request, Response } from "express";
import { mergeMap } from "rxjs";

@Injectable()
export class TokenInterceptor implements NestInterceptor {
    constructor(private readonly tokenService: TokenService) {}

    private logger = new Logger(TokenInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
            mergeMap(async (data: unknown) => {
                const request = context.switchToHttp().getRequest<Request>();
                const response = context.switchToHttp().getResponse<Response>();

                if (request.token) {
                    try {
                        this.logger.debug("🔄 Token Refreshed");
                        const { newToken } = await this.tokenService.refreshToken(request.token);

                        response.setHeader("x-new-token", newToken);
                        response.setHeader("Access-Control-Expose-Headers", "x-new-token");
                    } catch (error) {
                        this.logger.error("❌ Failed to refresh token", error);
                    }
                }

                return data;
            }),
        );
    }
}
