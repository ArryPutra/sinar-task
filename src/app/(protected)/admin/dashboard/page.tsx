import ChartBarDefault from "@/components/charts/chart-bar-default";
import { PaginationWithLinks } from "@/components/pagination-with-links";
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

    const year = new Date().getFullYear();

    const chartData = await Promise.all(
        Array.from({ length: 12 }, async (_, index) => {
            const start = new Date(year, index, 1);
            const end = new Date(year, index + 1, 1);

            const report = await prisma.employeeTask.count({
                where: {
                    createdAt: {
                        gte: start,
                        lt: end,
                    },
                },
            });

            return {
                month: start.toLocaleString("id-ID", { month: "short" }),
                report,
            };
        })
    );

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

            <div className="grid grid-cols-2 max-md:grid-cols-1">
                <ChartBarDefault
                    title={`Tugas Karyawan ${year}`}
                    data={chartData}
                    dataKey="report"
                    xAxisKey="month"
                    label="Tugas" />
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
