import { PrismaLibSql } from "@prisma/adapter-libsql";
import { Prisma, PrismaClient, RuleKey } from "@prisma/client";

const adapter = new PrismaLibSql({ url: process.env["DATABASE_URL"]! });
export const prisma = new PrismaClient({ adapter });

const DEFAULT_RULES: Prisma.RuleCreateInput[] = [
    { isDefault: false, key: RuleKey.VOLUME_CONTROL, name: "Volume Control", description: "Allow adjusting and muting PC master audio volume." },
    { isDefault: false, key: RuleKey.AUDIO_STREAM, name: "Audio Stream", description: "Allow streaming PC system audio live to the mobile device." },
    { isDefault: false, key: RuleKey.SYSTEM_POWER, name: "System Power Controls", description: "Allow locking, sleeping, or shutting down the host PC." },
    { isDefault: true, key: RuleKey.FILE_SHARING, name: "File Sharing & Messages", description: "Allow sending and receiving messages and sharing files." },
    { isDefault: false, key: RuleKey.MEDIA_CONTROL, name: "Media Playback Controls", description: "Allow Play, Pause, Next, and Previous media controls." },
    { isDefault: false, key: RuleKey.CLIPBOARD_SYNC, name: "Clipboard Sync", description: "Automatically synchronize clipboard text between PC and peer." },
    { isDefault: false, key: RuleKey.MOUSE_TRACKPAD, name: "Virtual Trackpad", description: "Allow controlling host PC mouse cursor movement and clicks." },
    { isDefault: false, key: RuleKey.KEYBOARD_TYPEPAD, name: "Virtual Keyboard", description: "Allow typing and sending keystrokes directly to the active PC window." },
    { isDefault: false, key: RuleKey.FILE_SYSTEM_ACCESS, name: "File System Access", description: "Allow remote browsing and managing host PC directories and files." },
];

export async function seedRules() {
    try {
        console.log("🌱  Seeding system rules...");

        for (const rule of DEFAULT_RULES) {
            await prisma.rule.upsert({
                where: { key: rule.key },
                update: {
                    name: rule.name,
                    isDefault: rule.isDefault,
                    description: rule.description,
                },
                create: rule,
            });
        }

        console.log("✅  System rules seeded successfully!\n");
    } catch (error) {
        console.error("❌ Error seeding rules:", error);
        throw error;
    }
}
