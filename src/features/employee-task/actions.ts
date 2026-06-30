"use server"

import { prisma } from "@/lib/prisma";
import { ActionState } from "@/types/action-state";
import { revalidatePath } from "next/cache";
import { formEmployeeTaskSchema } from "./schemas";

export async function getAllEmployeeTaskAction() {
    try {
        const data = await prisma.employeeTask.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                employeeTaskCategory: {
                    select: {
                        name: true
                    }
                },
                employeeTaskAssignment: true
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
        const data = await prisma.employeeTask.findUnique({
            where: {
                id: id
            },
            include: {
                employeeTaskCategory: {
                    select: {
                        name: true
                    }
                },
                employeeTaskAssignment: {
                    select: {
                        employeeId: true,
                        employee: {
                            select: {
                                nomorTelepon: true,
                                user: {
                                    select: {
                                        name: true,
                                        email: true
                                    }
                                }
                            }
                        },
                        employeeTaskAssignmentStatus: {
                            select: {
                                name: true,
                                colorHex: true
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
            const employeeTask = await tx.employeeTask.create({
                data: validatedFields.data,
            });

            const employeeIds = formData.getAll("employeeIds") as string[];
            if (employeeIds.length > 0) {
                await tx.employeeTaskAssignment.createMany({
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
            await tx.employeeTask.update({
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

            await tx.employeeTaskAssignment.deleteMany({
                where: {
                    employeeTaskId: id
                }
            });

            const employeeIds = formData.getAll("employeeIds") as string[];
            if (employeeIds.length > 0) {
                await tx.employeeTaskAssignment.createMany({
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
            await tx.employeeTaskAssignment.deleteMany({
                where: {
                    employeeTaskId: id
                }
            });

            await tx.employeeTask.delete({
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