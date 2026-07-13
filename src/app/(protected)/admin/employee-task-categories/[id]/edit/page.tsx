"use server"

import { getEmployeeTaskCategoryByIdAction } from "@/features/employee-task-category/actions";
import EmployeeTaskCategoryForm from "@/features/employee-task-category/components/employee-task-category-form";
import { notFound } from "next/navigation";

export default async function EditEmployeeTaskCategoryPage({
    params
}: {
    params: Promise<{
        id: string
    }>
}) {
    const { id } = await params;

    const employeeTaskCategoryResponse = await getEmployeeTaskCategoryByIdAction(parseInt(id));

    if (!employeeTaskCategoryResponse.data) {
        return notFound();
    }

    return (
        <EmployeeTaskCategoryForm
            data={employeeTaskCategoryResponse.data} />
    )
}
