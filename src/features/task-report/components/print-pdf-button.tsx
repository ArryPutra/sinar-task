"use client";

import { Button } from "@/components/ui/button";
import { ClipboardCheckIcon, ClipboardXIcon } from "lucide-react";
import Link from "next/link";

export default function PrintPdfButton({
    taskReportId
}: {
    taskReportId: number | null
}) {
    if (taskReportId) {
        return (
            <Link
                href={`/print/task-report/${taskReportId}`}
                target="_blank">
                <Button variant="outline"
                    size="sm"
                    className='cursor-pointer mt-4'
                    disabled={!taskReportId}>
                    <ClipboardCheckIcon className='w-4 h-4 text-green-500' /> Unduh Laporan
                </Button>
            </Link>
        )
    } else {
        return (
            <Button variant="outline"
                size="sm"
                className='cursor-pointer mt-4'
                disabled={!taskReportId}>
                <ClipboardXIcon className='w-4 h-4 text-red-500' /> Laporan Belum Dibuat
            </Button>
        )
    }
}
