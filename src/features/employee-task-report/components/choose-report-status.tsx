"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { EmployeeTaskReportStatus } from "@/generated/prisma/client";
import { initialActionState } from "@/types/action-state";
import { useActionState, useEffect, useState } from "react"; // 👈 Tambah useState
import { toast } from "sonner";
import { updateReportStatusAction } from "../actions";

export default function ChooseReportStatus({
    taskReportStatuses,
    selectedTaskReport,
}: {
    taskReportStatuses: EmployeeTaskReportStatus[]
    selectedTaskReport: {
        id: number,
        employeeTaskReportStatusId: number,
        noteByAdmin: string | null
    }
}) {
    // 1. Buat state internal untuk mengontrol nilai Select
    const [statusId, setStatusId] = useState<string>("");

    const [state, formAction, isPending] = useActionState(
        updateReportStatusAction,
        initialActionState
    );

    useEffect(() => {
        if (selectedTaskReport.employeeTaskReportStatusId) {
            setStatusId(selectedTaskReport.employeeTaskReportStatusId.toString());
        } else {
            setStatusId("");
        }
    }, [selectedTaskReport.employeeTaskReportStatusId]);

    useEffect(() => {
        if (state.success && state.message) {
            toast.success(state.message);
        } else if (!state.success && state.message) {
            toast.error(state.message);
        }
    }, [state]);

    const filteredStatuses = taskReportStatuses.filter(item => item.id !== 1 && item.id !== 2);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Status Laporan</CardTitle>
                <CardDescription>Pilih status untuk laporan ini</CardDescription>
            </CardHeader>
            <form action={formAction} className="space-y-6">
                <CardContent>
                    <Input
                        name="taskReportId"
                        type="hidden"
                        value={selectedTaskReport.id} />
                    
                    {/* 3. Gunakan value dan onValueChange secara penuh */}
                    <Select
                        name="taskReportStatusId"
                        value={statusId} 
                        onValueChange={setStatusId}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Status Laporan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status Tersedia</SelectLabel>
                                {filteredStatuses.map((item) => (
                                    <SelectItem key={item.id.toString()} value={item.id.toString()}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    
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
        </Card>
    );
}