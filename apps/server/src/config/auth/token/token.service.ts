import { PrismaService } from "@/config/prisma/prisma.service";
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as jwt from "jsonwebtoken";
import { ulid } from "ulidx";

@Injectable()
export class TokenService {
    private jwtSecretKey: string;

    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
    ) {
        this.jwtSecretKey = this.config.getOrThrow<string>("JWT_SECRET_KEY");
    }

    generateToken(deviceId: string) {
        return jwt.sign({ deviceId, nonce: ulid() }, this.jwtSecretKey);
    }

    async verifyToken(token: string) {
        const { deviceId } = await this.checkToken(token);

        return { deviceId };
    }

    async refreshToken(token: string) {
        const { deviceId, deviceToken } = await this.checkToken(token);

        const newToken = this.generateToken(deviceId);

        await this.prisma.token.update({ where: { id: deviceToken.id }, data: { currentToken: newToken, previousToken: deviceToken.currentToken } });
    }

    async registerDeviceToken(deviceId: string) {
        const token = this.generateToken(deviceId);

        await this.prisma.token.create({ data: { deviceId, currentToken: token } });

        return token;
    }

    private async checkToken(token: string) {
        const { deviceId } = jwt.verify(token, this.jwtSecretKey) as { deviceId: string };

        const deviceToken = await this.prisma.token.findFirst({ where: { deviceId } });

        if (!deviceToken) {
            throw new NotFoundException("Token not found");
        }

        if (token !== deviceToken.currentToken) {
            throw new ForbiddenException("Invalid or revoked token");
        }

        return { deviceId, deviceToken };
    }
}
