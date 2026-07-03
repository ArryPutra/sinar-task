import SummaryCard from "@/components/summary-card";
import { getAllEmployeeTaskAssignment } from "@/features/employee-task-assignment/actions";
import EmployeeTaskAssignmentList from "@/features/employee-task-assignment/components/table-list";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {

    const summaryCards = [
        {
            label: "Total Karyawan",
            value: await prisma.employee.count()
        },
        {
            label: "Tugas Menunggu Review",
            value: await prisma.employeeTaskAssignment.count({
                where: {
                    employeeTaskAssignmentStatusId: 2
                }
            })
        }
    ];

    const getAllTaskAssignmentsResponse = await getAllEmployeeTaskAssignment();

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
            taskAssignments={getAllTaskAssignmentsResponse.data} />
        </>
    )
}
