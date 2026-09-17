import { RequestService } from "@/config/request/request.service";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
    exports: [RequestService],
    providers: [RequestService],
})
export class RequestModule {}
