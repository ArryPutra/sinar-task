import BackButton from "@/components/shared/back-button";
import TaskSubmissionView from "@/features/task-report/views/task-submission";
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
            <TaskSubmissionView
                date={date}
                taskAssignmentId={taskAssignmentId}
                isAdmin={true} />
        </>
    )
}
