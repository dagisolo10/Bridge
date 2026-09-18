import { PeerRequestController } from "@/features/peer-request/peer-request.controller";
import { PeerRequestService } from "@/features/peer-request/peer-request.service";
import { Module } from "@nestjs/common";

@Module({
    providers: [PeerRequestService],
    controllers: [PeerRequestController],
})
export class PeerRequestModule {}
