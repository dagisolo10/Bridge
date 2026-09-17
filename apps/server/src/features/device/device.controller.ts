import { Public } from "@/config/auth/public.decorator";
import { CreateDeviceDto, UpdateDeviceDto } from "@/features/device/device.dto";
import { DeviceService } from "@/features/device/device.service";
import { Body, Controller, Delete, Get, Patch, Post } from "@nestjs/common";

@Controller("device")
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) {}

    @Get()
    getDevice() {
        return this.deviceService.getDevice();
    }

    @Public()
    @Get("all")
    getDevices() {
        return this.deviceService.getDevices();
    }

    @Public()
    @Post()
    addDevice(@Body() data: CreateDeviceDto) {
        return this.deviceService.addDevice(data);
    }

    @Patch()
    updateDevice(id: string, @Body() data: UpdateDeviceDto) {
        return this.deviceService.updateDevice(id, data);
    }

    @Public()
    @Delete()
    deleteDevices() {
        return this.deviceService.deleteDevices();
    }
}
