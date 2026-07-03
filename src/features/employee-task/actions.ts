"use server"

import { Prisma } from "@/generated/prisma/client";
import { deleteFileFromCloudinary, uploadStreamToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { ActionState } from "@/types/action-state";
import { revalidatePath } from "next/cache";
import { employeeTasksByEmployeeId } from "./queris";
import { formEmployeeTaskSchema } from "./schemas";
import { determineEmployeeTaskStatusId } from "./utils/determine-employee-task-status-id";

export async function getAllEmployeeTaskAction({
    page = 1,
    search = "",
    employeeTaskStatusId,
}: {
    page: number
    search?: string
    employeeTaskStatusId?: number
}) {
    try {
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const where: Prisma.EmployeeTaskWhereInput = {
            ...(employeeTaskStatusId && {
                employeeTaskStatusId: employeeTaskStatusId
            }),
            ...(search && {
                OR: [
                    {
                        title: {
                            contains: search,
                            mode: "insensitive",
                        },
                    }
                ],
            }),
        };


        const [data, totalCount] = await Promise.all([
            prisma.employeeTask.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    employeeTaskStatus: {
                        select: {
                            name: true,
                            colorHex: true,
                        },
                    },
                    employeeTaskCategory: {
                        select: {
                            name: true,
                        },
                    },
                    employeeTaskAssignment: true,
                },
            }),
            prisma.employeeTask.count({
                where,
            }),
        ]);

        return {
            success: true,
            error: null,
            data,
            totalCount,
        };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            error: "Gagal mengambil daftar tugas karyawan.",
            data: [],
            totalCount: 0,
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
                employeeTaskStatus: {
                    select: {
                        name: true,
                        colorHex: true
                    }
                },
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
                                phoneNumber: true,
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
            fieldErrors: validatedFields.error?.flatten().fieldErrors,
        };
    }

    try {
        const files = formData.getAll("fileUrls") as File[];
        const uploadedUrls: string[] = [];

        for (const file of files) {
            if (file.size === 0) continue;
            const uploadResult = await uploadStreamToCloudinary(file, 'employee_tasks');
            if (uploadResult.secure_url) {
                uploadedUrls.push(uploadResult.secure_url);
            }
        }

        await prisma.$transaction(async (tx) => {
            const employeeTask = await tx.employeeTask.create({
                data: {
                    ...validatedFields.data,
                    fileUrls: uploadedUrls,
                    employeeTaskStatusId: determineEmployeeTaskStatusId(
                        validatedFields.data.startAt,
                        validatedFields.data.dueAt
                    )
                },
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
            error: "Gagal membuat tugas.",
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
        const files = formData.getAll("fileUrls") as File[];
        const uploadedUrls: string[] = [];

        if (files.length > 0) {
            for (const file of files) {
                if (file.size === 0) continue;
                const uploadResult = await uploadStreamToCloudinary(file, 'employee_tasks');
                if (uploadResult.secure_url) {
                    uploadedUrls.push(uploadResult.secure_url);
                }
            }
        }

        const oldFileUrls = await prisma.employeeTask.findUnique({
            where: { id },
            select: { fileUrls: true }
        });

        await prisma.$transaction(async (tx) => {
            await tx.employeeTask.update({
                where: {
                    id: id
                },
                data: {
                    ...validatedFields.data,
                    fileUrls: uploadedUrls.length > 0 ? uploadedUrls : oldFileUrls?.fileUrls,
                    employeeTaskStatusId: determineEmployeeTaskStatusId(
                        validatedFields.data.startAt,
                        validatedFields.data.dueAt
                    )
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

        for (const oldFileUrl of oldFileUrls?.fileUrls || []) {
            await deleteFileFromCloudinary(oldFileUrl);
        }

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
        const oldFileUrls = await prisma.employeeTask.findUnique({
            where: { id },
            select: { fileUrls: true }
        });

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

        for (const oldFileUrl of oldFileUrls?.fileUrls || []) {
            await deleteFileFromCloudinary(oldFileUrl);
        }

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