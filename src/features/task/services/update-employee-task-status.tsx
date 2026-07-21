// features/employee-task/services/updateEmployeeTaskStatus.ts

import { prisma } from "@/lib/prisma";

export async function updateEmployeeTaskStatus() {
    const now = new Date();

    // Belum Mulai -> Sedang Berlangsung
    await prisma.employeeTask.updateMany({
        where: {
            employeeTaskStatusId: 1,
            startAt: {
                lte: now,
            },
        },
        data: {
            employeeTaskStatusId: 2,
        },
    });

    // Sedang Berlangsung -> Ditutup
    await prisma.employeeTask.updateMany({
        where: {
            employeeTaskStatusId: 2,
            dueAt: {
                lt: now,
            },
        },
        data: {
            employeeTaskStatusId: 3,
        },
    });

    console.log(`[CRON] Status task diperbarui ${now.toLocaleString()}`);
}