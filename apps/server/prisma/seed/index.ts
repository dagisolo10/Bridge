import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaLibSql({ url: process.env["DATABASE_URL"]! });
export const prisma = new PrismaClient({ adapter });

export async function main() {
    try {
        console.log("Seeding...");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
    } finally {
        await prisma.$disconnect();
    }
}
