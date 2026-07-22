// features/employee-task/services/updateEmployeeTaskStatus.ts

import { prisma } from "@/lib/prisma";

export async function updateEmployeeTaskStatus() {
    const now = new Date();

    // Belum Mulai -> Sedang Berlangsung
    await prisma.employeeTask.updateMany({
        where: {
            employeeTaskStatusId: 1, // belum mulai
            startAt: {
                lte: now,
            },
            dueAt: {
                gte: now,
            }
        },
        data: {
            employeeTaskStatusId: 2, // sedang berlangsung
        },
    });

    // Sedang Berlangsung -> Ditutup
    await prisma.employeeTask.updateMany({
        where: {
            employeeTaskStatusId: 2, // sedang berlangsung
            dueAt: {
                lt: now,
            },
        },
        data: {
            employeeTaskStatusId: 3, // ditutup
        },
    });

    console.log(`[CRON] Status task diperbarui ${now.toLocaleString()}`);
}