import { Module } from "@nestjs/common";
import { DeviceService } from "@/features/device/device.service";
import { DeviceController } from "@/features/device/device.controller";

@Module({
    controllers: [DeviceController],
    providers: [DeviceService],
})
export class DeviceModule {}
