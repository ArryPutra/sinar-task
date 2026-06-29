"use server"

import { prisma } from "@/lib/prisma";
import { ActionState } from "@/types/action-state";
import { revalidatePath } from "next/cache";
import { formEmployeeTaskSchema } from "./schemas";

export async function getAllEmployeeTasksAction() {
    try {
        const data = await prisma.employeeTasks.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                employeeTaskCategory: {
                    select: {
                        name: true
                    }
                },
                employeeTaskAssignments: true
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
            error: "Gagal mengambil daftar tugas karyawan.",
            success: false,
            data: []
        };
    }
}

export async function getEmployeeTaskByIdAction(id: string) {
    try {
        const data = await prisma.employeeTasks.findUnique({
            where: {
                id: id
            },
            include: {
                employeeTaskCategory: {
                    select: {
                        name: true
                    }
                },
                employeeTaskAssignments: {
                    select: {
                        employeeId: true,
                        employee: {
                            select: {
                                user: {
                                    select: {
                                        name: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                }
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
            error: "Gagal mengambil detail tugas karyawan.",
            success: false,
            data: null
        };
    }
}

export async function createEmployeeTaskAction(
    prevState: ActionState,
    formData: FormData
) {
    const validatedFields = formEmployeeTaskSchema.safeParse(
        Object.fromEntries(formData.entries())
    );
    if (!validatedFields.success) {
        return {
            error: validatedFields.error?.message,
            success: false,
            fields: Object.fromEntries(formData.entries()),
            fieldErrors: validatedFields.error?.flatten().fieldErrors
        };
    }

    try {
        await prisma.$transaction(async (tx) => {
            const employeeTask = await tx.employeeTasks.create({
                data: validatedFields.data,
            });

            const employeeIds = formData.getAll("employeeIds") as string[];
            if (employeeIds.length > 0) {
                await tx.employeeTaskAssignments.createMany({
                    data: employeeIds.map((id) => ({
                        employeeTaskId: employeeTask.id,
                        employeeId: id,
                    })),
                });
            }
        });

        return {
            error: null,
            success: true,
            message: `Tugas "${validatedFields.data.title}" berhasil ditambahkan.`,
        };
    } catch (error: any) {
        console.error("Transaction Error:", error);

        return {
            error: "Gagal membuat tugas. Data tidak tersimpan (Rollback).",
            success: false,
            fields: Object.fromEntries(formData.entries()),
        };
    }
}

export async function updateEmployeeTaskByIdAction(
    id: string,
    prevState: ActionState,
    formData: FormData
) {
    const validatedFields = formEmployeeTaskSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            error: validatedFields.error?.message,
            success: false,
            fields: Object.fromEntries(formData.entries()),
            fieldErrors: validatedFields.error?.flatten().fieldErrors
        };
    }

    try {
        await prisma.$transaction(async (tx) => {
            await tx.employeeTasks.update({
                where: {
                    id: id
                },
                data: {
                    title: validatedFields.data.title,
                    description: validatedFields.data.description,
                    startAt: validatedFields.data.startAt,
                    dueAt: validatedFields.data.dueAt
                }
            });

            await tx.employeeTaskAssignments.deleteMany({
                where: {
                    employeeTaskId: id
                }
            });

            const employeeIds = formData.getAll("employeeIds") as string[];
            if (employeeIds.length > 0) {
                await tx.employeeTaskAssignments.createMany({
                    data: employeeIds.map((employeeId) => ({
                        employeeTaskId: id,
                        employeeId: employeeId
                    }))
                });
            }
        });

        revalidatePath("/admin/employee-tasks");

        return {
            error: null,
            success: true,
            message: `Tugas karyawan"${validatedFields.data.title}" berhasil diperbarui.`
        };
    } catch (error: any) {
        console.error(error);

        return {
            error: "Gagal memperbarui tugas karyawan.",
            success: false,
        };
    }
}

export async function deleteEmployeeTaskByIdAction(
    id: string,
    prevState: ActionState
) {
    try {
        await prisma.$transaction(async (tx) => {
            await tx.employeeTaskAssignments.deleteMany({
                where: {
                    employeeTaskId: id
                }
            });

            await tx.employeeTasks.delete({
                where: {
                    id: id
                }
            });
        });

        revalidatePath("/admin/employee-tasks");

        return {
            error: null,
            success: true
        };
    } catch (error) {
        console.error(error);

        return {
            error: "Gagal menghapus tugas karyawan.",
            success: false
        };
    }
}