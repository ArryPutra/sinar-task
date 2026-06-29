import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
    return redirect("/admin/employee-tasks")
}
