import { getEmployeeTaskAssignmentsByEmployeeIdAction } from "@/features/employee-task-assignment/actions";
import EmployeeTaskAssignmentCard from "@/features/employee-task-assignment/components/card";
import { getCurrentEmployee } from "@/features/employee/action";
import { notFound } from "next/navigation";

export default async function EmployeeDashboardPage() {
    const currentEmployee = (await getCurrentEmployee());

    if (!currentEmployee.data) {
        notFound();
    }

    const taskAssignments = await getEmployeeTaskAssignmentsByEmployeeIdAction(currentEmployee.data?.id);

    return (
        <div className="grid grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-6">
            {
                taskAssignments.map((item) => (
                    <EmployeeTaskAssignmentCard
                        key={item.id}
                        data={item} />
                ))
            }
        </div>
    )
}
