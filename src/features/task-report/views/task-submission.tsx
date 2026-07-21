import LeafletMap from "@/components/shared/leaflet-map/leaflet-map";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeProfileCard from "@/features/employee/components/employee-profile-card";
import ChooseReportStatus from "@/features/task-report/components/choose-report-status";
import DateReport from "@/features/task-report/components/date";
import TaskReportSubmissionFormAvailable from "@/features/task-report/components/submission/submission-form-available";
import { TaskReportSubmissionFormData, taskReportSubmissionFormQuery } from "@/features/task-report/queris";
import TaskCardDetail from "@/features/task/components/card-detail";
import { taskCardDetailQuery } from "@/features/task/queris";
import { APP_BUSINESS_TIMEZONE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { formatDateTimeBusinessTz } from "@/utils/date";
import { eachDayOfInterval, format, isAfter, isBefore, isSameDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { id } from "date-fns/locale";
import { CalendarIcon, MessageSquareWarningIcon } from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { userAgent } from "next/server";
import TaskReportSubmissionFormClosed from "../components/submission/submission-form-closed";
import TaskReportSubmissionDone from "../components/submission/submission-form-done";
import TaskReportSubmissionFormPending from "../components/submission/submission-form-pending";
import TaskReportSubmissionRejected from "../components/submission/submission-form-rejected";
import { Alert } from "@/components/ui/alert";

export default async function TaskSubmissionView({
  date,
  taskAssignmentId,
  isAdmin
}: {
  date: string | null,
  taskAssignmentId: string
  isAdmin: boolean
}) {

  // sesuaikan dengan zona waktu bisnis (wita) siapapun usernya
  const todayString = formatInTimeZone(
    new Date(), // ini awalnya utc (sesuai server)
    APP_BUSINESS_TIMEZONE, "yyyy-MM-dd");// lalu diubah ke asia/makassar
  const selectedDateString = date ?? todayString;

  // penting agar task assignment ini milik employee yang sedang login
  const taskAssignmentResponse = await prisma.employeeTaskAssignment.findUnique({
    where: {
      id: taskAssignmentId,
      employeeTaskAssignmentStatusId: {
        not: 2
      }
    },
    select: {
      id: true,
      employeeTaskAssignmentStatusId: true,
      employeeTaskAssignmentStatus: {
        select: {
          name: true,
          colorHex: true
        }
      },
      employeeTask: {
        select: {
          ...taskCardDetailQuery.select,
          latitude: true,
          longitude: true
        }
      }
    }
  });
  if (!taskAssignmentResponse) return notFound();

  const task = taskAssignmentResponse.employeeTask;

  const taskReportsResponse = await prisma.employeeTaskReport.findMany({
    where: {
      employeeTaskAssignmentId: taskAssignmentResponse.id,
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
      // taskReport bisa null maka jika tidak ditemukan tidak perlu documents
      ...(taskReportSelected && {
        employeeTaskDocument: {
          where: {
            employeeTaskReportId: taskReportSelected?.id,
          },
          select: {
            id: true,
            fileUrls: true
          },
        },
      })
    }
  });

  const dates = eachDayOfInterval({
    start: formatDateTimeBusinessTz(task.startAt),
    end: formatDateTimeBusinessTz(task.dueAt),
  });

  const { device } = userAgent({ headers: await headers() });

  return (
    <>
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
                  status: report?.employeeTaskReportStatus.name ?? "Belum Dikerjakan",
                  icon: report?.employeeTaskReportStatus?.icon ?? "CircleDashed",
                  colorHex: report?.employeeTaskReportStatus?.colorHex ?? "black",
                }} />
            )
          })
        }
      </div>

      {
        taskReportSelected &&
        <Alert className="rounded-lg border bg-muted/40 p-4 w-fit">
          <div className="flex items-center gap-2">
            <MessageSquareWarningIcon className="size-4 text-muted-foreground" />
            <h4 className="text-sm font-medium">Catatan dari {taskReportSelected.admin?.user.name} (Admin)</h4>
          </div>

          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
            {taskReportSelected.noteByAdmin || "Tidak ada catatan dari admin."}
          </p>
        </Alert>
      }

      {
        device.type === "mobile" ?
          <Tabs defaultValue="laporan" className="">
            <TabsList className="mb-6">
              <TabsTrigger value="laporan">Laporan</TabsTrigger>
              <TabsTrigger value="detail">Detail Pekerjaan</TabsTrigger>
            </TabsList>
            <TabsContent value="laporan">
              <LeftSection
                isAdmin={isAdmin}
                taskAssignmentResponse={taskAssignmentResponse}
                taskDocumentCategoriesResponse={taskDocumentCategoriesResponse}
                taskReportSelected={taskReportSelected}
                selectedDateString={selectedDateString}
                todayString={todayString}
                adminData={{
                  selectedTaskReport: taskReportSelected ? {
                    id: taskReportSelected.id,
                    employeeTaskReportStatusId: taskReportSelected.employeeTaskReportStatus.id,
                    noteByAdmin: taskReportSelected.noteByAdmin
                  } : null
                }} />
            </TabsContent>
            <TabsContent value="detail">
              <RightSection
                taskAssignmentResponse={taskAssignmentResponse}
                task={task} />
            </TabsContent>
          </Tabs>
          :
          <>
            <div className="grid grid-cols-[2fr_1fr] gap-6 max-xl:grid-cols-2 max-lg:flex max-lg:flex-col-reverse">
              <LeftSection
                isAdmin={isAdmin}
                taskAssignmentResponse={taskAssignmentResponse}
                taskDocumentCategoriesResponse={taskDocumentCategoriesResponse}
                taskReportSelected={taskReportSelected}
                selectedDateString={selectedDateString}
                todayString={todayString}
                adminData={{
                  selectedTaskReport: taskReportSelected ? {
                    id: taskReportSelected.id,
                    employeeTaskReportStatusId: taskReportSelected.employeeTaskReportStatus.id,
                    noteByAdmin: taskReportSelected.noteByAdmin
                  } : null
                }} />
              <RightSection
                taskAssignmentResponse={taskAssignmentResponse}
                task={task} />
            </div>
          </>
      }
    </>
  )
}

