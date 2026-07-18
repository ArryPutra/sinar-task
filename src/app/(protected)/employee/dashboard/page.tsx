"use server"

import SummaryCard from "@/components/shared/summary-card";
import TaskCardDetail from "@/features/employee-task/components/card-detail";
import { taskCardDetailQuery } from "@/features/employee-task/queris";
import { getCurrentEmployee } from "@/features/employee/action";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EmployeeDashboardPage() {
    const currentEmployee = (await getCurrentEmployee());

    if (!currentEmployee.data) return notFound();

    const summaryCards = [
        {
            label: "Total Pekerjaan",
            value: await prisma.employeeTaskAssignment.count({
                where: {
                    employeeTaskAssignmentStatusId: {
                        not: 3
                    }
                }
            })
        }
    ]

    const taskAssignments = await prisma.employeeTaskAssignment.findMany({
        where: {
            employeeId: currentEmployee.data.id
        },
        select: {
            employeeTaskAssignmentStatus: {
                select: {
                    name: true, 
                    colorHex: true
                }
            },
            employeeTask: {
                ...taskCardDetailQuery
            }
        }
    })

    return (
        <>
            <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6">
                {
                    summaryCards.map((item, index) => (
                        <SummaryCard
                            key={index}
                            label={item.label}
                            value={item.value} />
                    ))
                }
            </div>
            <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6 mt-4">
                {
                    taskAssignments.length > 0
                        ?
                        taskAssignments.map((item, index) => (
                            <TaskCardDetail
                                key={index}
                                task={item.employeeTask}
                                detailRoute={`/employee/dashboard/${item.employeeTask.slug}`}
                                taskAssignmentStatus={item.employeeTaskAssignmentStatus} />
                        ))
                        :
                        <span className="text-muted-foreground col-span-3">
                            Belum ada pekerjaan yang ditugaskan saat ini.
                        </span>
                }
            </div>
        </>
    )
}

