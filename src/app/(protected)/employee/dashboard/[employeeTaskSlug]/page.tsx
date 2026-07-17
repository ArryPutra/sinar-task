import BackButton from '@/components/shared/back-button';
import EmployeeTaskReportDates from '@/features/employee-task-report/components/list-date';
import EmployeeTaskReportSubmission from '@/features/employee-task-report/components/submission';
import { getEmployeeTaskByIdAction } from '@/features/employee-task/actions';
import TaskCardPreview from '@/features/employee-task/components/task-detail-card';
import { getCurrentEmployee } from '@/features/employee/action';
import { prisma } from '@/lib/prisma';
import { today } from '@/utils/date';
import { parseISO } from 'date-fns';
import { notFound } from 'next/navigation';

export default async function EmployeeTaskDashboardPage({
  params,
  searchParams
}: {
  params: Promise<{ employeeTaskSlug: string }>
  searchParams: Promise<{ date?: string }>
}) {

  const { employeeTaskSlug } = await params
  const { date } = await searchParams

  const currentEmployee = await getCurrentEmployee();
  if (!currentEmployee.data) {
    console.error(currentEmployee);
    return notFound();
  }

  const getTaskIdBySlug = await prisma.employeeTask.findUnique({
    where: { slug: employeeTaskSlug },
    select: { id: true }
  });
  const taskResponse = (await getEmployeeTaskByIdAction(getTaskIdBySlug?.id!)).data;
  if (!taskResponse) {
    console.error(taskResponse);
    return notFound();
  }

  const taskAssignmentResponse = await prisma.employeeTaskAssignment.findUnique({
    where: {
      employeeTaskId_employeeId: {
        employeeTaskId: taskResponse.id,
        employeeId: currentEmployee.data.id
      }
    }
  });
  if (!taskAssignmentResponse) {
    console.error(taskAssignmentResponse);
    return notFound();
  }

  const taskReportResponse = await prisma.employeeTaskReport.findUnique({
    where: {
      employeeTaskAssignmentId_reportDate: {
        employeeTaskAssignmentId: taskAssignmentResponse.id,
        reportDate: date ? parseISO(date) : parseISO(today())
      }
    },
    select: {
      id: true,
      note: true,
    }
  });

  const taskDocumentCategoriesResponse = await prisma.employeeTaskDocumentCategory.findMany({
    select: {
      name: true,
      slug: true,
      isRequired: true,
      employeeTaskDocument: {
        where: {
          employeeTaskReportId: taskReportResponse?.id ?? -1
        },
        select: {
          fileUrls: true
        }
      }
    }
  });

  const listDateStatus = await prisma.employeeTaskReport.findMany({
    where: {
      employeeTaskAssignmentId: taskAssignmentResponse.id
    },
    select: {
      reportDate: true,
      employeeTaskReportStatus: {
        select: {
          name: true,
          colorHex: true
        }
      }
    }
  });

  console.log(listDateStatus)

  const selectedDate = date ?? today();

  return (
    <>
      <BackButton href='/employee/dashboard' />

      <EmployeeTaskReportDates
        startAt={taskResponse.startAt}
        dueAt={taskResponse.dueAt}
        selectedDate={parseISO(selectedDate)}
        listDateStatus={listDateStatus} />

      <div className='grid grid-cols-[2fr_1fr] gap-4 max-xl:grid-cols-2 max-lg:flex max-lg:flex-col-reverse'>
        <EmployeeTaskReportSubmission
          key={taskAssignmentResponse.id}
          selectedDate={selectedDate}
          taskDocumentCategories={taskDocumentCategoriesResponse}
          taskAssignmentId={taskAssignmentResponse.id}
          taskReport={taskReportResponse}
        />

        <TaskCardPreview
          task={taskResponse} />
      </div>
    </>
  )
}
