import { getAllEmployeeTaskCategoriesAction } from '@/features/employee-task-categories/actions';
import { getEmployeeTaskByIdAction } from '@/features/employee-tasks/actions';
import EmployeeTaskForm from '@/features/employee-tasks/components/employee-task-form';
import { getAllEmployeesAction } from '@/features/employees/action';
import { notFound } from 'next/navigation';

export default async function EditEmployeeTasksPage({
  params
}: {
  params: Promise<{
    id: string
  }>
}) {

  const { id } = await params;

  const getEmployeeTaskResponse = await getEmployeeTaskByIdAction(id);
  const getAllEmployeeTaskCategoriesResponse = await getAllEmployeeTaskCategoriesAction();
  const getAllEmployeesResponse = await getAllEmployeesAction();

  if (!getEmployeeTaskResponse.data) {
    return notFound();
  }

  return (
    <EmployeeTaskForm
      data={getEmployeeTaskResponse.data}
      employeeTaskCategories={getAllEmployeeTaskCategoriesResponse.data}
      employees={getAllEmployeesResponse.data} />
  )
}
