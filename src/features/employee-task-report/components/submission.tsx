"use client"

import { AttachmentList } from '@/components/shared/attachment-list'
import { ImageUpload } from '@/components/shared/image-upload'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { initialActionState } from '@/types/action-state'
import { formatDateOnly, formatDateTimeString } from '@/utils/date'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { submitTaskReportAction } from '../actions'

export default function EmployeeTaskReportSubmission({
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
  taskReport: {
    id: number,
    note: string | null,
    updatedAt: Date
  } | null
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
      <CardHeader>
        <CardTitle>Laporan Harian: {formatDateOnly(selectedDateString)}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} key={taskReport?.id} className='space-y-4'>
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
          <p className='text-muted-foreground mt-4'>
            {
              taskReport?.updatedAt ?
                <span>Terakhir diperbarui: {mounted && formatDateTimeString(taskReport.updatedAt.toString())}</span>
                :
                <span>Ini adalah laporan baru</span>
            }
          </p>
          <div className='w-full flex flex-wrap gap-4 items-center mt-4'>
            <Button
              type='submit'
              className='ml-auto'
              disabled={isPending}>
              Simpan & Kumpulkan {isPending && <Spinner />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
