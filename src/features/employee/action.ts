"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActionState } from "@/types/action-state";
import { headers } from "next/headers";
import { getCurrentUserAction } from "../auth/actions";
import { employeeWithUser, employeeWithUserAndTask } from "./queris";
import { createEmployeeSchema, updateEmployeeSchema } from "./schemas";

export async function getAllEmployeesAction() {
    try {
        const data = await prisma.employee.findMany({
            orderBy: {
                user: {
                    name: "asc"
                }
            },
            ...employeeWithUser
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

export async function getEmployeeByIdAction(id: string) {
    try {
        const data = await prisma.employee.findUnique({
            where: {
                id: id
            },
            ...employeeWithUserAndTask
        });

        return {
            error: null,
            success: true,
            data: data,
        };
    } catch (error) {
        console.error(error);

        return {
            error: "Gagal mengambil detail karyawan.",
            success: false,
            data: null
        };
    }
}

export async function createEmployeeAction(
    prevState: ActionState,
    formData: FormData
) {
    const validatedFields = createEmployeeSchema.safeParse(
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
        console.log(validatedFields.data);
        const newUser = await auth.api.createUser({
            body: {
                email: validatedFields.data.email,
                name: validatedFields.data.name,
                password: validatedFields.data.password,
            }
        });

        await prisma.employee.create({
            data: {
                userId: newUser.user.id,
                phoneNumber: validatedFields.data.phoneNumber
            }
        });
    } catch (error) {
        return {
            error: "Gagal menambahkan karyawan.",
            success: false,
            fields: Object.fromEntries(formData.entries()),
            fieldErrors: null
        };
    }

    return {
        error: null,
        success: true,
        message: "Karyawan berhasil ditambahkan.",
        fields: null,
        fieldErrors: null
    }
}

export async function updateEmployeeAction(
    id: string,
    prevState: ActionState,
    formData: FormData
) {
    const validatedFields = updateEmployeeSchema.safeParse(
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
        const employee = await prisma.employee.update({
            where: {
                id: id
            },
            data: {
                phoneNumber: validatedFields.data.phoneNumber,
                user: {
                    update: {
                        name: validatedFields.data.name,
                        email: validatedFields.data.email,
                    }
                }
            }
        });

        if (validatedFields.data.password) {
            await auth.api.setUserPassword({
                body: {
                    userId: employee.userId,
                    newPassword: validatedFields.data.password
                },
                headers: await headers()
            });
        }

        return {
            error: null,
            success: true,
            message: "Karyawan berhasil diperbarui.",
            fields: Object.fromEntries(formData.entries())
        }
    } catch (error) {
        console.error(error);

        return {
            error: "Gagal memperbarui karyawan.",
            success: false,
            fields: Object.fromEntries(formData.entries()),
            fieldErrors: null
        };
    }
}

export async function getCurrentEmployee() {
    const currentUserId = (await getCurrentUserAction()).user?.id;

    try {
        const data = await prisma.employee.findUnique({
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