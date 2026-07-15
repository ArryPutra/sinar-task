import ChartBarDefault from "@/components/charts/chart-bar-default";
import { PaginationWithLinks } from "@/components/shared/pagination-with-links";
import SummaryCard from "@/components/shared/summary-card";
import { getAllEmployeeTaskAssignment } from "@/features/employee-task-assignment/actions";
import EmployeeTaskAssignmentList from "@/features/employee-task-assignment/components/table-list";
import { getAllEmployeeTaskAction } from "@/features/employee-task/actions";
import EmployeeTaskDashboardTable from "@/features/employee-task/components/table/employee-task-dashboard";
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
            label: "Total Pekerjaan",
            value: await prisma.employeeTask.count()
        },
        {
            label: "Pekerjaan Menunggu Review",
            value: await prisma.employeeTaskAssignment.count({
                where: {
                    employeeTaskAssignmentStatusId: 2
                }
            })
        },
        {
            label: "Pekerjaan Sedang Dikerjakan",
            value: await prisma.employeeTaskAssignment.count({
                where: {
                    employeeTaskAssignmentStatusId: {
                        in: [1, 3]
                    }
                }
            })
        }
    ];

    const employeeTaskResponse = await getAllEmployeeTaskAction({
            page,
            search: params.search ?? "",
            employeeTaskStatusId: Number(params.employeeTaskStatusId ?? "") || undefined,
        });

    return (
        <>
            <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 ">
                {
                    summaryCards.map((card, index) => (
                        <SummaryCard key={index} label={card.label} value={card.value} />
                    ))
                }
            </div>

            <EmployeeTaskDashboardTable
                data={employeeTaskResponse.data}
                page={page} />
            {/* <PaginationWithLinks
                page={page}
                pageSize={10}
                totalCount={getAllTaskAssignmentsResponse.totalCount} /> */}
        </>
    )
}
