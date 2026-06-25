import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const url = request.nextUrl.pathname;
    const guestRoutes = ["/login"];

    // Belum Ter-Autentikasi
    if (!session) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Sudah Ter-Autentikasi
    if (session) {
        // Jika buka url khusus guestRoutes -> lempar ke dashboard
        if (guestRoutes.includes(url)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    // Daftarkan route yang akan di-proxy
    matcher: [
        "/login",
        "/dashboard"
    ],
};