import { Button } from "@/components/ui/button";
import { getAllEmployeeTaskCategoryAction } from "@/features/employee-task-category/actions";
import EmployeeTaskCategoryListPage from "@/features/employee-task-category/components/employee-task-category-list";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function EmployeeTaskCategoryPage() {
    const employeeTaskCategoryResponse = await getAllEmployeeTaskCategoryAction();

    return (
        <>
            <Link href={'/admin/employee-task-categories/create'}>
                <Button className="w-fit" variant={'outline'}>
                    Tambah Kategori Tugas <PlusIcon />
                </Button>
            </Link>

            <EmployeeTaskCategoryListPage data={employeeTaskCategoryResponse.data} />
        </>
    )
}
