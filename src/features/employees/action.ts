import { prisma } from "@/lib/prisma";

export async function getAllEmployeesAction() {
    try {
        const data = await prisma.employees.findMany({
            orderBy: {
                user: {
                    name: "asc"
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return {
            error: null,
            success: true,
            data: data
        }
    } catch (error) {
        console.error(error);

        return {
            error: "Gagal mengambil daftar karyawan.",
            success: false,
            data: []
        };
    }
}