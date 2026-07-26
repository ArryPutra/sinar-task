"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createReportStatusActivityAction } from "@/features/task-report-status-activity/actions";
import { EmployeeTaskReportStatus } from "@/generated/prisma/client";
import { ActionState, initialActionState } from "@/types/action-state";
import { ClockIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react"; // 👈 Tambah useState
import { toast } from "sonner";

export default function ChooseReportStatus({
    taskReportStatuses,
    taskReportId
}: {
    taskReportStatuses: EmployeeTaskReportStatus[];
    taskReportId: number | null
}) {

    const [state, formAction, isPending] = useActionState(
        createReportStatusActivityAction,
        initialActionState
    );

    useEffect(() => {
        if (state.success && state.message) {
            toast.success(state.message);
        } else if (!state.success && state.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <Card>
            {
                taskReportId ?
                    <ChooseReportStatusAvailable
                        state={state}
                        formAction={formAction}
                        isPending={isPending}
                        taskReportStatuses={taskReportStatuses}
                        taskReportId={taskReportId} />
                    :
                    <ChooseReportStatusPending />
            }
        </Card>
    );
}

function ChooseReportStatusAvailable({
    state,
    formAction,
    isPending,
    taskReportStatuses,
    taskReportId
}: {
    state: ActionState,
    formAction: (payload: FormData) => void,
    isPending: boolean,
    taskReportStatuses: EmployeeTaskReportStatus[],
    taskReportId: number
}) {
    const [selectedStatus, setSelectedStatus] = useState("");

    useEffect(() => {
        console.log(true)
        if (state.success) {
            setSelectedStatus("");
        }
    }, [state.success]);

    return (
        <>
            <CardHeader className="border-b">
                <CardTitle className="font-semibold flex items-center gap-2">
                    <ClockIcon className="size-4 text-muted-foreground" />
                    <span>Buat Status Laporan</span>
                </CardTitle>
            </CardHeader>
            <form action={formAction} className="space-y-6">
                <CardContent>
                    <Input
                        name="taskReportId"
                        value={taskReportId.toString()}
                        type="hidden" />

                    {/* 3. Gunakan value dan onValueChange secara penuh */}
                    <Field>
                        <FieldLabel>Status Laporan</FieldLabel>
                        <Select
                            name="taskReportStatusId"
                            value={selectedStatus}
                            onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Status Laporan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Daftar Status Laporan</SelectLabel>
                                    {taskReportStatuses.map((item) => (
                                        <SelectItem
                                            key={item.id.toString()}
                                            value={item.id.toString()}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FieldError>{state.fieldErrors?.taskReportStatusId?.at(0)}</FieldError>
                    </Field>

                    <Field className="mt-4">
                        <FieldLabel>Catatan</FieldLabel>
                        <Textarea
                            name="note"
                            placeholder="Ketik catatan untuk karyawan..." />
                    </Field>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        disabled={isPending}>
                        Buat Status Laporan {isPending && <Spinner />}
                    </Button>
                </CardFooter>
            </form>
        </>
    )
}

function ChooseReportStatusPending() {
    return (
        <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3 flex-1">
            <div className="flex items-center justify-center rounded-full bg-amber-500/10 p-4">
                <ClockIcon className="size-6 text-amber-600 dark:text-amber-400" />
            </div>

            <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                    Belum Dapat Mengubah Status
                </p>
                <p className="text-xs text-muted-foreground max-w-[250px]">
                    Karyawan belum memulai laporan untuk tanggal ini.
                </p>
            </div>
        </CardContent>
    )
}