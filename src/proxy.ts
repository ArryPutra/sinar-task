import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { roleDashboardRoutesMap } from "./features/dashboard/config/role-dashboard-routes";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const url = request.nextUrl.pathname;

    const guestRoutes = ["/login"];
    const authRoutes = [
        "/admin/:path*",
        "/employee/:path*",
    ];

    const roleRouteMap: Record<number, string> = {
        1: "/admin",
        2: "/employee",
    };

    // Belum Ter-Autentikasi
    if (!session) {
        if (authRoutes.some((route) => url.startsWith(route.split("/:")[0]))) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Sudah Ter-Autentikasi
    if (session) {
        const userRoleId = session.user.userRoleId;

        // Kalau buka login → lempar ke dashboard masing-masing
        if (guestRoutes.includes(url)) {
            return NextResponse.redirect(
                new URL(roleDashboardRoutesMap[userRoleId], request.url)
            );
        }

        // Kalau masuk area role lain → blok
        for (const [id, route] of Object.entries(roleRouteMap)) {
            if (url.startsWith(route) && Number(id) !== userRoleId) {
                return NextResponse.redirect(
                    new URL(roleDashboardRoutesMap[userRoleId], request.url)
                );
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    // Daftarkan route yang akan di-proxy
    matcher: [
        "/login",
        "/admin/:path*",
        "/employee/:path*",
    ],
};