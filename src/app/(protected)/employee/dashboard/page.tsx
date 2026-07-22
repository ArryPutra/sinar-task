import SummaryCard from "@/components/shared/summary-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getCurrentEmployee } from "@/features/employee/action";
import TaskCardDetail from "@/features/task/components/card-detail";
import { taskCardDetailQuery } from "@/features/task/queris";
import { prisma } from "@/lib/prisma";
import { formatDateTimeWitaString, toDatabaseDateTime, todayDateBusinessTz } from "@/utils/date";
import { AlertCircleIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EmployeeDashboardPage() {
    const currentEmployee = (await getCurrentEmployee());

    if (!currentEmployee.data) return notFound();

    const summaryCards = [
        {
            label: "Total Pekerjaan Aktif",
            value: await prisma.employeeTaskAssignment.count({
                where: {
                    employeeId: currentEmployee.data.id,
                    employeeTaskAssignmentStatusId: {
                        notIn: [2, 3]
                    },
                    employeeTask: {
                        employeeTaskStatusId: {
                            not: 3 // ditutup
                        }
                    }
                }
            })
        },
    ]

    const taskAssignments = await prisma.employeeTaskAssignment.findMany({
        where: {
            employeeId: currentEmployee.data.id,
            employeeTaskAssignmentStatusId: 1,
            employeeTask: {
                employeeTaskStatusId: {
                    not: 3 // ditutup
                }
            }
        },
        select: {
            id: true,
            employeeTaskAssignmentStatus: {
                select: {
                    name: true,
                    colorHex: true
                }
            },
            employeeTask: {
                ...taskCardDetailQuery
            }
        },
        orderBy: {
            employeeTask: {
                dueAt: "asc" // Urutkan berdasarkan deadline paling dekat
            }
        }
    });

    const todayDateTime = toDatabaseDateTime(todayDateBusinessTz());

    const reportNotifications = await prisma.employeeTaskReport.findMany({
        where: {
            employeeTaskAssignment: {
                employeeId: currentEmployee.data.id,
            },
            reportDate: {
                equals: todayDateTime // cari laporan hari ini
            },
            employeeTaskReportStatusId: {
                in: [3, 4, 5] // revisi, disetujui, ditolak
            },
        },
        select: {
            employeeTaskAssignment: {
                select: {
                    id: true,
                    employeeTask: {
                        select: {
                            title: true
                        }
                    }
                }
            },
            reportDate: true,
            employeeTaskReportStatusId: true
        }
    });
    console.log(reportNotifications)

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
            {
                reportNotifications.map((report, index) => {
                    switch (report.employeeTaskReportStatusId) {
                        case 3:
                            return (
                                <Alert key={index} className="bg-yellow-500/5 text-yellow-500 border-yellow-500/25 flex">
                                    <AlertCircleIcon className="shrink-0" />
                                    <div className="flex flex-col">
                                        <AlertTitle>Informasi Laporan Revisi</AlertTitle>
                                        <AlertDescription>Laporan pada tanggal {formatDateTimeWitaString(report.reportDate, false)}. Pekerjaan {report.employeeTaskAssignment.employeeTask.title} Anda direvisi, segera lakukan perbaikan.</AlertDescription>
                                        <Link href={`/employee/task-assignment/${report.employeeTaskAssignment.id}`}>
                                            <Button
                                                className="w-fit mt-2"
                                                size="sm"
                                                variant="secondary">
                                                <span>Lihat Laporan</span><ArrowRightIcon />
                                            </Button>
                                        </Link>
                                    </div>
                                </Alert>)
                            break;
                        case 4:
                            return (
                                <Alert key={index} className="bg-green-500/5 text-green-500 border-green-500/25 flex">
                                    <AlertCircleIcon className="shrink-0" />
                                    <div className="flex flex-col">
                                        <AlertTitle>Informasi Laporan Disetujui</AlertTitle>
                                        <AlertDescription>Laporan pada tanggal {formatDateTimeWitaString(report.reportDate, false)}. Pekerjaan {report.employeeTaskAssignment.employeeTask.title} Anda telah disetujui.</AlertDescription>
                                        <Link href={`/employee/task-assignment/${report.employeeTaskAssignment.id}`}>
                                            <Button
                                                className="w-fit mt-2"
                                                size="sm"
                                                variant="secondary">
                                                <span>Lihat Laporan</span><ArrowRightIcon />
                                            </Button>
                                        </Link>
                                    </div>
                                </Alert>)
                            break;
                        case 5:
                            return (
                                <Alert key={index} className="bg-red-500/5 text-red-500 border-red-500/25 flex">
                                    <AlertCircleIcon className="shrink-0" />
                                    <div className="flex flex-col">
                                        <AlertTitle>Informasi Laporan Ditolak</AlertTitle>
                                        <AlertDescription>Laporan pada tanggal {formatDateTimeWitaString(report.reportDate, false)}. Pekerjaan {report.employeeTaskAssignment.employeeTask.title} Anda ditolak, Anda tidak dapat mengerjakan ulang.</AlertDescription>
                                        <Link href={`/employee/task-assignment/${report.employeeTaskAssignment.id}`}>
                                            <Button
                                                className="w-fit mt-2"
                                                size="sm"
                                                variant="secondary">
                                                <span>Lihat Laporan</span><ArrowRightIcon />
                                            </Button>
                                        </Link>
                                    </div>
                                </Alert>)
                            break;
                        default:
                            return null;
                    }
                })
            }
            <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6">
                {
                    taskAssignments.length > 0
                        ?
                        taskAssignments.map((item, index) => (
                            <TaskCardDetail
                                key={index}
                                task={item.employeeTask}
                                detailRoute={`/employee/task-assignment/${item.id}`}
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

