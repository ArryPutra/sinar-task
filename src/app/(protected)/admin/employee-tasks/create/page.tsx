import { getAllEmployeesAction } from '@/features/employee/action';
import { getAllEmployeeTaskCategoryAction } from '@/features/task-category/actions';
import EmployeeTaskForm from '@/features/task/views/admin/employee-task-form';

export default async function CreateEmployeeTaskPage() {

  const getAllEmployeeTaskCategoryResponse = await getAllEmployeeTaskCategoryAction();
  const getAllEmployeeResponse = await getAllEmployeesAction();

  return (
    <EmployeeTaskForm
      employeeTaskCategory={getAllEmployeeTaskCategoryResponse.data}
      employee={getAllEmployeeResponse.data} />
  )
}
