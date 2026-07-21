import { getAllEmployeesAction } from '@/features/employee/action';
import { getAllEmployeeTaskCategoryAction } from '@/features/task-category/actions';
import { getEmployeeTaskByIdAction } from '@/features/task/actions';
import EmployeeTaskForm from '@/features/task/views/admin/employee-task-form';
import { notFound } from 'next/navigation';

export default async function EditEmployeeTaskPage({
  params
}: {
  params: Promise<{
    id: string
  }>
}) {

  const { id } = await params;

  const getEmployeeTaskResponse = await getEmployeeTaskByIdAction(id);
  const getAllEmployeeTaskCategoryResponse = await getAllEmployeeTaskCategoryAction();
  const getAllEmployeeResponse = await getAllEmployeesAction();

  if (!getEmployeeTaskResponse.data) {
    return notFound();
  }

  return (
    <EmployeeTaskForm
      data={getEmployeeTaskResponse.data}
      employeeTaskCategory={getAllEmployeeTaskCategoryResponse.data}
      employee={getAllEmployeeResponse.data} />
  )
}
