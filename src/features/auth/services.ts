import { auth } from "@/lib/auth";
import { LoginInput } from "./schemas";

export async function loginService(credentials: LoginInput, requestHeaders: Headers) {
    try {
        const response = await auth.api.signInEmail({
            body: {
                email: credentials.email,
                password: credentials.password
            },
            headers: requestHeaders
        });

        return { success: true, credentials: response };
    } catch (error: any) {
        console.error(error);

        throw new Error(error.message);
    }
}

export async function logoutService(requestHeaders: Headers) {
    try {
        await auth.api.signOut({
            headers: requestHeaders
        });
    } catch (error) {
        console.error(error);
        throw new Error("Failed to logout");
    }
}