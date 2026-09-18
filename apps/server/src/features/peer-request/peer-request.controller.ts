import { PeerRequestService } from "@/features/peer-request/peer-request.service";
import { Controller, Param, Post } from "@nestjs/common";

@Controller("peer-request")
export class PeerRequestController {
    constructor(private readonly peerRequestService: PeerRequestService) {}

    @Post("send/:parentId")
    sendPeerRequest(@Param("parentId") parentId: string) {
        return this.peerRequestService.sendPeerRequest(parentId);
    }

    @Post("accept/:peerRequestId")
    acceptPeerRequest(@Param("peerRequestId") peerRequestId: string) {
        return this.peerRequestService.acceptRejectRequest(peerRequestId, true);
    }

    @Post("reject/:peerRequestId")
    rejectPeerRequest(@Param("peerRequestId") peerRequestId: string) {
        return this.peerRequestService.acceptRejectRequest(peerRequestId, false);
    }
}
