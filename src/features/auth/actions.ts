"use server"

import { roleDashboardRoutesMap } from "@/features/sidebar/config/role-dashboard-routes";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema } from "./schemas";
import { logoutService } from "./services";

export async function loginAction(
    prevState: any,
    formData: FormData
) {
    const validatedFields = loginSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Email atau password tidak valid secara format.",
        };
    }

    const token = formData.get("cf-turnstile-response") as string;

    if (!token) {
        return {
            success: false,
            message: "Silakan selesaikan verifikasi keamanan.",
        };
    }

    const nextHeaders = await headers();

    const ip =
        nextHeaders.get("cf-connecting-ip") ??
        nextHeaders.get("x-forwarded-for")?.split(",")[0].trim();

    const isVerified = await verifyTurnstile(token, ip);

    if (!isVerified) {
        return {
            success: false,
            message: "Verifikasi keamanan gagal.",
        };
    }

    let session;
    try {
        session = await auth.api.signInEmail({
            body: {
                email: validatedFields.data.email,
                password: validatedFields.data.password,
            },
            headers: nextHeaders,
        });
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Email atau password salah.",
        };
    }

    return redirect(roleDashboardRoutesMap[session.user.userRoleId!]);
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

        const session = await auth.api.getSession({
            headers: nextHeaders
        });

        return { success: true, user: session?.user };
    } catch (error) {
        console.error(error);

        return {
            error: "Gagal mendapatkan data user.",
            success: false
        }
    }
}

export async function loginGoogle() {
    const response = await auth.api.signInSocial({
        body: {
            provider: "google",
            callbackURL: `${process.env.BETTER_AUTH_URL}/employee/dashboard`,
        }
    });

    return redirect(response.url as string);
}

export async function getCurrentAdmin() {
    const currentUserId = (await getCurrentUserAction()).user?.id;

    try {
        const data = await prisma.admin.findUnique({
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

export async function verifyTurnstile(
    token: string,
    remoteip?: string
): Promise<boolean> {
    const formData = new FormData();

    formData.append("secret", process.env.TURNSTILE_SECRET_KEY!);
    formData.append("response", token);

    if (remoteip) {
        formData.append("remoteip", remoteip);
    }

    const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            body: formData,
            cache: "no-store",
        }
    );

    const result: {
        success: boolean;
        "error-codes"?: string[];
    } = await response.json();

    if (!result.success) {
        console.error("Turnstile:", result["error-codes"]);
    }

    return result.success;
}