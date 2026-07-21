import BackButton from "@/components/shared/back-button";
import { getCurrentEmployee } from "@/features/employee/action";
import TaskSubmissionView from "@/features/task-report/views/task-submission";
import { prisma } from "@/lib/prisma";
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
    // <------------------------------------------------------------->
    const { taskAssignmentId } = await params;
    const { date } = await searchParams;

    const currentEmployeeResponse = await getCurrentEmployee();
    if (!currentEmployeeResponse.data) return notFound();
    // pastikan taskAssignmentId milik employeeId
    const isExist = await prisma.employeeTaskAssignment.findUnique({
        where: {
            id: taskAssignmentId,
            employeeId: currentEmployeeResponse.data.id
        }
    });
    if (!isExist) return notFound();

    return (
        <>
            <BackButton href="/employee/dashboard" />

            <TaskSubmissionView
                date={date}
                taskAssignmentId={taskAssignmentId}
                isAdmin={false} />
        </>
    )
}

