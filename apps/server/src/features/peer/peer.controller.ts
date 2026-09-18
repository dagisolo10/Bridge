import { Public } from "@/config/auth/public.decorator";
import { PeerService } from "@/features/peer/peer.service";
import { Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

@Public()
@Controller("peer")
export class PeerController {
    constructor(private readonly peerService: PeerService) {}

    @Get()
    getPeers() {
        return this.peerService.getPeers();
    }

    @Get(":peerId/rules")
    getPeerRules(@Param("peerId") peerId: string) {
        return this.peerService.getPeerRules(peerId);
    }

    @Get(":peerId")
    getPeer(@Param("peerId") peerId: string) {
        return this.peerService.getPeer(peerId);
    }

    @Post(":peerId/rules/:ruleId")
    grantRule(@Param("peerId") peerId: string, @Param("ruleId") ruleId: string) {
        return this.peerService.toggleRulePermission(peerId, ruleId, true);
    }

    @Delete(":peerId/rules/:ruleId")
    revokeRule(@Param("peerId") peerId: string, @Param("ruleId") ruleId: string) {
        return this.peerService.toggleRulePermission(peerId, ruleId, false);
    }

    @Delete(":peerId")
    removePeer(@Param("peerId") peerId: string) {
        return this.peerService.removePeer(peerId);
    }

    @Patch(":peerId/rules/:ruleId/reset")
    resetRuleToDefault(@Param("peerId") peerId: string, @Param("ruleId") ruleId: string) {
        return this.peerService.resetRuleToDefault(peerId, ruleId);
    }

    @Patch(":peerId/block")
    blockPeer(@Param("peerId") peerId: string) {
        return this.peerService.toggleBlockPeer(peerId, true);
    }

    @Patch(":peerId/unblock")
    unblockPeer(@Param("peerId") peerId: string) {
        return this.peerService.toggleBlockPeer(peerId, false);
    }
}
