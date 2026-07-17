"use server"

import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActionState } from "@/types/action-state";
import { headers } from "next/headers";
import { getCurrentUserAction } from "../auth/actions";
import { employeeWithUser, employeeWithUserAndTask } from "./queris";
import { createEmployeeSchema, createSelfEmployeeSchema, updateEmployeeSchema } from "./schemas";

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
            success: true,
            message: null,
            data: data
        }
    } catch (error) {
        console.error(error);

        return {
            success: false,
            data: [],
            message: "Gagal mengambil daftar karyawan.",
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
        const newUser = await auth.api.createUser({
            body: {
                email: validatedFields.data.email,
                name: validatedFields.data.name,
                password: validatedFields.data.password,
            }
        });

        await upsertEmployeeAction(newUser.user.id, validatedFields.data.phoneNumber);
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
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
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
            error: "Gagal mengambil data karyawan saat ini.",
            success: false,
            data: null
        };
    }
}

export async function createSelfEmployeeAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const validatedFields = createSelfEmployeeSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            success: false,
            fields: Object.fromEntries(formData.entries()),
            fieldErrors: validatedFields.error?.flatten().fieldErrors
        };
    }

    try {
        const currentUser = await getCurrentUserAction();

        if (!currentUser.user) {
            return {
                success: false,
                fields: Object.fromEntries(formData.entries()),
                fieldErrors: null
            };
        }

        await upsertEmployeeAction(currentUser.user.id, validatedFields.data.phoneNumber);

        if (validatedFields.data.name !== currentUser.user.name) {
            await auth.api.updateUser({
                body: {
                    name: validatedFields.data.name
                }
            })
        }

        return {
            success: true,
            message: "Karyawan berhasil didaftarkan.",
            fields: null,
            fieldErrors: null
        };
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return {
                success: false,
                fields: Object.fromEntries(formData.entries()),
                fieldErrors: {
                    phoneNumber: [
                        "Nomor telepon sudah digunakan oleh akun lain.",
                    ],
                },
            };
        }

        return {
            success: false,
            fields: Object.fromEntries(formData.entries()),
            fieldErrors: null
        };
    }
}

function upsertEmployeeAction(userId: string, phoneNumber: string) {
    return prisma.employee.upsert({
        where: { userId },
        create: {
            userId,
            phoneNumber,
        },
        update: {
            phoneNumber,
        },
    });
}