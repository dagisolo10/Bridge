import { TokenService } from "@/config/auth/token/token.service";
import { PrismaService } from "@/config/prisma/prisma.service";
import { RequestService } from "@/config/request/request.service";
import { CreateDeviceDto, UpdateDeviceDto } from "@/features/device/device.dto";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class DeviceService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly tokenService: TokenService,
        private readonly requestService: RequestService,
    ) {}

    async getDevices() {
        return { devices: await this.prisma.device.findMany(), tokens: await this.prisma.token.findMany() };
    }

    async getDevice() {
        const deviceId = this.requestService.getDeviceId();

        const device = await this.prisma.device.findUnique({ where: { id: deviceId } });

        if (!device) {
            throw new NotFoundException("Device not found");
        }

        return device;
    }

    async addDevice(data: CreateDeviceDto) {
        const device = await this.prisma.device.create({ data: { name: data.name, type: data.type } });

        const token = await this.tokenService.registerDeviceToken(device.id);

        return { device, token };
    }

    async updateDevice(id: string, data: UpdateDeviceDto) {
        const device = await this.prisma.device.findUnique({ where: { id } });

        if (!device) {
            throw new NotFoundException("Device not found");
        }

        return await this.prisma.device.update({ where: { id }, data });
    }

    async deleteDevices() {
        await this.prisma.token.deleteMany();
        await this.prisma.device.deleteMany();

        return { success: true };
    }
}
