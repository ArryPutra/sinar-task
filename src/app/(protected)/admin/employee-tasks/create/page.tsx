import { getAllEmployeeTaskCategoryAction } from '@/features/employee-task-category/actions';
import EmployeeTaskForm from '@/features/employee-task/components/employee-task-form';
import { getAllEmployeesAction } from '@/features/employee/action';

export default async function CreateEmployeeTaskPage() {

  const getAllEmployeeTaskCategoryResponse = await getAllEmployeeTaskCategoryAction();
  const getAllEmployeeResponse = await getAllEmployeesAction();

  return (
    <EmployeeTaskForm
      employeeTaskCategory={getAllEmployeeTaskCategoryResponse.data}
      employee={getAllEmployeeResponse.data} />
  )
}