async function LeftSection({
  todayString,
  selectedDateString,
  taskAssignmentResponse,
  taskDocumentCategoriesResponse,
  taskReportSelected,
  isAdmin,
  adminData,
}: {
  todayString: string;
  selectedDateString: string;
  taskAssignmentResponse: any;
  taskDocumentCategoriesResponse: any;
  taskReportSelected: TaskReportSubmissionFormData | undefined;
  isAdmin: boolean,
  adminData: {
    selectedTaskReport: {
      id: number,
      employeeTaskReportStatusId: number,
      noteByAdmin: string | null
    } | null
  }
}) {

  const taskReportStatusesResponse = isAdmin
    ? await prisma.employeeTaskReportStatus.findMany()
    : [];

  const employeeResponse = isAdmin ? await prisma.employeeTaskAssignment.findUnique({
    where: {
      id: taskAssignmentResponse.id
    },
    select: {
      employee: {
        select: {
          id: true,
          user: {
            select: {
              name: true,
              image: true
            }
          },
          phoneNumber: true
        }
      }
    }
  }) : null;

  const reportStatusId = taskReportSelected?.employeeTaskReportStatus.id;

  let submission: React.ReactNode;

  if (isAdmin) {
    submission = (
      <TaskReportSubmissionFormAvailable
        selectedDateString={selectedDateString}
        taskDocumentCategories={taskDocumentCategoriesResponse}
        taskAssignmentId={taskAssignmentResponse.id}
        taskReport={taskReportSelected ?? null}
        isAdmin
      />
    );
  } else if (isAfter(selectedDateString, todayString)) {
    submission = (
      <TaskReportSubmissionFormPending
        selectedDateString={selectedDateString}
      />
    );
  } else if (isBefore(selectedDateString, todayString)) {
    submission = (
      <TaskReportSubmissionFormClosed
        selectedDateString={selectedDateString}
      />
    );
  } else {
    switch (reportStatusId) {
      case 4:
        submission = <TaskReportSubmissionDone />;
        break;

      case 5:
        submission = <TaskReportSubmissionRejected />;
        break;

      default:
        submission = (
          <TaskReportSubmissionFormAvailable
            selectedDateString={selectedDateString}
            taskDocumentCategories={taskDocumentCategoriesResponse}
            taskAssignmentId={taskAssignmentResponse.id}
            taskReport={taskReportSelected ?? null}
            isAdmin={false}
          />
        );
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {isAdmin && (
        <div className="grid grid-cols-2 gap-6 max-xl:grid-cols-1">
          <ChooseReportStatus
            taskReportStatuses={taskReportStatusesResponse}
            selectedTaskReport={adminData.selectedTaskReport}
          />

          <EmployeeProfileCard
            employee={
              employeeResponse
                ? {
                  id: employeeResponse.employee.id,
                  name: employeeResponse.employee.user.name ?? "Tidak ada nama",
                  phoneNumber: employeeResponse.employee.phoneNumber,
                }
                : null
            }
          />
        </div>
      )}

      {submission}
    </div>
  );
}

function RightSection({
  taskAssignmentResponse,
  task,
}: {
  taskAssignmentResponse: any
  task: any
}) {
  return (
    <div className="flex flex-col gap-6">
      <TaskCardDetail
        task={taskAssignmentResponse.employeeTask}
        taskAssignmentStatus={taskAssignmentResponse.employeeTaskAssignmentStatus} />
      <Card>
        <CardHeader>
          <CardTitle className="mb-3">Lokasi Pekerjaan</CardTitle>
          <LeafletMap
            latitude={task.latitude}
            longitude={task.longitude} />
          <div className="flex flex-col mt-2">
            <span>Alamat: </span>
            <span className="font-medium">{task.locationName}</span>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}