import { PaginationWithLinks } from "@/components/pagination-with-links";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { getAllEmployeeTaskAction } from "@/features/employee-task/actions";
import EmployeeTaskList from "@/features/employee-task/components/employee-task-list";
import { PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

export default async function AdminTugasKaryawanPage({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string;
        search?: string;
        employeeTaskStatusId?: string;
    }>;
}) {
    const params = await searchParams;

    const page = Number(params.page ?? "1");

    const employeeTaskResponse = await getAllEmployeeTaskAction({
        page,
        search: params.search ?? "",
        employeeTaskStatusId: Number(params.employeeTaskStatusId ?? "") || undefined,
    });

    return (
        <>
            <Link href="/admin/employee-tasks/create" className="w-fit">
                <Button variant="outline">
                    Tambah Tugas <PlusIcon />
                </Button>
            </Link>

            <EmployeeTaskList
                data={employeeTaskResponse.data}
                page={page}
            />

            <PaginationWithLinks
                page={page}
                pageSize={10}
                totalCount={employeeTaskResponse.totalCount}
            />
        </>
    );
}