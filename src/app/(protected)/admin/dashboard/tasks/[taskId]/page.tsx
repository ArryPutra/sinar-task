import BackButton from '@/components/shared/back-button';
import SummaryCard from '@/components/shared/summary-card';
import { prisma } from '@/lib/prisma';

export default async function AdminTaskDetailPage({
  params
}: {
  params: { taskId: string }
}) {

  const { taskId } = await params;

  const taskResponse = await prisma.employeeTask.findUnique({ where: { id: taskId } });

  const summaryCards = [
    {
      label: "Total Permintaan Peninjauan",
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

  return (
    <>
      <BackButton href='/admin/dashboard' />
      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 ">
        {
          summaryCards.map((card, index) => (
            <SummaryCard key={index} label={card.label} value={card.value} />
          ))
        }
      </div>
    </>
  )
}
