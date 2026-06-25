"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Dashboard_Page() {
    const sessionData = await auth.api.getSession({
        headers: await headers()
    });

    return (
        <h1 className="text-2xl font-bold">
            Selamat Datang, {`${sessionData?.user.name}`}
        </h1>
    )
}
