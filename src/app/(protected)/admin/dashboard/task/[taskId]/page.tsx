import BackButton from '@/components/shared/back-button';
import SummaryCard from '@/components/shared/summary-card';
import EmployeeReportsTable from '@/features/task-report/components/employee-reports-table';
import { employeeTaskReportListQuery } from '@/features/task-report/queris';
import { prisma } from '@/lib/prisma';
import { BriefcaseBusinessIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function AdminTaskDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ taskId: string }>
  searchParams: Promise<{ employeeTaskReportStatusId: string }>
}) {

  const { taskId } = await params;
  const { employeeTaskReportStatusId } = await searchParams;

  const taskResponse = await prisma.employeeTask.findUnique({ where: { id: taskId } });
  if (!taskResponse) return notFound();

  const summaryCards = [
    {
      label: "Laporan Permintaan Peninjauan",
      value: await prisma.employeeTaskReport.count({
        where: {
          employeeTaskAssignment: {
            employeeTaskId: taskId
          },
          employeeTaskReportStatusId: 2
        }
      })
    }
  ];

  const reportsResponse = await prisma.employeeTaskReport.findMany({
    where: {
      employeeTaskReportStatusId: employeeTaskReportStatusId ? Number(employeeTaskReportStatusId) : undefined,
      employeeTaskAssignment: {
        employeeTask: {
          id: taskId
        }
      }
    },
    orderBy: {
      employeeTaskReportStatusId: "asc"
    },
    ...employeeTaskReportListQuery
  });

  const reportStatusesResponse = await prisma.employeeTaskReportStatus.findMany({
    select: {
      id: true,
      name: true,
    }
  });

  return (
    <>
      <BackButton href='/admin/dashboard' />
      <h1 className="text-lg font-bold flex items-center gap-3">
        <BriefcaseBusinessIcon className='size-5' /> <span>{taskResponse.title}</span>
      </h1>
      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 ">
        {
          summaryCards.map((card, index) => (
            <SummaryCard key={index} label={card.label} value={card.value} />
          ))
        }
      </div>

      <EmployeeReportsTable
        reports={reportsResponse}
        reportStatuses={reportStatusesResponse} />
    </>
  )
}
