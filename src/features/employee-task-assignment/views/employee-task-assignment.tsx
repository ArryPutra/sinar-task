import LeafletMap from "@/components/shared/leaflet-map/leaflet-map";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DateReport from "@/features/employee-task-report/components/date";
import TaskReportSubmissionFormAvailable from "@/features/employee-task-report/components/submission/submission-form-available";
import TaskReportSubmissionFormClosed from "@/features/employee-task-report/components/submission/submission-form-closed";
import TaskReportSubmissionFormPending from "@/features/employee-task-report/components/submission/submission-form-pending";
import { taskReportSubmissionFormQuery } from "@/features/employee-task-report/queris";
import TaskCardDetail from "@/features/employee-task/components/card-detail";
import { taskCardDetailQuery } from "@/features/employee-task/queris";
import { APP_BUSINESS_TIMEZONE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { formatDateTimeBusinessTz } from "@/utils/date";
import { eachDayOfInterval, format, isBefore, isSameDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { userAgent } from "next/server";
import ChooseReportStatus from "../../employee-task-report/components/choose-report-status";

export default async function EmployeeTaskAssignmentView({
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
                  status: report?.employeeTaskReportStatus.name ?? "Belum Dimulai",
                  icon: report?.employeeTaskReportStatus?.icon ?? "CircleDashed",
                  colorHex: report?.employeeTaskReportStatus?.colorHex ?? "black",
                }} />
            )
          })
        }
      </div>
      {
        device.type === "mobile" ?
          <Tabs defaultValue="laporan" className="">
            <TabsList className="mb-6">
              <TabsTrigger value="laporan">Laporan</TabsTrigger>
              <TabsTrigger value="detail">Detail</TabsTrigger>
            </TabsList>
            <TabsContent value="laporan">
              <LeftSection
                isAdmin={isAdmin}
                taskAssignmentResponse={taskAssignmentResponse}
                taskDocumentCategoriesResponse={taskDocumentCategoriesResponse}
                taskReportSelected={taskReportSelected}
                selectedDateString={selectedDateString}
                todayString={todayString} />
            </TabsContent>
            <TabsContent value="detail">
              <RightSection
                taskAssignmentResponse={taskAssignmentResponse}
                task={task}
                adminData={{
                  selectedTaskReport: taskReportSelected && {
                    id: taskReportSelected.id,
                    employeeTaskReportStatusId: taskReportSelected.employeeTaskReportStatus.id,
                    noteByAdmin: taskReportSelected.noteByAdmin
                  }
                }}
                isAdmin={isAdmin} />
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
                todayString={todayString} />
              <RightSection
                taskAssignmentResponse={taskAssignmentResponse}
                task={task}
                adminData={{
                  selectedTaskReport: taskReportSelected && {
                    id: taskReportSelected.id,
                    employeeTaskReportStatusId: taskReportSelected.employeeTaskReportStatus.id,
                    noteByAdmin: taskReportSelected.noteByAdmin
                  }
                }}
                isAdmin={isAdmin} />
            </div>
          </>
      }
    </>
  )
}

function LeftSection({
  todayString,
  selectedDateString,
  taskAssignmentResponse,
  taskDocumentCategoriesResponse,
  taskReportSelected,
  isAdmin
}: {
  todayString: string;
  selectedDateString: string;
  taskAssignmentResponse: any;
  taskDocumentCategoriesResponse: any;
  taskReportSelected: any;
  isAdmin: boolean
}) {
  return (
    <div className="flex flex-col gap-6">
      {
        // pastikan tanggal laporan tidak melebihi tanggal sekarang
        isSameDay(selectedDateString, todayString) ?
          <TaskReportSubmissionFormAvailable
            selectedDateString={selectedDateString}
            taskDocumentCategories={taskDocumentCategoriesResponse}
            taskAssignmentId={taskAssignmentResponse.id}
            taskReport={taskReportSelected ?? null}
            isAdmin={isAdmin} />
          :
          isBefore(selectedDateString, todayString)
            ?
            isAdmin ?
              // pastikan admin dapat melihat laporan kemarin
              <TaskReportSubmissionFormAvailable
                selectedDateString={selectedDateString}
                taskDocumentCategories={taskDocumentCategoriesResponse}
                taskAssignmentId={taskAssignmentResponse.id}
                taskReport={taskReportSelected ?? null}
                isAdmin={isAdmin} />
              : <TaskReportSubmissionFormClosed
                selectedDateString={selectedDateString} />
            :
            <TaskReportSubmissionFormPending
              selectedDateString={selectedDateString} />
      }
    </div>
  )
}

async function RightSection({
  taskAssignmentResponse,
  task,
  adminData,
  isAdmin
}: {
  taskAssignmentResponse: any
  task: any
  adminData: {
    selectedTaskReport?: {
      id: number,
      employeeTaskReportStatusId: number,
      noteByAdmin: string | null
    } | null
  }
  isAdmin: boolean
}) {

  const taskReportStatusesResponse = isAdmin
    ? await prisma.employeeTaskReportStatus.findMany()
    : [];

  return (
    <div className="flex flex-col gap-6">
      {
        ((isAdmin && adminData.selectedTaskReport)
          &&
          adminData.selectedTaskReport.employeeTaskReportStatusId !== 1)
        &&
        <ChooseReportStatus
          key={adminData.selectedTaskReport.id}
          taskReportStatuses={taskReportStatusesResponse}
          selectedTaskReport={adminData.selectedTaskReport} />
      }
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