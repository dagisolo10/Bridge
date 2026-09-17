import { DeviceType } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateDeviceDto {
    @IsEnum(DeviceType)
    type!: DeviceType;

    @IsString()
    name!: string;
}

export class UpdateDeviceDto {
    @IsOptional()
    @IsString()
    name?: string;
}
