"use server"

import { deleteFileFromCloudinary, uploadStreamToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { ActionState } from "@/types/action-state";
import { revalidatePath } from "next/cache";
import { getAllEmployeeTaskAssignmentQuery, getEmployeeTaskAssignmentsByEmployeeIdActionQuery } from "./queris";
import { submitEmployeeTaskAssignmentActionSchema } from "./schemas";
import { Prisma } from "@/generated/prisma/client";

export async function getAllEmployeeTaskAssignment({
    page = 1,
    search = "",
}: {
    page: number
    search?: string
}) {
    try {
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const where: Prisma.EmployeeTaskAssignmentWhereInput = {
            ...(search && {
                OR: [
                    {
                        employee: {
                            user: {
                                name: {
                                    contains: search,
                                    mode: "insensitive",
                                }
                            }
                        }
                    }
                ],
            }),
        };

        const [data, totalCount] = await Promise.all([
            prisma.employeeTaskAssignment.findMany({
                where,
                orderBy: {
                    employeeTask: {
                        createdAt: "desc"
                    }
                },
                skip,
                take: pageSize,
                ...getAllEmployeeTaskAssignmentQuery
            }),
            prisma.employeeTaskAssignment.count({ where })
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
            error: "Gagal mengambil daftar penugasan tugas karyawan.",
            success: false,
            data: [],
            totalCount: 0
        };
    }
}

export async function getEmployeeTaskAssignmentsByEmployeeIdAction(employeeId: string) {
    try {
        const employeeTaskAssignmentsResponse = await prisma.employeeTaskAssignment.findMany({
            where: {
                employeeId: employeeId
            },
            orderBy: {
                createdAt: "desc"
            },
            ...getEmployeeTaskAssignmentsByEmployeeIdActionQuery
        });

        return employeeTaskAssignmentsResponse;
    } catch (error) {
        console.error(error);

        return [];
    }
}

export async function submitEmployeeTaskAssignmentAction(
    id: string,
    prevState: ActionState,
    formData: FormData
) {
    const validatedFields = submitEmployeeTaskAssignmentActionSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            error: validatedFields.error?.message,
            success: false,
            message: "Validasi gagal. Silakan periksa kembali input Anda.",
            fields: Object.fromEntries(formData.entries()),
            fieldErrors: validatedFields.error?.flatten().fieldErrors
        };
    }

    // Memastikan bahwa taskAssigment adalah milik karyawan yang sedang login
    const taskAssignment = await prisma.employeeTaskAssignment.findUnique({
        where: {
            id: id
        },
        include: {
            employeeTask: {
                select: {
                    employeeTaskStatusId: true
                }
            }
        }
    });
    if (!taskAssignment) {
        return {
            error: "Tugas tidak ditemukan atau tidak dimiliki oleh karyawan ini.",
            success: false,
            message: "Tugas tidak ditemukan atau tidak dimiliki oleh karyawan ini.",
            fields: Object.fromEntries(formData.entries()),
            fieldErrors: null
        };
    }

    const files = formData.getAll("fileUrls") as File[];

    // Memastikan bahwa setidaknya ada satu file yang diunggah
    if (files[0].size === 0 && taskAssignment.fileUrls.length === 0) {
        return {
            error: "Lampiran harus diunggah.",
            success: false,
            message: "Lampiran harus diunggah.",
            fields: Object.fromEntries(formData.entries()),
            fieldErrors: {
                fileUrls: ["Lampiran harus diunggah."]
            }
        };
    }

    // Memastikan bahwa status taskAssignment tidak boleh sama dengan 3 (selesai)
    if (taskAssignment.employeeTaskAssignmentStatusId === 4) {
        return {
            error: "Tugas sudah selesai dan tidak dapat diubah.",
            success: false,
            message: "Tugas sudah selesai dan tidak dapat diubah.",
            fields: Object.fromEntries(formData.entries()),
            fieldErrors: null
        };
    }

    // Memastikan bahwa status task tidak boleh ditutup 3 (ditutup)
    if (taskAssignment.employeeTask.employeeTaskStatusId === 3) {
        return {
            error: "Tugas sudah ditutup dan tidak dapat dikumpulkan.",
            success: false,
            message: "Tugas sudah ditutup dan tidak dapat dikumpulkan.",
            fields: Object.fromEntries(formData.entries()),
            fieldErrors: null
        };
    }

    const uploadedUrls: string[] = [];

    try {
        for (const file of files) {
            if (file.size === 0) continue;
            const uploadResult = await uploadStreamToCloudinary(file, 'employee_task_assignments');
            if (uploadResult.secure_url) {
                uploadedUrls.push(uploadResult.secure_url);
            }
        }

        await prisma.employeeTaskAssignment.update({
            where: {
                id: id
            },
            data: {
                note: validatedFields.data.note,
                fileUrls: uploadedUrls,
                employeeTaskAssignmentStatusId: 2
            }
        });

        revalidatePath(`/employee/dashboard`);

        // menghapus file lama dari Cloudinary jika ada
        for (const oldFileUrl of taskAssignment?.fileUrls || []) {
            await deleteFileFromCloudinary(oldFileUrl);
        }

        return {
            error: null,
            success: true,
            message: "Tugas berhasil dikumpulkan!"
        }
    } catch (error) {
        console.error(error);

        for (const url of uploadedUrls) {
            await deleteFileFromCloudinary(url);
        }

        return {
            error: "Gagal mengirimkan penugasan tugas karyawan.",
            success: false,
            message: "Terjadi kesalahan saat mengirimkan penugasan tugas karyawan. Silakan coba lagi.",
            fields: Object.fromEntries(formData.entries()),
            fieldErrors: null
        };
    }
}

export async function updateEmployeeTaskAssignmentStatusAction(
    id: string,
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const employeeTaskAssignmentStatusId = Number(formData.get("employeeTaskAssignmentStatusId"));

    try {
        await prisma.employeeTaskAssignment.update({
            where: {
                id: id
            },
            data: {
                employeeTaskAssignmentStatusId: employeeTaskAssignmentStatusId
            }
        });

        revalidatePath(`/admin/employee-tasks/${id}`);

        return {
            error: null,
            success: true,
            message: "Status tugas berhasil diperbarui!"
        }
    }
    catch (error) {
        console.error(error);

        return {
            error: "Gagal memperbarui status tugas.",
            success: false,
            message: "Terjadi kesalahan saat memperbarui status tugas. Silakan coba lagi."
        };
    }
}