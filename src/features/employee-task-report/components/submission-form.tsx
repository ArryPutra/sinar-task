"use client"

import { AttachmentList } from '@/components/shared/attachment-list'
import { ImageUpload } from '@/components/shared/image-upload'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { initialActionState } from '@/types/action-state'
import { formatDateOnly, formatDateTimeString } from '@/utils/date'
import { SaveIcon, SendIcon } from 'lucide-react'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { submitTaskReportAction } from '../actions'
import { TaskReportSubmissionFormData } from '../queris'

export default function TaskReportSubmissionForm({
  selectedDateString,
  taskDocumentCategories,
  taskAssignmentId,
  taskReport
}: {
  selectedDateString: string
  taskDocumentCategories: {
    name: string
    slug: string
    isRequired: boolean,
    employeeTaskDocument: {
      fileUrls: string[] | undefined
    }[] | undefined
  }[]
  taskAssignmentId: string
  taskReport: TaskReportSubmissionFormData | null
}) {
  const [state, formAction, isPending] = useActionState(
    submitTaskReportAction.bind(null, taskAssignmentId, selectedDateString),
    initialActionState
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (state.message && state.success) {
      toast(state.message);
    }
  }, [state]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card>
      <CardHeader className='border-b flex justify-between flex-wrap items-center gap-6'>
        <div>
          <CardTitle>Laporan Harian: {formatDateOnly(selectedDateString)}</CardTitle>
          <CardDescription>
            0 dari {taskDocumentCategories.filter((category) => category.isRequired).length} dokumen wajib telah diunggah
          </CardDescription>
        </div>
        <div className='flex flex-col gap-2 items-end max-lg:items-start'>
          <span className='uppercase text-xs font-medium text-muted-foreground'>
            Status Laporan Anda
          </span>
          {
            taskReport ?
              <Badge style={{ backgroundColor: taskReport.employeeTaskReportStatus.colorHex }}>
                {taskReport.employeeTaskReportStatus.name}
              </Badge>
              :
              <Badge variant='outline'>
                Belum Diunggah
              </Badge>
          }
        </div>
      </CardHeader>
      <form action={formAction} key={taskReport?.id} className='space-y-4'>
        <CardContent className='space-y-4'>
          {
            taskDocumentCategories.map((category) => (
              <Field key={category.slug}>
                <FieldLabel>
                  {category.isRequired && <span className='text-destructive'>*</span>}<span>{category.name}</span>
                </FieldLabel>
                <ImageUpload name={category.slug} />
                {
                  <AttachmentList
                    fileUrls={category.employeeTaskDocument?.at(0)?.fileUrls ?? []} />
                }
              </Field>
            ))
          }
          <Field>
            <FieldLabel>Catatan (Opsional)</FieldLabel>
            <Textarea
              name='note'
              placeholder='Masukkan catatan...'
              defaultValue={taskReport?.note ?? ""} />
          </Field>
          {
            (!state.success && state.message) &&
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          }
        </CardContent>
        <CardFooter className='border-t flex justify-end gap-4'>
          <Button
            type='submit'
            variant="secondary">
            <SaveIcon /> Simpan Draft
          </Button>
          <Button
            type='submit'
            disabled={isPending}>
            <SendIcon /> Kumpulkan Laporan {isPending && <Spinner />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
