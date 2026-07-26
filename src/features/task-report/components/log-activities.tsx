"use client";

import { DateTimeText } from "@/components/shared/date-time-text";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardClockIcon, InfoIcon } from "lucide-react";

export default function LogActivities({
    employeeTaskReportStatusActivities
}: {
    employeeTaskReportStatusActivities: any[]
}) {

    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle>
                    <ClipboardClockIcon className="inline size-5 mr-2.5 text-muted-foreground" />
                    <span>Log Status Aktivitas</span>
                </CardTitle>
                <CardDescription>Riwayat perubahan status aktivitas laporan ini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {
                    employeeTaskReportStatusActivities.length > 0 ?
                        employeeTaskReportStatusActivities.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex flex-col space-y-1">
                                    <Badge variant="outline" style={{ backgroundColor: activity.employeeTaskReportStatus.colorHex, color: "white" }}>
                                        {activity.employeeTaskReportStatus.name}
                                    </Badge>
                                    <span>Oleh: <strong>{activity.user.name}</strong></span>
                                    <span className="text-xs text-muted-foreground">
                                        Catatan: {activity.note || "Tidak ada catatan"}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end shrink-0 pl-3">
                                    <DateTimeText
                                        date={activity.createdAt}
                                        type="timeSeconds"
                                        className="text-muted-foreground" />
                                </div>
                            </div>
                        ))
                        :
                        <span className="text-muted-foreground">Belum ada aktivitas</span>
                }
            </CardContent>
            <CardFooter className="border-t text-muted-foreground">
                <InfoIcon className="inline size-4 mr-2.5" />
                <span>Total 6 Perubahan status</span>
            </CardFooter>
        </Card>
    )
}
