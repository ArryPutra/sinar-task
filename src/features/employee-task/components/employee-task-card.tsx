"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeTaskAssignmentByEmployeeId } from "@/features/employee-task-assignment/queris";
import { formatDateTimeString } from "@/utils/date";
import { ArrowRightIcon, CalendarIcon, ExternalLinkIcon, FileIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";

export default function EmployeeTaskAssignmentCard({
    task,
}: {
    task: EmployeeTaskAssignmentByEmployeeId
}) {
    return (
        <Card key={task.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader className="space-y-2 pb-3">
                <div className="flex justify-between items-start gap-2 flex-wrap">
                    <Badge variant={'outline'}>
                        {task.employeeTask.employeeTaskCategory.name}
                    </Badge>
                    <Badge style={{
                        backgroundColor: task.employeeTask.employeeTaskStatus.colorHex
                    }}>
                        {task.employeeTask.employeeTaskStatus.name}
                    </Badge>
                </div>
                <CardTitle className="line-clamp-2 text-lg font-semibold leading-snug">
                    {task.employeeTask.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                    {task.employeeTask.description || "Tidak ada deskripsi"}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-sm text-muted-foreground pb-4 flex-1">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 shrink-0 text-primary" />
                    {/* <span>Jatuh Tempo: {task.employeeTask.dueAt.toString()}</span> */}
                </div>

                <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 shrink-0 text-destructive" />
                    <span className="truncate">Lokasi: {task.employeeTask.locationName}</span>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 mb-2">
                        <FileIcon className="h-3.5 w-3.5" />
                        <span>Lampiran Pekerjaan ({task.employeeTask.fileUrls.length}):</span>
                    </div>
                    {task.employeeTask.fileUrls && task.employeeTask.fileUrls.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {task.employeeTask.fileUrls.map((url, idx) => {
                                const fileName = url.split('/').pop() || `File ${idx + 1}`;

                                return (
                                    <a
                                        key={idx}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-950/70 border border-sky-200 dark:border-sky-900 px-2 py-0.5 rounded transition-colors max-w-37.5"
                                        title={fileName}
                                    >
                                        <span className="truncate">{fileName}</span>
                                        <ExternalLinkIcon className="h-2.5 w-2.5 shrink-0 opacity-70" />
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="border-t pt-3 flex flex-wrap justify-between items-center bg-muted/10 rounded-b-xl gap-4">
                <Link href={`/employee/dashboard/${task.employeeTask.slug}`}>
                    <Button variant="outline" size="sm">
                        Lihat Detail <ArrowRightIcon />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}