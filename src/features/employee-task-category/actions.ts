"use server"

import { prisma } from "@/lib/prisma";
import { ActionState } from "@/types/action-state";
import { revalidatePath } from "next/cache";
import { formEmployeeTaskCategorySchema } from "./schemas";

export async function getAllEmployeeTaskCategoryAction() {
    try {
        const data = await prisma.employeeTaskCategory.findMany({
            orderBy: {
                createdAt: "desc"
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
            error: "Gagal mengambil daftar kategori tugas karyawan.",
            success: false,
            data: []
        };
    }
}

export async function getEmployeeTaskCategoryByIdAction(id: number) {
    try {
        const data = await prisma.employeeTaskCategory.findUnique({
            where: {
                id: id
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
            error: "Gagal mengambil detail kategori tugas karyawan.",
            success: false,
            data: null
        };
    }
}

export async function createEmployeeTaskCategoryAction(
    prevState: ActionState,
    formData: FormData
) {
    const validatedFields = formEmployeeTaskCategorySchema.safeParse(
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

    const existingCategory = await prisma.employeeTaskCategory.findUnique({
        where: { name: validatedFields.data.name }
    });

    if (existingCategory) {
        return {
            error: "Kategori tugas karyawan dengan nama tersebut sudah ada.",
            success: false,
            fields: Object.fromEntries(formData.entries()),
            fieldErrors: {
                name: ["Nama kategori sudah digunakan."]
            }
        };
    }

    try {
        await prisma.employeeTaskCategory.create({
            data: validatedFields.data
        });

        return {
            error: null,
            success: true,
            message: `Kategori tugas "${validatedFields.data.name}" berhasil ditambahkan.`,
        };
    } catch (error) {
        console.error(error);

        return {
            error: "Gagal membuat kategori tugas karyawan.",
            success: false,
            fields: Object.fromEntries(formData.entries())
        };
    }
}

export async function updateEmployeeTaskCategoryByIdAction(
    id: number,
    prevState: ActionState,
    formData: FormData
) {
    const validatedFields = formEmployeeTaskCategorySchema.safeParse(
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
        await prisma.employeeTaskCategory.update({
            where: {
                id: id
            },
            data: validatedFields.data
        });

        return {
            error: null,
            success: true,
            message: `Kategori tugas karyawan "${validatedFields.data.name}" berhasil diperbarui.`,
            fields: Object.fromEntries(formData.entries())
        };
    } catch (error: any) {
        console.error(error);

        if (error.code === "P2002") {
            return {
                error: "Nama kategori tugas karyawan sudah digunakan.",
                success: false,
                fields: Object.fromEntries(formData.entries()),
                fieldErrors: {
                    name: ["Nama kategori sudah digunakan."]
                }
            };
        }

        return {
            error: "Gagal memperbarui kategori tugas karyawan.",
            success: false,
        };
    }
}

export async function deleteEmployeeTaskCategoryByIdAction(
    id: number,
    prevState: ActionState
) {

    try {
        await prisma.employeeTaskCategory.delete({
            where: {
                id: id
            }
        });

        revalidatePath("/admin/employee-task-categories");

        return {
            error: null,
            success: true
        };
    } catch (error: any) {
        console.error(error);

        let errorMessage;

        if (error.code === "P2003") {
            errorMessage = "Kategori tugas karyawan ini tidak dapat dihapus karena masih digunakan."
        }

        return {
            error: errorMessage ?? "Gagal menghapus kategori tugas karyawan.",
            success: false
        };
    }
}