import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDateOnly } from "@/utils/date";
import {
    CalendarIcon,
    CircleDashedIcon,
    Clock3Icon,
    FileTextIcon,
} from "lucide-react";

export default function TaskReportSubmissionFormPending({
    selectedDateString,
}: {
    selectedDateString: string;
}) {
    return (
        <Card className="h-fit">
            <CardHeader className="border-b flex flex-row justify-between items-center gap-6">
                <CardTitle>
                    Laporan Harian: {formatDateOnly(selectedDateString)}
                </CardTitle>

                <div className="flex flex-col items-end gap-2">
                    <span className="text-xs uppercase font-medium text-muted-foreground">
                        Status Laporan
                    </span>

                    <Badge variant="secondary">
                        Belum Dimulai
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="py-10">
                <div className="flex flex-col items-center text-center">
                    <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 mb-6">
                        <FileTextIcon className="size-10 text-primary" />
                    </div>

                    <h3 className="text-xl font-semibold">
                        Laporan Belum Dimulai
                    </h3>

                    <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
                        Anda belum bisa mulai mengisi laporan harian untuk{" "}
                        <span className="font-medium text-foreground">
                            {formatDateOnly(selectedDateString)}
                        </span>.
                        Siapkan seluruh dokumen yang diperlukan sebelum mengirim laporan.
                    </p>
                </div>

                <Separator className="my-8" />

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex gap-3 rounded-lg border p-4">
                        <CalendarIcon className="mt-0.5 size-5 text-primary" />

                        <div>
                            <p className="font-medium">Tanggal Laporan</p>
                            <p className="text-sm text-muted-foreground">
                                {formatDateOnly(selectedDateString)}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 rounded-lg border p-4">
                        <Clock3Icon className="mt-0.5 size-5 text-primary" />

                        <div>
                            <p className="font-medium">Status</p>
                            <p className="text-sm text-muted-foreground">
                                Menunggu laporan pertama dibuat.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                    <p className="text-sm">
                        <span className="font-medium">
                            Sebelum mengumpulkan laporan:
                        </span>
                    </p>

                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                        <li>Lengkapi seluruh dokumen wajib.</li>
                        <li>Pastikan file yang diunggah sudah benar.</li>
                        <li>Tambahkan catatan apabila diperlukan.</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}