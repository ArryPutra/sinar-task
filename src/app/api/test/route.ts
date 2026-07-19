import { prisma } from "@/lib/prisma";

export async function GET() {
    const start = performance.now();
    // Lakukan koneksi dan query sederhana
    await prisma.$queryRaw`SELECT 1`;
    const end = performance.now();
    return Response.json({ duration: `${(end - start).toFixed(2)}ms` });
}