"use client"

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTimeString } from '@/utils/date';
import { CalendarDays, CalendarDaysIcon, ClockIcon, ExternalLinkIcon, FileIcon, MapPinIcon, UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmployeeTaskById } from '../queris';

export default function TaskCardDetail({
  task
}: {
  task: EmployeeTaskById
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Card className='h-fit'>
      <CardHeader>
        <div className='mb-2 flex justify-between flex-wrap-reverse gap-4'>
          <Badge variant='outline'>
            {task.employeeTaskCategory.name}
          </Badge>
          <Badge style={{ backgroundColor: task.employeeTaskStatus.colorHex }}>
            {task.employeeTaskStatus.name}
          </Badge>
        </div>
        <CardTitle>{task.title}</CardTitle>
        <CardDescription>{task.description || "Tidak ada deskripsi"}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='flex items-center'>
          <CalendarDaysIcon className='size-4 mr-2' />
          <span>Tanggal Mulai: <strong>{isMounted ? formatDateTimeString(task.startAt.toString()) : "..."}</strong></span>
        </div>
        <div className='flex items-center'>
          <ClockIcon className='size-4 mr-2' />
          <span>Jatuh Tempo: <strong>{isMounted ? formatDateTimeString(task.dueAt.toString()) : "..."}</strong></span>
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
              task.fileUrls.map((fileUrl) => {
                const fileName = fileUrl.split('/').pop();
                return (
                  <a
                    key={fileName}
                    href={fileUrl}
                    target='_blank'>
                    <div className='bg-sky-500/10 rounded p-1.5 flex items-center gap-2 font-medium border-sky-500/25 border text-sky-500 w-fit text-xs duration-150 hover:bg-sky-500/25'>
                      <span>{fileName}</span>
                      <ExternalLinkIcon className='size-3' />
                    </div>
                  </a>
                )
              })
            }
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
