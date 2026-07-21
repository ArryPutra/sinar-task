"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { EmployeeTaskReport, EmployeeTaskReportStatus } from "@/generated/prisma/client";
import { initialActionState } from "@/types/action-state";
import { ClockIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react"; // 👈 Tambah useState
import { toast } from "sonner";
import { updateReportStatusAction } from "../actions";

type SelectedReport = Pick<EmployeeTaskReport, 'id' | 'employeeTaskReportStatusId' | 'noteByAdmin'>;

export default function ChooseReportStatus({
    taskReportStatuses,
    selectedTaskReport,
}: {
    taskReportStatuses: EmployeeTaskReportStatus[];
    selectedTaskReport: SelectedReport | null;
}) {

    const [state, formAction, isPending] = useActionState(
        updateReportStatusAction,
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
                selectedTaskReport ?
                    <ChooseReportStatusAvailable
                        formAction={formAction}
                        isPending={isPending}
                        selectedTaskReport={selectedTaskReport}
                        taskReportStatuses={taskReportStatuses} />
                    :
                    <ChooseReportStatusPending />
            }
        </Card>
    );
}

function ChooseReportStatusAvailable({
    formAction,
    isPending,
    taskReportStatuses,
    selectedTaskReport
}: {
    formAction: (payload: FormData) => void,
    isPending: boolean,
    taskReportStatuses: EmployeeTaskReportStatus[],
    selectedTaskReport: SelectedReport
}) {
    const [statusId, setStatusId] = useState<string>(
        selectedTaskReport.employeeTaskReportStatusId.toString()
    );

    useEffect(() => {
        if (selectedTaskReport.employeeTaskReportStatusId) {
            setStatusId(selectedTaskReport.employeeTaskReportStatusId.toString());
        } else {
            setStatusId("");
        }
    }, [selectedTaskReport.employeeTaskReportStatusId]);

    return (
        <>
            <CardHeader className="border-b">
                <CardTitle className="font-semibold flex items-center gap-2">
                    <ClockIcon className="size-4 text-muted-foreground" />
                    <span>Status Laporan {selectedTaskReport.employeeTaskReportStatusId.toString()}</span>
                </CardTitle>
            </CardHeader>
            <form action={formAction} className="space-y-6">
                <CardContent>
                    <Input
                        name="taskReportId"
                        type="hidden"
                        value={selectedTaskReport.id} />

                    {/* 3. Gunakan value dan onValueChange secara penuh */}
                    <Field>
                        <FieldLabel>Status Laporan</FieldLabel>
                        <Select
                            name="taskReportStatusId"
                            value={statusId}
                            onValueChange={setStatusId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Status Laporan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status Tersedia</SelectLabel>
                                    {taskReportStatuses.map((item) => (
                                        <SelectItem 
                                        key={item.id.toString()} 
                                        value={item.id.toString()} 
                                        disabled={(item.id === 1) || (item.id === 2)}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field className="mt-4">
                        <FieldLabel>Catatan</FieldLabel>
                        <Textarea
                            name="noteByAdmin"
                            key={selectedTaskReport.id}
                            defaultValue={selectedTaskReport.noteByAdmin ?? ""}
                            placeholder="Ketik catatan untuk karyawan..." />
                    </Field>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        disabled={isPending}>
                        Perbarui Status {isPending && <Spinner />}
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