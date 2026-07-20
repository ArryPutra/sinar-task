import BackButton from "@/components/shared/back-button";
import EmployeeTaskAssignmentView from "@/features/employee-task-assignment/views/employee-task-assignment";
import { prisma } from "@/lib/prisma";

export default async function TaskAssignmentPage({
    params,
    searchParams
}: {
    params: Promise<
        { taskAssignmentId: string }
    >
    searchParams: Promise<{
        date: string
        employeeId: string
        taskId: string
    }>
}) {
    const { taskAssignmentId } = await params;
    const { date } = await searchParams;

    const employeeTaskIdResponse = await prisma.employeeTaskAssignment.findUnique({
        where: {
            id: taskAssignmentId
        },
        select: {
            employeeTask: {
                select: {
                    id: true
                }
            }
        }
    });

    return (
        <>
            <BackButton href={`/admin/dashboard/task/${employeeTaskIdResponse?.employeeTask.id}`} />
            <EmployeeTaskAssignmentView
                date={date}
                taskAssignmentId={taskAssignmentId}
                isAdmin={true} />
        </>
    )
}
