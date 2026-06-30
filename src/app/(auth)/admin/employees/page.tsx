import { Button } from '@/components/ui/button'
import { getAllEmployeesAction } from '@/features/employee/action'
import EmployeeList from '@/features/employee/components/employee-list'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

export default async function EmployeesPage() {

    const employeesResponse = await getAllEmployeesAction();

    return (
        <>
            <Link href={'/admin/employees/create'}>
                <Button className="w-fit" variant={'outline'}>
                    Tambah karyawan <PlusIcon />
                </Button>
            </Link>

            <EmployeeList data={employeesResponse.data} />
        </>
    )
}
