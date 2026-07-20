import BackButton from "@/components/shared/back-button";
import SubmissionView from "@/features/employee-task-report/views/submission-view";

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
    const { date, employeeId, taskId } = await searchParams;

    return (
        <>
            <BackButton href={`/admin/dashboard/task/${taskId}`} />
            <SubmissionView
                date={date}
                taskAssignmentId={taskAssignmentId}
                employeeId={employeeId}
                isAdmin={true} />
        </>
    )
}
