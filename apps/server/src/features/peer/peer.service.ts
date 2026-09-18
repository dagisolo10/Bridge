import { PrismaService } from "@/config/prisma/prisma.service";
import { RequestService } from "@/config/request/request.service";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class PeerService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly request: RequestService,
    ) {}

    async getPeers() {
        const parentId = this.request.getDeviceId();

        return await this.prisma.peer.findMany({ where: { parentId } });
    }

    async getPeer(peerId: string) {
        const parentId = this.request.getDeviceId();

        const peer = await this.prisma.peer.findUnique({ where: { peerId_parentId: { parentId, peerId } } });

        if (!peer) throw new NotFoundException("Peer not found");

        return peer;
    }

    async removePeer(peerId: string) {
        const parentId = this.request.getDeviceId();

        const { count } = await this.prisma.peer.deleteMany({ where: { peerId, parentId } });

        if (count === 0) throw new NotFoundException("Peer not found");

        // todo: add socket emission to notify the peer about the connection
    }

    async toggleBlockPeer(peerId: string, isBlocked: boolean) {
        const peer = await this.getPeer(peerId);

        return await this.prisma.peer.update({ data: { isBlocked }, where: { peerId_parentId: { peerId, parentId: peer.parentId } } });
    }

    async getPeerRules(peerId: string) {
        const parentId = this.request.getDeviceId();

        const peer = await this.prisma.peer.findUnique({ where: { peerId_parentId: { parentId, peerId } }, include: { peerRules: true } });

        if (!peer) throw new NotFoundException("Peer not found");

        const allRules = await this.prisma.rule.findMany({ orderBy: { name: "asc" }, omit: { createdAt: true } });

        const peerRuleMap = new Map<string, boolean>(peer.peerRules.map((pr) => [pr.ruleId, pr.isAllowed]));

        return allRules.map((rule) => ({
            ...rule,
            isAllowed: peerRuleMap.get(rule.id) ?? rule.isDefault,
        }));
    }

    async toggleRulePermission(peerId: string, ruleId: string, isAllowed: boolean) {
        const peer = await this.getPeer(peerId);

        const rule = await this.prisma.rule.findUnique({ where: { id: ruleId } });

        if (!rule) throw new NotFoundException("Rule not found");

        const peerRule = await this.prisma.peerRule.upsert({
            where: { peerId_ruleId: { peerId: peer.id, ruleId } },
            create: { peerId: peer.id, ruleId, isAllowed },
            update: { isAllowed },
        });

        // TODO: emit socket event to peer ("peer:rules-updated")

        return peerRule;
    }

    async resetRuleToDefault(peerId: string, ruleId: string) {
        const peer = await this.getPeer(peerId);

        await this.prisma.peerRule.deleteMany({ where: { peerId: peer.id, ruleId } });
    }
}
