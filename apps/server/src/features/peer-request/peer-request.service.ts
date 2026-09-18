import { PrismaService } from "@/config/prisma/prisma.service";
import { RequestService } from "@/config/request/request.service";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class PeerRequestService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly request: RequestService,
    ) {}

    async sendPeerRequest(parentId: string) {
        const peerId = this.request.getDeviceId();

        if (parentId === peerId) {
            throw new BadRequestException("A device cannot peer with itself");
        }

        const parentDevice = await this.prisma.device.findUnique({ where: { id: parentId } });

        if (!parentDevice) {
            throw new NotFoundException("Parent device not found");
        }

        const peerRequest = await this.prisma.peerRequest.upsert({
            create: { peerId, parentId },
            update: { accepted: false, resolvedAt: null },
            where: { parentId_peerId: { peerId, parentId } },
        });

        // todo: socket notification

        return peerRequest;
    }

    async acceptRejectRequest(peerRequestId: string, accepted: boolean) {
        const parentId = this.request.getDeviceId();

        const peerRequest = await this.prisma.peerRequest.findFirst({ where: { parentId, id: peerRequestId } });

        if (!peerRequest) {
            throw new NotFoundException("Peer request not found");
        }

        if (peerRequest.resolvedAt) {
            throw new BadRequestException("Request already resolved");
        }

        const updatedRequest = await this.prisma.$transaction(async (tx) => {
            const request = await tx.peerRequest.update({
                where: { parentId, id: peerRequestId },
                data: { accepted, resolvedAt: new Date() },
            });

            if (accepted) {
                await tx.peer.upsert({
                    update: { isBlocked: false },
                    create: { parentId, peerId: request.peerId },
                    where: { peerId_parentId: { peerId: request.peerId, parentId } },
                });
            }

            return request;
        });

        // todo: socket notification

        return updatedRequest;
    }
}
