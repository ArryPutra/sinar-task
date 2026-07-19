import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateOnly } from '@/utils/date';
import { ClockIcon } from 'lucide-react';

export default function TaskReportSubmissionFormNa({
    selectedDateString
}: {
    selectedDateString: string
}) {

    return (
        <Card>
            <CardHeader className='border-b flex justify-between flex-wrap items-center gap-6'>
                <div>
                    <CardTitle>Laporan Harian: {formatDateOnly(selectedDateString)}</CardTitle>
                </div>

                <div className='flex flex-col gap-2 items-end max-lg:items-start'>
                    <span className='uppercase text-xs font-medium text-muted-foreground'>
                        Status Laporan Anda
                    </span>
                    <Badge variant="destructive">
                        Belum Dimulai
                    </Badge>
                </div>
            </CardHeader>

            {/* UI ALERT UNTUK PERINGATAN */}
            <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="bg-blue-50 p-4 rounded-full dark:bg-slate-800">
                    <ClockIcon className="h-10 w-10 text-blue-500" />
                </div>

                <div className="space-y-1">
                    <h3 className="text-lg font-semibold">Laporan Belum Dimulai</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Anda belum memulai pengisian laporan untuk tanggal ini. Pastikan Anda sudah memiliki dokumen pendukung yang diperlukan.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
