import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleXIcon, PencilIcon } from "lucide-react";

export default function TaskReportSubmissionRejected() {
  return (
    <Card className="h-fit">
      <CardHeader className="border-b flex justify-between flex-wrap items-center gap-6">
        <CardTitle>Laporan Harian</CardTitle>

        <div className="flex flex-col gap-2 items-end max-lg:items-start">
          <span className="uppercase text-xs font-medium text-muted-foreground">
            Status Laporan
          </span>

          <Badge variant="destructive">
            Ditolak
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center py-14 text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-destructive/10">
          <CircleXIcon className="size-10 text-destructive" />
        </div>

        <h3 className="text-xl font-semibold">
          Laporan Ditolak
        </h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Laporan Anda telah ditinjau oleh administrator namun belum memenuhi
          persyaratan.
        </p>

        <div className="mt-8 w-full max-w-lg rounded-lg border border-destructive/20 bg-destructive/5 p-5">
          <h4 className="font-medium text-destructive">
            Catatan dari Administrator
          </h4>

          <p className="mt-2 text-sm text-muted-foreground">
            Belum ada catatan.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}