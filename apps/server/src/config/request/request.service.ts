import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";

@Injectable()
export class RequestService {
    constructor(@Inject(REQUEST) private readonly request: Request) {}

    getDeviceId() {
        return this.request.deviceId;
    }
}
