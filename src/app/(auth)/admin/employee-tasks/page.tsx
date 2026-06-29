import { Button } from "@/components/ui/button";
import { getAllEmployeeTasksAction } from "@/features/employee-tasks/actions";
import EmployeeTaskList from "@/features/employee-tasks/components/employee-task-list";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function AdminTugasKaryawanPage() {

    const employeeTasksResponse = await getAllEmployeeTasksAction();

    return (
        <>
            <Link href="/admin/employee-tasks/create">
                <Button className="w-fit" variant={'outline'}>
                    Tambah Tugas <PlusIcon />
                </Button>
            </Link>
            <EmployeeTaskList data={employeeTasksResponse.data} />
        </>
    )
}