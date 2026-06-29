import { Button } from "@/components/ui/button";
import { getAllEmployeeTaskCategoriesAction } from "@/features/employee-task-categories/actions";
import EmployeeTaskCategoryListPage from "@/features/employee-task-categories/components/employee-task-category-list";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function EmployeeTaskCategoriesPage() {
    const employeeTaskCategoriesResponse = await getAllEmployeeTaskCategoriesAction();

    return (
        <>
            <Link href={'/admin/employee-task-categories/create'}>
                <Button className="w-fit" variant={'outline'}>
                    Tambah Kategori Tugas <PlusIcon />
                </Button>
            </Link>

            <EmployeeTaskCategoryListPage data={employeeTaskCategoriesResponse.data} />
        </>
    )
}
