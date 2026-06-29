import { getAllEmployeeTaskCategoriesAction } from '@/features/employee-task-categories/actions';
import EmployeeTaskForm from '@/features/employee-tasks/components/employee-task-form';
import { getAllEmployeesAction } from '@/features/employees/action';

export default async function CreateEmployeeTasksPage() {

  const getAllEmployeeTaskCategoriesResponse = await getAllEmployeeTaskCategoriesAction();
  const getAllEmployeesResponse = await getAllEmployeesAction();

  return (
    <EmployeeTaskForm
      employeeTaskCategories={getAllEmployeeTaskCategoriesResponse.data}
      employees={getAllEmployeesResponse.data} />
  )
}
