import { prisma } from "@/lib/prisma";
import AdminDashboardView from "./view";

export default async function AdminDashboardPage() {

    const employeeCount = await prisma.employee.count();

    return (
        <AdminDashboardView
            cardData={{
                employeeCount
            }} />
    )
}
