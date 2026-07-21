import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheckBigIcon, DownloadIcon } from "lucide-react";

export default function TaskReportSubmissionDone() {
  return (
    <Card className="h-fit">
      <CardHeader className="border-b flex justify-between flex-wrap items-center gap-6">
        <CardTitle>Laporan Harian</CardTitle>

        <div className="flex flex-col gap-2 items-end max-lg:items-start">
          <span className="uppercase text-xs font-medium text-muted-foreground">
            Status Laporan
          </span>

          <Badge className="bg-green-600 hover:bg-green-600 text-white">
            Disetujui
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center py-14 text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
          <CircleCheckBigIcon className="size-10 text-green-600" />
        </div>

        <h3 className="text-xl font-semibold">
          Laporan Berhasil Disetujui
        </h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Laporan telah diverifikasi dan disetujui oleh administrator. Tidak ada
          tindakan lanjutan yang diperlukan dan laporan sudah tidak dapat
          diubah.
        </p>

        <div className="mt-8 w-full max-w-lg rounded-lg border bg-muted/40 p-5">
          <div className="space-y-2 text-left text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium text-green-600">Disetujui</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Perubahan</span>
              <span className="font-medium">Dikunci</span>
            </div>
          </div>
        </div>

        <Button className="mt-8" variant="outline">
          <DownloadIcon />
          Download Laporan
        </Button>
      </CardContent>
    </Card>
  );
}