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
import { formatDateOnly } from '@/utils/date'
import { SaveIcon, SendIcon } from 'lucide-react'
import { useActionState, useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { removeDocumentFileUrlAction, submitTaskReportAction } from '../actions'
import { TaskReportSubmissionFormData } from '../queris'

export default function TaskReportSubmissionForm({
  selectedDateString,
  taskDocumentCategories,
  taskAssignmentId,
  taskReport
}: {
  selectedDateString: string
  taskDocumentCategories: {
    id: number,
    name: string
    slug: string
    isRequired: boolean,
    employeeTaskDocument: {
      id: number,
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

  const [isPendingRemoveFileUrl, startTransitionRemoveFileUrl] = useTransition();

  // STATE: Hanya melacak file baru yang diunggah di client-side
  const [clientFilesCount, setClientFilesCount] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isPending && state.message) {
      if (state.success) {
        toast.success(state.message, { id: "save-draft" });
        setClientFilesCount({}); // Reset setelah save
      } else {
        toast.error(state.message, { id: "save-draft" });
      }
    }
  }, [isPending, state]);

  useEffect(() => {
    if (isPending) {
      toast.loading("Menyimpan draft...", { id: "save-draft" });
    }
  }, [isPending]);

  const onRemoveDocumentFileUrl = (
    fileUrl: string,
    documentId: number
  ) => {
    startTransitionRemoveFileUrl(() => {
      toast.promise(
        removeDocumentFileUrlAction(fileUrl, documentId),
        {
          loading: "Menghapus file...",
          success: "File berhasil dihapus.",
          error: "Gagal menghapus file.",
        }
      );
    });
  };

  // Kalkulasi fleksibel
  const requiredCategories = taskDocumentCategories.filter((category) => category.isRequired);
  const requiredDocumentLength = requiredCategories.length;

  const uploadedRequiredDocumentLength = requiredCategories.filter((category) => {
    // Berapa file yang ada di database saat ini? (Akan otomatis update karena revalidatePath)
    const serverFilesCount = category.employeeTaskDocument?.at(0)?.fileUrls?.length ?? 0;

    // Berapa file baru yang dimasukkan via ImageUpload?
    const newClientFilesCount = clientFilesCount[category.slug] ?? 0;

    return (serverFilesCount + newClientFilesCount) > 0;
  }).length;

  const isAllRequiredDocumentFilled = requiredDocumentLength === uploadedRequiredDocumentLength;

  return (
    <Card>
      <CardHeader className='border-b flex justify-between flex-wrap items-center gap-6'>
        <div>
          <CardTitle>Laporan Harian: {formatDateOnly(selectedDateString)}</CardTitle>
          <CardDescription>
            {uploadedRequiredDocumentLength} dari {requiredDocumentLength} dokumen wajib telah diunggah
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

                {/* Lacak penambahan file baru */}
                <ImageUpload
                  name={category.slug}
                  onChange={(e: any) => {
                    const filesCount = e?.target?.files
                      ? e.target.files.length
                      : (Array.isArray(e) ? e.length : 0);

                    setClientFilesCount((prev) => ({
                      ...prev,
                      [category.slug]: filesCount
                    }));
                  }}
                />

                <AttachmentList
                  fileUrls={category.employeeTaskDocument?.at(0)?.fileUrls ?? []}
                  onRemove={(fileUrl) => {
                    onRemoveDocumentFileUrl(fileUrl, category.employeeTaskDocument?.at(0)?.id!)
                  }}
                />
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
        <CardFooter className='border-t flex justify-end gap-4 flex-wrap'>
          {
            !isAllRequiredDocumentFilled &&
            <Button
              type='submit'
              variant="secondary"
              disabled={isPending}>
              <SaveIcon /> Simpan Draft {isPending && <Spinner />}
            </Button>
          }
          <Button
            type='submit'
            disabled={!isAllRequiredDocumentFilled || isPending}>
            <SendIcon /> Kumpulkan Laporan ({uploadedRequiredDocumentLength}/{requiredDocumentLength}) {isAllRequiredDocumentFilled && (isPending && <Spinner />)}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}