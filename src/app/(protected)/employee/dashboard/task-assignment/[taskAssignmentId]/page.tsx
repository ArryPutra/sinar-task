import BackButton from "@/components/shared/back-button";
import SubmissionView from "@/features/employee-task-report/views/submission-view";
import { getCurrentEmployee } from "@/features/employee/action";
import { notFound } from "next/navigation";

export default async function EmployeeDashboardTaskAssignmentPage({
    params,
    searchParams
}: {
    params: Promise<
        { taskAssignmentId: string }
    >
    searchParams: Promise<{
        date: string
    }>
}) {
    const start = performance.now();
    // <------------------------------------------------------------->
    const { taskAssignmentId } = await params;
    const { date } = await searchParams;

    const currentEmployeeResponse = await getCurrentEmployee();
    if (!currentEmployeeResponse.data) return notFound();
    // <------------------------------------------------------------->
    const end = performance.now();
    console.log(`DB_QUERY_DURATION: ${(end - start).toFixed(2)}ms`);

    return (
        <>
            <BackButton href="/employee/dashboard" />

            <SubmissionView
                date={date}
                taskAssignmentId={taskAssignmentId}
                employeeId={currentEmployeeResponse.data.id}
                isAdmin={false} />
        </>
    )
}

