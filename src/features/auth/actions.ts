"use server"

import { roleDashboardRoutesMap } from "@/features/dashboard/config/role-dashboard-routes";
import { ActionState } from "@/types/action-state";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema } from "./schemas";
import { getCurrentUserService, loginService, logoutService } from "./services";

export async function loginAction(
    prevState: ActionState,
    formData: FormData
) {
    const validatedFields = loginSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            error: "Email atau password tidak valid secara format.",
            success: false
        }
    }

    let session = null;

    try {
        const nextHeaders = await headers();

        session = await loginService(validatedFields.data, nextHeaders);

        return {
            error: null,
            success: true,
        }
    } catch (error: any) {
        console.error(error);

        return {
            error: "Email atau password salah.",
            success: false
        }
    }
}

export async function logoutAction() {
    try {
        const nextHeaders = await headers();

        await logoutService(nextHeaders);
    } catch (error) {
        console.error(error);

        return {
            error: "Gagal logout.",
            success: false
        }
    }

    redirect("/login");
}

export async function getCurrentUserAction() {
    try {
        const nextHeaders = await headers();

        const { user } = await getCurrentUserService(nextHeaders);

        return { success: true, user: user };
    } catch (error) {
        console.error(error);

        return {
            error: "Gagal mendapatkan data user.",
            success: false
        }
    }
}