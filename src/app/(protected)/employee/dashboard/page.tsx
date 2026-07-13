"use server"

import SummaryCard from "@/components/summary-card";
import { getCurrentUserAction } from "@/features/auth/actions";
import { getEmployeeTaskAssignmentsByEmployeeIdAction } from "@/features/employee-task-assignment/actions";
import EmployeeTaskAssignmentCard from "@/features/employee-task-assignment/components/card";
import { getCurrentEmployee } from "@/features/employee/action";
import RegisterEmployeeView from "@/features/employee/components/employee-register-card";
import { notFound } from "next/navigation";

export default async function EmployeeDashboardPage() {
    const currentEmployee = (await getCurrentEmployee());

    if (!currentEmployee.data) {
        const user = await getCurrentUserAction();

        if (!user.user) {
            return notFound();
        }

        return <RegisterEmployeeView
        user={{ 
            name: user.user.name,
            email: user.user.email,
         }}/>
    }

    const taskAssignments = await getEmployeeTaskAssignmentsByEmployeeIdAction(currentEmployee.data?.id);

    const totalTugasHarusDikerjakan = taskAssignments.filter(
        task =>
            task.employeeTask.employeeTaskStatusId === 2 &&
            [1, 3].includes(task.employeeTaskAssignmentStatusId)
    ).length;

    return (
        <>
            <div className="grid grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-6">
                <SummaryCard
                    label="Tugas Aktif"
                    value={totalTugasHarusDikerjakan} />
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

