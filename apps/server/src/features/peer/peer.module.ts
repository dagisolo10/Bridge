import { PeerController } from "@/features/peer/peer.controller";
import { PeerService } from "@/features/peer/peer.service";
import { Module } from "@nestjs/common";

@Module({
    providers: [PeerService],
    controllers: [PeerController],
})
export class PeerModule {}
