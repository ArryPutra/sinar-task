"use server"

import { prisma } from "@/lib/prisma";
import { getCurrentUserAction } from "../auth/actions";

export async function getCurrentAdmin() {
    const currentUserId = (await getCurrentUserAction()).user?.id;

    try {
        const data = await prisma.admin.findUnique({
            where: {
                userId: currentUserId
            }
        });

        return {
            error: null,
            success: true,
            data: data
        };
    } catch (error) {
        console.error(error);

        return {
            error: "Gagal mengambil data karyawan saat ini.",
            success: false,
            data: null
        };
    }
}