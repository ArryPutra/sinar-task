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
import { uploadStreamToCloudinary } from '@/lib/cloudinary'
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

  const [isPendingSubmitTask, startTransitionSubmitTask] = useTransition();
  const [isPendingUploadFile, setIsPendingUploadFile] = useState<boolean>(false);
  const [isPendingRemoveFileUrl, startTransitionRemoveFileUrl] = useTransition();

  // STATE: Hanya melacak file baru yang diunggah di client-side
  const [clientFilesCount, setClientFilesCount] = useState<Record<string, number>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const filesDocumentPayload = [];

    try {
      setIsPendingUploadFile(true);
      for (const documentCategory of taskDocumentCategories) {
        const files = formData.getAll(documentCategory.slug) as File[];

        // jika ada file yang diunggah
        if (files.length > 0 && files[0].size > 0) {
          const uploadResults = await Promise.all(
            files.map(file => uploadStreamToCloudinary(file, "task_documents"))
          );

          filesDocumentPayload.push({
            documentCategoryId: documentCategory.id,
            fileUrls: uploadResults.map(res => res.secure_url),
          });
        }

        // Hapus input file dari FormData agar tidak ikut terkirim ke server
        formData.delete(documentCategory.slug);
      }

      // Tambahkan payload hasil upload
      formData.set("uploadedFilesData", JSON.stringify(filesDocumentPayload));

      startTransitionSubmitTask(() => {
        formAction(formData);
      });
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengunggah file.");
    } finally {
      setIsPendingUploadFile(false);
    }
  };

  useEffect(() => {
    if (isPendingUploadFile) {
      toast.loading("Menyimpan laporan...", { id: "save-draft" });
    } else if (!isPendingUploadFile && state.message) {
      if (state.success) {
        toast.success(state.message, { id: "save-draft" });
        setClientFilesCount({}); // Reset setelah save
      } else {
        toast.error(state.message, { id: "save-draft" });
      }
    }
  }, [isPendingUploadFile, state]);

  const onRemoveDocumentFileUrl = (
    fileUrl: string,
    documentId: number
  ) => {
    if (isPendingRemoveFileUrl) return;

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
    <>
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
        <form onSubmit={handleSubmit} key={taskReport?.id} className='space-y-4'>
          <CardContent className='space-y-4'>
            {
              taskDocumentCategories.map((documentCategory) => (
                <Field key={documentCategory.slug}>
                  <FieldLabel>
                    {documentCategory.isRequired && <span className='text-destructive'>*</span>}<span>{documentCategory.name}</span>
                  </FieldLabel>

                  {/* Lacak penambahan file baru */}
                  <ImageUpload
                    key={`${documentCategory.employeeTaskDocument?.at(0)?.fileUrls?.length}`}
                    name={documentCategory.slug}
                    onChange={(e: any) => {
                      const filesCount = e?.target?.files
                        ? e.target.files.length
                        : (Array.isArray(e) ? e.length : 0);

                      setClientFilesCount((prev) => ({
                        ...prev,
                        [documentCategory.slug]: filesCount
                      }));
                    }}
                  />

                  <AttachmentList
                    fileUrls={documentCategory.employeeTaskDocument?.at(0)?.fileUrls ?? []}
                    onRemove={(fileUrl) => {
                      onRemoveDocumentFileUrl(fileUrl, documentCategory.employeeTaskDocument?.at(0)?.id!)
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
                disabled={isPendingUploadFile}>
                <SaveIcon /> Simpan Draft {isPendingUploadFile && <Spinner />}
              </Button>
            }
            <Button
              type='submit'
              disabled={!isAllRequiredDocumentFilled || isPendingUploadFile}>
              <SendIcon /> Kumpulkan Laporan ({uploadedRequiredDocumentLength}/{requiredDocumentLength}) {isAllRequiredDocumentFilled && (isPendingUploadFile && <Spinner />)}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  )
}