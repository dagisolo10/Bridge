-- CreateTable
CREATE TABLE "Peer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "peerId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Peer_peerId_fkey" FOREIGN KEY ("peerId") REFERENCES "Device" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Peer_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Device" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PeerRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "peerId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "isAllowed" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PeerRule_peerId_fkey" FOREIGN KEY ("peerId") REFERENCES "Peer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PeerRule_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PeerRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentId" TEXT NOT NULL,
    "peerId" TEXT NOT NULL,
    "resolvedAt" DATETIME,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PeerRequest_peerId_fkey" FOREIGN KEY ("peerId") REFERENCES "Device" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PeerRequest_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Device" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Peer_parentId_idx" ON "Peer"("parentId");

-- CreateIndex
CREATE INDEX "Peer_peerId_idx" ON "Peer"("peerId");

-- CreateIndex
CREATE UNIQUE INDEX "Peer_peerId_parentId_key" ON "Peer"("peerId", "parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Rule_key_key" ON "Rule"("key");

-- CreateIndex
CREATE UNIQUE INDEX "PeerRule_peerId_ruleId_key" ON "PeerRule"("peerId", "ruleId");

-- CreateIndex
CREATE UNIQUE INDEX "PeerRequest_parentId_peerId_key" ON "PeerRequest"("parentId", "peerId");
