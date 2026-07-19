import BackButton from "@/components/shared/back-button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import DateReport from "@/features/employee-task-report/components/date";
import TaskReportSubmissionForm from "@/features/employee-task-report/components/submission-form";
import TaskReportSubmissionFormNa from "@/features/employee-task-report/components/submission-form-na";
import { taskReportSubmissionFormQuery } from "@/features/employee-task-report/queris";
import TaskCardDetail from "@/features/employee-task/components/card-detail";
import { taskCardDetailQuery } from "@/features/employee-task/queris";
import { getCurrentEmployee } from "@/features/employee/action";
import { APP_BUSINESS_TIMEZONE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { formatDateTimeBusinessTz } from "@/utils/date";
import { eachDayOfInterval, format, isBefore, isSameDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { notFound } from "next/navigation";

export default async function DashboardTaskAssignmentPage({
    params,
    searchParams
}: {
    params: Promise<
        { taskAssignmentId: string }
    >
    searchParams: Promise<{
        date: string
    }>
}) {
    const start = performance.now();
    const { taskAssignmentId } = await params;
    const { date } = await searchParams;

    const currentEmployeeResponse = await getCurrentEmployee();

    const selectedDateString = date ?? formatInTimeZone(new Date(), APP_BUSINESS_TIMEZONE, "yyyy-MM-dd");

    // penting agar task assignment ini milik employee yang sedang login
    const taskAssignmentResponse = await prisma.employeeTaskAssignment.findUnique({
        where: {
            id: taskAssignmentId,
            employeeId: currentEmployeeResponse.data?.id
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
        }
    });
    if (!taskAssignmentResponse) return notFound();

    const task = taskAssignmentResponse.employeeTask;

    const taskReportsResponse = await prisma.employeeTaskReport.findMany({
        where: {
            employeeTaskAssignmentId: taskAssignmentId,
            reportDate: {
                gte: task.startAt,
                lte: task.dueAt,
            }
        },
        ...taskReportSubmissionFormQuery
    });
    const taskReportSelected = taskReportsResponse.find(
        report =>
            isSameDay(
                formatDateTimeBusinessTz(report.reportDate), // dari utc ke asia/makassar
                selectedDateString // jadi waktu paling hari awal 00:00:00
            )
    );

    const taskDocumentCategoriesResponse = await prisma.employeeTaskDocumentCategory.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            isRequired: true,
            employeeTaskDocument: {
                where: {
                    employeeTaskReportId: taskReportSelected?.id
                },
                select: {
                    id: true,
                    fileUrls: true
                },
            },
        }
    });

    const dates = eachDayOfInterval({
        start: formatDateTimeBusinessTz(task.startAt),
        end: formatDateTimeBusinessTz(task.dueAt),
    });
    const end = performance.now();
    console.log(`DB_QUERY_DURATION: ${(end - start).toFixed(2)}ms`);

    return (
        <>
            <BackButton href="/employee/dashboard" />
            <h1 className="text-lg font-bold flex items-center gap-3">
                <CalendarIcon className="size-4" /> <span> Daftar Laporan Harian</span>
            </h1>
            <div className="flex flex-wrap gap-3 max-lg:flex-nowrap max-lg:overflow-x-scroll max-lg:-mx-4 max-lg:pl-4">
                {
                    dates.map((date, index) => {
                        const report = taskReportsResponse.find(report => isSameDay(formatDateTimeBusinessTz(report.reportDate), date));

                        return (
                            <DateReport
                                key={index}
                                date={{
                                    name: format(date, "yyyy-MM-dd"),
                                    dayName: format(date, "EEEE", { locale: id }),
                                    dayMonth: format(date, "d MMMM", { locale: id })
                                }}
                                isSelected={isSameDay(date, selectedDateString)}
                                report={{
                                    status: report?.employeeTaskReportStatus.name ?? "Belum Diisi",
                                    icon: report?.employeeTaskReportStatus?.icon ?? "CircleDashed",
                                }} />
                        )
                    })
                }
            </div>
            <div className="grid grid-cols-[2fr_1fr] gap-6 max-xl:grid-cols-2 max-lg:flex max-lg:flex-col-reverse">
                {
                    // pastikan tanggal laporan tidak melebihi tanggal sekarang
                    isBefore(selectedDateString, new Date()) ?
                        <TaskReportSubmissionForm
                            selectedDateString={selectedDateString}
                            taskDocumentCategories={taskDocumentCategoriesResponse}
                            taskAssignmentId={taskAssignmentResponse.id}
                            taskReport={taskReportSelected ?? null} />
                        :
                        <TaskReportSubmissionFormNa
                            selectedDateString={selectedDateString} />
                }
                <div className="flex flex-col gap-6">
                    <TaskCardDetail
                        task={taskAssignmentResponse.employeeTask}
                        taskAssignmentStatus={taskAssignmentResponse.employeeTaskAssignmentStatus} />
                    <Card>
                        <CardHeader>
                            <CardTitle>Progres</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </>
    )
}
