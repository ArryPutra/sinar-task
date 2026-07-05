import { PaginationWithLinks } from "@/components/pagination-with-links";
import SearchInput from "@/components/search-input";
import SummaryCard from "@/components/summary-card";
import { getAllEmployeeTaskAssignment } from "@/features/employee-task-assignment/actions";
import EmployeeTaskAssignmentList from "@/features/employee-task-assignment/components/table-list";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage({
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

    const summaryCards = [
        {
            label: "Total Tugas",
            value: await prisma.employeeTask.count()
        },
        {
            label: "Tugas Menunggu Review",
            value: await prisma.employeeTaskAssignment.count({
                where: {
                    employeeTaskAssignmentStatusId: 2
                }
            })
        },
        {
            label: "Tugas Sedang Dikerjakan",
            value: await prisma.employeeTaskAssignment.count({
                where: {
                    employeeTaskAssignmentStatusId: {
                        in: [1, 3]
                    }
                }
            })
        }
    ];

    const getAllTaskAssignmentsResponse = await getAllEmployeeTaskAssignment({
        page,
        search: params.search ?? ""
    });
    const getAllEmployeeTaskAssignmentStatusOptions = await prisma.employeeTaskAssignmentStatus.findMany();

    return (
        <>
            <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 ">
                {
                    summaryCards.map((card, index) => (
                        <SummaryCard key={index} label={card.label} value={card.value} />
                    ))
                }
            </div>

            <EmployeeTaskAssignmentList
                taskAssignments={getAllTaskAssignmentsResponse.data}
                employeeTaskAssignmentStatusOptions={getAllEmployeeTaskAssignmentStatusOptions} />
            <PaginationWithLinks
                page={page}
                pageSize={10}
                totalCount={getAllTaskAssignmentsResponse.totalCount} />
        </>
    )
}
