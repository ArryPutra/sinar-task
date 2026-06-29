import { getEmployeeTaskByIdAction } from '@/features/employee-tasks/actions';
import EmployeeTaskDetail from '@/features/employee-tasks/components/employee-task-detail';

export default async function AdminTugasKaryawanDetail({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const getEmployeeTaskResponse = await getEmployeeTaskByIdAction(id);

    if (!getEmployeeTaskResponse.data) {
        return;
    }

    return (
        <EmployeeTaskDetail
            data={getEmployeeTaskResponse.data} />
    )
}
