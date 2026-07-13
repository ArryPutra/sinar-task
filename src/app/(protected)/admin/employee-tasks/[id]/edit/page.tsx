import { getAllEmployeeTaskCategoryAction } from '@/features/employee-task-category/actions';
import { getEmployeeTaskByIdAction } from '@/features/employee-task/actions';
import EmployeeTaskForm from '@/features/employee-task/components/employee-task-form';
import { getAllEmployeesAction } from '@/features/employee/action';
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
