"use client"

import { AttachmentList } from '@/components/shared/attachment-list'
import { DateTimeText } from '@/components/shared/date-time-text'
import { ImageUpload } from '@/components/shared/image-upload'
import { PrintShortcut } from '@/components/shared/print-shortcut'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { uploadStreamToCloudinary } from '@/lib/cloudinary'
import { initialActionState } from '@/types/action-state'
import { formatDateOnly } from '@/utils/date'
import { SaveIcon, SendIcon } from 'lucide-react'
import { useActionState, useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { removeDocumentFileUrlAction, submitTaskReportAction } from '../../actions'
import { TaskReportSubmissionFormData } from '../../queris'
import PrintPdfButton from '../print-pdf-button'

export default function TaskReportSubmissionForm({
  selectedDateString,
  taskDocumentCategories,
  taskAssignmentId,
  taskReport,
  isAdmin
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
  isAdmin: boolean
}) {
  const [stateSubmitReport, formActionSubmitReport, isPendingSubmitReport] = useActionState(
    submitTaskReportAction.bind(null, taskAssignmentId, selectedDateString),
    initialActionState
  );

  const [isPendingSubmitTask, startTransitionSubmitTask] = useTransition();
  const [isPendingUploadFile, setIsPendingUploadFile] = useState<boolean>(false);
  const [isPendingRemoveFileUrl, startTransitionRemoveFileUrl] = useTransition();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

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
        formActionSubmitReport(formData);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsPendingUploadFile(false);
    }
  };

  // untuk kejadian ketika upload file atau submit form
  useEffect(() => {
    if (isPendingUploadFile || isPendingSubmitReport) {
      toast.loading("Menyimpan laporan pekerjaan...", { id: "submit-task" });
    }

    if (!isPendingUploadFile && !isPendingSubmitReport && stateSubmitReport.message) {
      if (stateSubmitReport.success) {
        toast.success(stateSubmitReport.message, { id: "submit-task" });
        setClientFilesCount({}); // Reset setelah save
      } else {
        toast.error(stateSubmitReport.message, { id: "submit-task" });
      }
      setIsSubmitDialogOpen(false);
    }
  }, [isPendingUploadFile, stateSubmitReport, isPendingSubmitReport]);

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

  let alert: React.ReactNode;

  if (!isAdmin) {
    if (taskReport?.employeeTaskReportStatus.id === 3) {
      const latestApprovedActivity = taskReport?.employeeTaskReportStatusActivities
        .filter((activity) => activity.id === 2)
        .at(-1);

      alert =
        <>
          <Alert>
            <AlertTitle>Laporan Perlu Direvisi</AlertTitle>

            <AlertDescription>
              Laporan Anda telah ditinjau oleh admin dan memerlukan revisi.
              Silakan perbaiki laporan sesuai catatan di bawah ini, kemudian
              kirim ulang untuk ditinjau kembali.
            </AlertDescription>
            <AlertDescription>
              Catatan: {taskReport?.employeeTaskReportStatusActivities.findLast((activity) => activity.note)?.note || "Tidak ada catatan"}
            </AlertDescription>
          </Alert>
        </>
    }
  }

  return (
    <>
      <Card>
        <CardHeader className='border-b flex flex-col flex-wrap items-start gap-6'>
          <div className='w-full flex justify-between flex-wrap gap-6'>
            <div>
              <CardTitle>Laporan Harian: {formatDateOnly(selectedDateString)}</CardTitle>
              <CardDescription>
                {uploadedRequiredDocumentLength} dari {requiredDocumentLength} dokumen wajib telah diunggah
              </CardDescription>
              <PrintPdfButton
                taskReportId={taskReport?.id ?? null} />
            </div>
            <div className='flex flex-col gap-2 items-end max-lg:items-start'>
              <span className='uppercase text-xs font-medium text-muted-foreground'>
                Status Laporan Anda
              </span>
              {
                taskReport ?
                  <Badge style={{ backgroundColor: taskReport.employeeTaskReportStatus.colorHex, color: "white" }}>
                    {taskReport.employeeTaskReportStatus.name}
                  </Badge>
                  :
                  <Badge variant='outline'>
                    Belum Dikerjakan
                  </Badge>
              }
            </div>
          </div>
          {alert}
        </CardHeader>
        <form
          id="task-report-form"
          onSubmit={handleSubmit}
          key={taskReport?.id} className='space-y-4'>
          <CardContent className='space-y-4'>
            {
              taskDocumentCategories.map((documentCategory) => (
                <Field key={documentCategory.slug}>
                  <FieldLabel>
                    {documentCategory.isRequired && <span className='text-destructive'>*</span>}<span>{documentCategory.name}</span>
                  </FieldLabel>

                  {/* Lacak penambahan file baru */}
                  {
                    !isAdmin &&
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
                  }

                  <AttachmentList
                    fileUrls={documentCategory.employeeTaskDocument?.at(0)?.fileUrls ?? []}
                    {
                    ...(!isAdmin && {
                      onRemove: (fileUrl) => {
                        onRemoveDocumentFileUrl(fileUrl, documentCategory.employeeTaskDocument?.at(0)?.id!)
                      }
                    })
                    }
                  />
                </Field>
              ))
            }
            <Field>
              <FieldLabel>Catatan Laporan (Opsional)</FieldLabel>
              <Textarea
                name='reportNote'
                placeholder='Masukkan catatan...'
                defaultValue={taskReport?.note ?? ""}
                disabled={isAdmin} />
            </Field>
            {
              (!stateSubmitReport.success && stateSubmitReport.message) &&
              <Alert variant="destructive">
                <AlertDescription>{stateSubmitReport.message}</AlertDescription>
              </Alert>
            }
            <div className='flex items-center gap-2 text-muted-foreground'>
              <span>Terakhir {taskReport?.employeeTaskReportStatus.id === 1 ? "Disimpan" : "Dikumpulkan"}:</span>
              <DateTimeText
                date={taskReport?.submittedAt} />
            </div>
          </CardContent>
          {
            !isAdmin &&
            <CardFooter className='border-t flex justify-end gap-4 flex-wrap'>
              {
                !isAllRequiredDocumentFilled &&
                <Button
                  type='submit'
                  variant="secondary"
                  disabled={isPendingUploadFile || isPendingSubmitReport}>
                  <SaveIcon /> Simpan Draft {(isPendingUploadFile || isPendingSubmitReport) && <Spinner />}
                </Button>
              }
              <Dialog
                open={isSubmitDialogOpen}
                onOpenChange={setIsSubmitDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <SendIcon />
                    Kumpulkan Laporan ({uploadedRequiredDocumentLength}/
                    {requiredDocumentLength})
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Kumpulkan Laporan?</DialogTitle>
                    <DialogDescription>
                      Pastikan seluruh dokumen yang diperlukan telah diunggah dan isi laporan
                      sudah benar. Setelah dikumpulkan, laporan akan dikirim kepada admin
                      untuk ditinjau.
                    </DialogDescription>
                  </DialogHeader>

                  <Field>
                    <FieldLabel htmlFor="activityNote">
                      Catatan Aktivitas<span className="text-muted-foreground">(Opsional)</span>
                    </FieldLabel>

                    <Textarea
                      id="activityNote"
                      name='activityNote'
                      form="task-report-form"
                      placeholder="Tambahkan catatan untuk admin, misalnya penjelasan mengenai laporan atau informasi tambahan..."
                    />
                  </Field>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>

                    <Button
                      type="submit"
                      form="task-report-form"
                      disabled={isPendingUploadFile || isPendingSubmitReport}>
                      {(isPendingUploadFile || isPendingSubmitReport) && <Spinner />}
                      Kumpulkan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          }
        </form>
      </Card>
    </>
  )
}