import { getCurrentUserAction } from "@/features/auth/actions";
import { getEmployeeTaskAssignments } from "@/features/employee-task-assignment/actions";
import EmployeeDashboardView from "./view";
import { getEmployeeByIdAction } from "@/features/employee/action";

export default async function EmployeeDashboardPage() {
    
    return (
        <EmployeeDashboardView />
    )
}
