"use client"

import { AttachmentList } from "@/components/shared/attachment-list";
import UploadFile from "@/components/shared/file-upload";
import LeafletMap from "@/components/shared/leaflet-map/leaflet-map";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { EmployeeTaskAssignmentByEmployeeId } from "@/features/employee-task-assignment/queris";
import { initialActionState } from "@/types/action-state";
import { formatDateOnly, formatDateTime } from "@/utils/date";
import { CalendarIcon, ExternalLinkIcon, FileIcon, MapPinIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { submitEmployeeTaskAssignmentAction } from "../../employee-task-assignment/actions";

export default function EmployeeTaskAssignmentCard({
    data
}: {
    data: EmployeeTaskAssignmentByEmployeeId
}) {
    return (
        <Card key={data.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader className="space-y-2 pb-3">
                <div className="flex justify-between items-start gap-2 flex-wrap">
                    <Badge variant={'outline'}>
                        {data.employeeTask.employeeTaskCategory.name}
                    </Badge>
                    <Badge style={{
                        backgroundColor: data.employeeTask.employeeTaskStatus.colorHex
                    }}>
                        {data.employeeTask.employeeTaskStatus.name}
                    </Badge>
                </div>
                <CardTitle className="line-clamp-2 text-lg font-semibold leading-snug">
                    {data.employeeTask.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                    {data.employeeTask.description || "Tidak ada deskripsi"}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-sm text-muted-foreground pb-4 flex-1">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 shrink-0 text-primary" />
                    <span>Jatuh Tempo: {formatDateOnly(data.employeeTask.dueAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 shrink-0 text-destructive" />
                    <span className="truncate">Lokasi: {data.employeeTask.locationName}</span>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 mb-2">
                        <FileIcon className="h-3.5 w-3.5" />
                        <span>Lampiran Pekerjaan ({data.employeeTask.fileUrls.length}):</span>
                    </div>
                    {data.employeeTask.fileUrls && data.employeeTask.fileUrls.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {data.employeeTask.fileUrls.map((url, idx) => {
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

            <CardFooter className="border-t pt-3 flex justify-between items-center bg-muted/10 rounded-b-xl gap-2">
                <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">Status Pekerjaan Anda</span>
                    <Badge style={{
                        backgroundColor: data.employeeTaskAssignmentStatus.colorHex
                    }}>
                        {data.employeeTaskAssignmentStatus.name}
                    </Badge>
                </div>

                <ShowDialog
                    data={data} />
            </CardFooter>
        </Card>
    )
}

function ShowDialog({
    data
}: {
    data: EmployeeTaskAssignmentByEmployeeId
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(
        submitEmployeeTaskAssignmentAction.bind(null, data.id), initialActionState);

    useEffect(() => {
        if (state.success) {
            toast.success("Pekerjaan berhasil dikumpulkan!", {
                position: "top-center",
                description: "Pekerjaan berhasil dikumpulkan. Silakan tunggu konfirmasi dari admin."
            });
            setIsOpen(false); // Tutup popup jika berhasil
        } else if (state.error) {
            toast.error(state.message, {
                position: "top-center",
                description: state.error
            });
        }
    }, [state]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Lihat Detail
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{data.employeeTask.title}</DialogTitle>
                    <DialogDescription>
                        {data.employeeTask.description || "Tidak ada deskripsi"}
                    </DialogDescription>
                </DialogHeader>

                <Field>
                    <FieldLabel>Lampiran Pekerjaan</FieldLabel>
                    <AttachmentList fileUrls={data.employeeTask.fileUrls} />
                </Field>
                <Field>
                    <FieldLabel>Penanggung Jawab</FieldLabel>
                    <FieldDescription>{data.employeeTask.admin.user.name}</FieldDescription>
                </Field>

                <Field>
                    <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 shrink-0 text-destructive" />
                        <span className="truncate">Lokasi: {data.employeeTask.locationName}</span>
                    </div>
                    <LeafletMap
                        latitude={data.employeeTask.latitude}
                        longitude={data.employeeTask.longitude} />
                </Field>

                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 shrink-0 text-primary" />
                    <span>Jatuh Tempo: {formatDateTime(data.employeeTask.dueAt)}</span>
                </div>

                <Separator />

                <form action={formAction} className="space-y-4">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Catatan</FieldLabel>
                            <Input
                                name="note"
                                placeholder="Masukkan catatan"
                                defaultValue={state.fields?.note?.toString() ?? data.note}
                                disabled={isPending || data.employeeTaskAssignmentStatusId === 4 || data.employeeTask.employeeTaskStatusId === 3} />
                            <FieldError>{state.fieldErrors?.note}</FieldError>
                        </Field>
                        <Field>
                            <FieldLabel>Lampiran Bukti Kerja</FieldLabel>
                            {
                                data.fileUrls.length > 0 &&
                                <FieldDescription>
                                    File yang sudah diunggah sebelumnya akan diganti dengan file baru yang Anda unggah.
                                </FieldDescription>
                            }
                            {
                                (data.employeeTaskAssignmentStatusId !== 4 && data.employeeTask.employeeTaskStatusId !== 3) &&
                                <UploadFile
                                    name="fileUrls"
                                    label={data.fileUrls.length > 0 ? "Klik untuk memperbarui file" : undefined} />
                            }
                            <FieldError>{state.fieldErrors?.fileUrls}</FieldError>
                            <AttachmentList fileUrls={data.fileUrls} />
                        </Field>
                    </FieldGroup>

                    {
                        data.employeeTaskAssignmentStatusId === 4 &&
                        <Alert>
                            <AlertTitle>Pekerjaan Selesai</AlertTitle>
                            <AlertDescription>
                                Pekerjaan ini sudah selesai dan tidak dapat diubah.
                            </AlertDescription>
                        </Alert>
                    }
                    {
                        data.employeeTask.employeeTaskStatusId === 3 &&
                        <Alert variant={'destructive'}>
                            <AlertTitle>Pekerjaan Ditutup</AlertTitle>
                            <AlertDescription>
                                Pekerjaan ini sudah ditutup dan tidak dapat dikumpulkan.
                            </AlertDescription>
                        </Alert>
                    }

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isPending}>
                                Tutup
                            </Button>
                        </DialogClose>
                        {
                            (data.employeeTaskAssignmentStatusId !== 4 && data.employeeTask.employeeTaskStatusId !== 3) &&
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Mengirim..." : "Kirim Pekerjaan"}
                            </Button>
                        }
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}