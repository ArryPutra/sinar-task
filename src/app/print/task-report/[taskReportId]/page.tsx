import { getCurrentEmployee } from "@/features/employee/action";
import TaskReportPdf from "@/features/task-report/pdf/task-report";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function TaskReportPrint({
    params
}: {
    params: Promise<{
        taskReportId: string
    }>
}) {
    const { taskReportId } = await params;

    const taskReportData = await prisma.employeeTaskReport.findUnique({
        where: {
            id: Number(taskReportId)
        },
        select: {
            id: true,
            employeeTaskReportStatusId: true,
            updatedAt: true,
            employeeTaskAssignment: {
                select: {
                    employeeId: true,
                    employee: {
                        select: {
                            user: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    employeeTask: {
                        select: {
                            title: true,
                            locationName: true,
                            admin: {
                                select: {
                                    user: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const task = taskReportData?.employeeTaskAssignment.employeeTask;
    const employee = taskReportData?.employeeTaskAssignment.employee;
    if (!taskReportData || !task || !employee) return notFound();

    const taskDocuments = await prisma.employeeTaskDocumentCategory.findMany({
        select: {
            name: true,
            employeeTaskDocument: {
                where: {
                    employeeTaskReportId: taskReportData.id,
                },
                select: {
                    fileUrls: true
                }
            }
        }
    });

    const currentEmployee = await getCurrentEmployee();
    if (currentEmployee.data?.id) {
        // jika laporan bukan milik employee maka tidak bisa diakses
        if (currentEmployee.data?.id !== taskReportData.employeeTaskAssignment.employeeId) return notFound();
    }
console.log(taskDocuments)
    return (
        <TaskReportPdf
            judulPekerjaan={task.title}
            waktuLaporan={taskReportData.updatedAt}
            lokasiPekerjaan={task.locationName}
            namaPelapor={employee.user.name ?? "-"}
            picPekerjaan={taskReportData.employeeTaskAssignment.employeeTask.admin.user.name ?? "-"}
            taskReportStatusId={taskReportData.employeeTaskReportStatusId}
            daftarDokumen={taskDocuments} />
    )
}
