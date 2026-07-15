"use server"

import SummaryCard from "@/components/shared/summary-card";
import { getEmployeeTaskAssignmentsByEmployeeIdAction } from "@/features/employee-task-assignment/actions";
import EmployeeTaskAssignmentCard from "@/features/employee-task/components/employee-task-card";
import { getCurrentEmployee } from "@/features/employee/action";
import { notFound } from "next/navigation";

export default async function EmployeeDashboardPage() {
    const currentEmployee = (await getCurrentEmployee());

    if (!currentEmployee.data) {
        return notFound();
    }

    const taskAssignments = await getEmployeeTaskAssignmentsByEmployeeIdAction(currentEmployee.data?.id);

    return (
        <>
            <div className="grid grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-6">
                <SummaryCard
                    label="Total Pekerjaan"
                    value={taskAssignments.length} />
            </div>
            <div className="grid grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-6 mt-4">

                {
                    taskAssignments.map((item) => (
                        <EmployeeTaskAssignmentCard
                            key={item.id}
                            data={item} />
                    ))
                }
            </div>
        </>
    )
}

