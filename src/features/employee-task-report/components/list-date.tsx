"use client"

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { eachDayOfInterval, format, isSameDay } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

export default function EmployeeTaskReportDates({
  startAt,
  dueAt,
  selectedDate,
  listDateStatus
}: {
  startAt: Date;
  dueAt: Date;
  selectedDate: Date;
  listDateStatus: {
    reportDate: Date;
    employeeTaskReportStatus: {
      name: string
      colorHex: string
    }
  }[]
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dates = eachDayOfInterval({
    start: startAt,
    end: dueAt,
  });
  console.log(dates, selectedDate)

  const handleDateClick = (date: Date) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("date", formatDate(date));
    router.push(`?${params.toString()}`);
  }

  return (
    <div>
      <span className='text-sm text-muted-foreground md:hidden'>Silahkan geser ke kiri/kanan untuk melihat laporan harian.</span>
      <div className="grid grid-cols-6 max-xl:grid-cols-6 max-lg:grid-cols-4 gap-2 text-sm max-md:flex max-md:overflow-auto max-md:-mx-8 max-md:px-8 max-md:mt-4">
        {dates.map((date, index) => {
          const status = listDateStatus.find((item) =>
            isSameDay(item.reportDate, date)
          );

          return (
            <Button
              key={index}
              variant="outline"
              className={cn(
                "flex h-fit cursor-pointer flex-col items-start py-4 transition-all duration-200",
                isSameDay(date, selectedDate) ? "" : "opacity-50 bg-transparent border-none"
              )}
              onClick={() => {
                handleDateClick(date);
              }}>
              <span className="text-xs text-muted-foreground">
                {date.toLocaleDateString("id-ID", {
                  weekday: "long",
                })}
              </span>

              <span className="text-lg font-bold">
                {date.getDate()} {date.toLocaleDateString("id-ID", {
                  month: "long",
                })}
              </span>

              <Badge className='mt-2' variant="outline"
                style={{
                  backgroundColor: status?.employeeTaskReportStatus.colorHex
                }}>
                {status?.employeeTaskReportStatus.name || "Ditugaskan"}
              </Badge>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

function formatDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}