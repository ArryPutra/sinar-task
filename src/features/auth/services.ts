import { auth } from "@/lib/auth";
import { LoginInput } from "./schemas";

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