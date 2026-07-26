import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateOnly } from "@/utils/date";
import { LockIcon } from "lucide-react";
import PrintPdfButton from "../print-pdf-button";

export default function TaskReportSubmissionFormClosed({
  selectedDateString,
  taskReportId
}: {
  selectedDateString: string;
  taskReportId: number | null
}) {

  return (
    <Card className="h-fit">
      <CardHeader className="border-b flex justify-between flex-wrap items-center gap-6">
        <div>
          <CardTitle>
            Laporan Harian: {formatDateOnly(selectedDateString)}
          </CardTitle>
        </div>

        <div className="flex flex-col gap-2 items-end max-lg:items-start">
          <span className="uppercase text-xs font-medium text-muted-foreground">
            Status Laporan Anda
          </span>

          <Badge variant="secondary">
            Ditutup
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center py-14 text-center">
        <div className="flex items-center justify-center rounded-full bg-muted size-20 mb-6">
          <LockIcon className="size-10 text-muted-foreground" />
        </div>

        <h3 className="text-xl font-semibold">
          Laporan Sudah Ditutup
        </h3>

        <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
          Periode pengisian laporan untuk tanggal{" "}
          <span className="font-medium text-foreground">
            {formatDateOnly(selectedDateString)}
          </span>{" "}
          telah berakhir sehingga laporan tidak dapat dibuat maupun diperbarui.
        </p>

        <div className="mt-8 rounded-lg border bg-muted/40 px-5 py-4 max-w-lg">
          <p className="text-sm text-muted-foreground">
            Jika Anda merasa masih perlu melakukan perubahan pada laporan ini,
            silakan hubungi administrator atau penanggung jawab pekerjaan untuk
            mendapatkan bantuan.
          </p>
        </div>

        <PrintPdfButton
          taskReportId={taskReportId} />
      </CardContent>
    </Card>
  );
}