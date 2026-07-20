import { PaginationWithLinks } from "@/components/shared/pagination-with-links";
import SummaryCard from "@/components/shared/summary-card";
import { getAllEmployeeTaskAction } from "@/features/employee-task/actions";
import TaskDashboardTable from "@/features/employee-task/components/table/task-dashboard";
import { AllEmployeeTaskDashboardData, getAllEmployeeTaskDashboardActionQuery } from "@/features/employee-task/queris";
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
            label: "Total Semua Pekerjaan",
            value: await prisma.employeeTask.count()
        },
        {
            label: "Total Pekerjaan Aktif",
            value: await prisma.employeeTask.count({
                where: {
                    startAt: {
                        lte: new Date(),
                    },
                    dueAt: {
                        gte: new Date(),
                    },
                }
            })
        },
        {
            label: "Total Permintaan Peninjauan",
            value: await prisma.employeeTaskReport.count({
                where: {
                    employeeTaskReportStatusId: {
                        in: [2]
                    }
                }
            })
        }
    ];

    const employeeTaskResponse = await getAllEmployeeTaskAction({
        page,
        search: params.search ?? "",
        employeeTaskStatusId: Number(params.employeeTaskStatusId ?? "") || undefined,
        query: getAllEmployeeTaskDashboardActionQuery
    });

    console.log(JSON.stringify(employeeTaskResponse.data, null, 2))

    return (
        <>
            <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 ">
                {
                    summaryCards.map((card, index) => (
                        <SummaryCard key={index} label={card.label} value={card.value} />
                    ))
                }
            </div>

            <TaskDashboardTable
                data={employeeTaskResponse.data as AllEmployeeTaskDashboardData[]}
                page={page} />
            <PaginationWithLinks
                page={page}
                pageSize={10}
                totalCount={employeeTaskResponse.totalCount} />
        </>
    )
}
