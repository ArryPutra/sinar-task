import { Button } from "@/components/ui/button";
import { getAllEmployeeTaskAction } from "@/features/employee-task/actions";
import EmployeeTaskList from "@/features/employee-task/components/employee-task-list";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function AdminTugasKaryawanPage() {

    const employeeTaskResponse = await getAllEmployeeTaskAction();

    return (
        <>
            <Link href="/admin/employee-tasks/create">
                <Button className="w-fit" variant={'outline'}>
                    Tambah Tugas <PlusIcon />
                </Button>
            </Link>
            <EmployeeTaskList data={employeeTaskResponse.data} />
        </>
    )
}