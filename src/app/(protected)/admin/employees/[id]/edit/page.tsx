"use server"

import { getEmployeeByIdAction } from "@/features/employee/action";
import EmployeeForm from "@/features/employee/views/employee-form";
import { notFound } from "next/navigation";

export default async function EmployeeEditPage({
    params
}: {
    params: Promise<{
        id: string
    }>
}) {
    const { id } = await params;

    const employeeResponse = await getEmployeeByIdAction(id);

    if (!employeeResponse.data) {
        return notFound();
    }

    return (
        <EmployeeForm
            data={employeeResponse.data} />
    )
}
