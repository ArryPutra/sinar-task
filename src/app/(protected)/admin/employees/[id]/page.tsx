import { getEmployeeByIdAction } from "@/features/employee/action";
import EmployeeDetail from "@/features/employee/views/employee-detail";
import { notFound } from "next/navigation";

export default async function EmployeeDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {

    const { id } = await params;

    const employeeResponse = await getEmployeeByIdAction(id);

    if (!employeeResponse.data) {
        return notFound();
    }

    return (
        <EmployeeDetail data={employeeResponse.data} />
    )
}
