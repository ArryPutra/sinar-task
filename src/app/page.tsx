import { getCurrentUserAction } from "@/features/auth/actions";
import { redirect } from "next/navigation";

export default async function Home() {
    const currentUser = await getCurrentUserAction();

    if (currentUser) {
        const role = currentUser.user?.userRoleId;
        if (role === 1) {
            return redirect("/admin/dashboard");
        } else if (role === 2) {
            return redirect("/employee/dashboard");
        }
    }

    return redirect("/login");
}