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

        return await this.prisma.$transaction(async (tx) => {
            const { count } = await tx.peerRequest.updateMany({
                where: {
                    parentId,
                    resolvedAt: null,
                    id: peerRequestId,
                },
                data: {
                    accepted,
                    resolvedAt: new Date(),
                },
            });

            if (count === 0) {
                const existing = await tx.peerRequest.findUnique({ where: { id: peerRequestId } });

                if (!existing || existing.parentId !== parentId) {
                    throw new NotFoundException("Peer request not found");
                }

                throw new BadRequestException("Request already resolved");
            }

            const request = await tx.peerRequest.findUnique({ where: { id: peerRequestId } });

            if (!request) {
                throw new NotFoundException("Peer request not found");
            }

            if (accepted) {
                await tx.peer.upsert({
                    update: { isBlocked: false },
                    create: { parentId, peerId: request.peerId },
                    where: { peerId_parentId: { peerId: request.peerId, parentId } },
                });
            }

            // todo: socket notification

            return request;
        });
    }
}
