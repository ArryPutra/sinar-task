"use client"

import { DateTimeText } from '@/components/shared/date-time-text'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRightIcon, CalendarDaysIcon, ClockIcon, ExternalLinkIcon, FileIcon, MapPinIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { TaskReportSubmissionFormAvailable } from '../queris'

export default function TaskCardDetail({
    task,
    detailRoute,
    taskAssignmentStatus
}: {
    task: TaskReportSubmissionFormAvailable
    detailRoute?: string
    taskAssignmentStatus?: {
        name: string
        colorHex: string
    }
}) {
    return (
        <Card className={`${!detailRoute && "h-fit"}`}>
            <CardHeader>
                <div className='mb-2 flex justify-between flex-wrap-reverse gap-4'>
                    <Badge variant='outline'>
                        {task.employeeTaskCategory.name}
                    </Badge>
                    <Badge style={{ backgroundColor: task.employeeTaskStatus.colorHex }}>
                        {task.employeeTaskStatus.name}
                    </Badge>
                </div>
                <CardTitle className="line-clamp-2 text-lg font-semibold leading-snug">
                    {task.title}
                </CardTitle>
                <CardDescription className={`${detailRoute && "line-clamp-2"}`}>
                    {task.description || "Tidak ada deskripsi"}
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
                <div className='flex items-center'>
                    <CalendarDaysIcon className='size-4 mr-2' />
                    <span>Tanggal Mulai: <DateTimeText date={task.startAt} /></span>
                </div>
                <div className='flex items-center'>
                    <ClockIcon className='size-4 mr-2' />
                    <span>Jatuh Tempo: <DateTimeText date={task.startAt} /></span>
                </div>
                <div className='flex items-center'>
                    <MapPinIcon className='size-4 mr-2' />
                    <span>Lokasi: <strong>{task.locationName}</strong></span>
                </div>
                <div className='flex items-center'>
                    <UserIcon className='size-4 mr-2' />
                    <span>Penanggung Jawab: <strong>{task.admin.user.name}</strong></span>
                </div>
                <div className='flex flex-col gap-3 mt-4'>
                    <div className='flex items-center'>
                        <FileIcon className='size-4 mr-2' />
                        <span>Lampiran Pekerjaan ({task.fileUrls.length})</span>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        {
                            task.fileUrls.length > 0 ?
                                task.fileUrls.map((fileUrl) => {
                                    const fileName = fileUrl.split('/').pop();
                                    return (
                                        <a
                                            key={fileName}
                                            href={fileUrl}
                                            target='_blank'>
                                            <div className='bg-sky-500/10 rounded p-1 flex items-center gap-2 font-medium border-sky-500/25 border text-sky-500 w-fit duration-150 hover:bg-sky-500/25'>
                                                <span className='text-xs'>{fileName}</span>
                                                <ExternalLinkIcon className='size-3' />
                                            </div>
                                        </a>
                                    )
                                })
                                :
                                <span className='text-sm italic text-muted-foreground'>
                                    Tidak ada lampiran
                                </span>
                        }
                    </div>
                </div>
            </CardContent>
            <CardFooter className='border-t flex justify-between'>
                <div className='flex flex-col gap-2'>
                    <span className='uppercase text-xs font-medium text-muted-foreground'>
                        Status Kerja Anda
                    </span>
                    <Badge style={{ backgroundColor: taskAssignmentStatus?.colorHex }}>
                        {taskAssignmentStatus?.name}
                    </Badge>
                </div>
                {
                    detailRoute &&
                    <Link href={detailRoute}>
                        <Button variant="outline" size="sm">
                            <span>Lihat Detail</span><ArrowRightIcon />
                        </Button>
                    </Link>
                }
            </CardFooter>
        </Card>
    )
}
