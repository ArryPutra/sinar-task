"use server"

import { ActionState } from "@/types/action-state";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema } from "./schemas";
import { loginService, logoutService } from "./services";

export async function loginAction(prevState: ActionState, formData: FormData) {
    const validatedFields = loginSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            error: "Email atau password tidak valid secara format.",
            success: false
        }
    }

    try {
        const nextHeaders = await headers();

        await loginService(validatedFields.data, nextHeaders);
    } catch (error: any) {
        console.error(error);

        return {
            error: "Email atau password salah.",
            success: false
        }
    }

    redirect("/dashboard");
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
}