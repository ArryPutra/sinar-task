import { prisma } from '@/lib/prisma'
import EmployeeProfileView from './view'
import { getCurrentEmployee } from '@/features/employee/action'
import { notFound } from 'next/navigation';

export default async function EmployeeProfilePage() {

  const currentEmployee = await getCurrentEmployee();

  if (!currentEmployee.data) {
    return notFound();
  }

  return (
    <EmployeeProfileView
      data={{
        email: currentEmployee.data.user.email,
        name: currentEmployee.data.user.name ?? "",
        phoneNumber: currentEmployee.data.phoneNumber
     }} />
  )
}
