import { prisma } from "@/lib/prisma";

async function main() {
    const updates = [
        { id: 1, sortOrder: 3 },
        { id: 2, sortOrder: 1 },
        { id: 3, sortOrder: 2 },
        { id: 4, sortOrder: 4 },
        { id: 5, sortOrder: 5 },
    ];

    for (const item of updates) {
        await prisma.employeeTaskReportStatus.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
        });
    }

    console.log("Sort order berhasil diperbarui.");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });