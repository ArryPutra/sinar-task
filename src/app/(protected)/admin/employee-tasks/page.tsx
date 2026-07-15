import { PaginationWithLinks } from "@/components/shared/pagination-with-links";
import { Button } from "@/components/ui/button";
import { getAllEmployeeTaskAction } from "@/features/employee-task/actions";
import EmployeeTaskManagementTable from "@/features/employee-task/components/table/employee-task-management";
import { PlusIcon } from "lucide-react";
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
                    Tambah Pekerjaan <PlusIcon />
                </Button>
            </Link>

            <EmployeeTaskManagementTable
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