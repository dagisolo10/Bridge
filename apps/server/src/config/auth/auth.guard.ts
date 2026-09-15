import { PUBLIC_KEY } from "@/config/auth/public.decorator";
import { TokenService } from "@/config/auth/token/token.service";
import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly tokenService: TokenService,
    ) {}

    private readonly logger = new Logger(AuthGuard.name);

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [context.getHandler(), context.getClass()]);

        if (isPublic) {
            this.logger.debug("Public endpoint accessed. Bypassing auth check.");
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            this.logger.warn("Authorization failed: Missing 'authorization' header.");
            throw new UnauthorizedException("Authorization header missing");
        }

        if (!authHeader.startsWith("Bearer ")) {
            this.logger.warn(`Authorization failed: Invalid header structure (${authHeader.slice(0, 15)}...).`);
            throw new UnauthorizedException("Invalid authorization header format. Expected 'Bearer <token>'");
        }

        const [, incomingToken] = authHeader.split("Bearer ");

        const token = incomingToken.trim();

        if (!token) {
            this.logger.warn("Authorization failed: Malformed Bearer header token payload.");
            throw new UnauthorizedException("Token is missing");
        }

        try {
            const { deviceId } = await this.tokenService.verifyToken(token);

            request.token = token;
            request.deviceId = deviceId;

            this.logger.log(`Authentication successful for deviceId: ${deviceId}`);

            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            this.logger.error(`Token verification failed: ${errorMessage}`, error instanceof Error ? error.stack : undefined);
            throw new UnauthorizedException("Invalid or expired token");
        }
    }
}
