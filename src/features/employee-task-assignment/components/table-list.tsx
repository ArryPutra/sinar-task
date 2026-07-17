"use client";

import SearchInput from "@/components/shared/search-input";
import TextLink from "@/components/shared/text-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Field, FieldLabel } from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmployeeTaskAssignmentStatus } from "@/generated/prisma/client";
import { initialActionState } from "@/types/action-state";
import { formatDateTime } from "@/utils/date";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { updateEmployeeTaskAssignmentStatusAction } from "../actions";
import { AllEmployeeTaskAssignments } from "../queris";

export default function EmployeeTaskAssignmentList({
    taskAssignments,
    employeeTaskAssignmentStatusOptions
}: {
    taskAssignments: AllEmployeeTaskAssignments[]
    employeeTaskAssignmentStatusOptions: EmployeeTaskAssignmentStatus[]
}) {
    return (
        <>
            <SearchInput />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Nomor Telepon</TableHead>
                        <TableHead>Judul Pekerjaan</TableHead>
                        <TableHead>Jatuh Tempo</TableHead>
                        <TableHead>Status Pekerjaan</TableHead>
                        <TableHead>Dikumpulkan</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {taskAssignments.map((task, index) => (
                        <TableRow key={task.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                                <TextLink
                                    url={`/admin/employees/${task.employeeId}`}
                                    label={task.employee.user.name ?? "Tidak ada nama"}
                                />
                            </TableCell>
                            <TableCell>{task.employee.phoneNumber}</TableCell>
                            <TableCell>
                                <TextLink
                                    url={`/admin/employee-tasks/${task.employeeTask.id}`}
                                    label={task.employeeTask.title}
                                />
                            </TableCell>
                            <TableCell>{formatDateTime(task.employeeTask.dueAt)}</TableCell>
                            <TableCell>
                                <Badge style={{
                                    backgroundColor: task.employeeTaskAssignmentStatus.colorHex
                                }}>
                                    {task.employeeTaskAssignmentStatus.name}
                                </Badge>
                                {
                                    (task.employeeTask.employeeTaskStatusId === 3 && task.employeeTaskAssignmentStatusId !== 4) &&
                                    (
                                        <>
                                            <br />
                                            <Badge variant={"destructive"} className="mt-2">
                                                Terlambat
                                            </Badge>
                                        </>
                                    )
                                }
                            </TableCell>
                            <TableCell>{formatDateTime(task.updatedAt)}</TableCell>
                            <TableCell>
                                <ShowDialog
                                    data={task}
                                    employeeTaskAssignmentStatusOptions={employeeTaskAssignmentStatusOptions} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {
                        taskAssignments.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={99} className="text-center text-muted-foreground">
                                    Tidak ada data pekerjaan karyawan yang tersedia.
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </>
    )
}

function ShowDialog({
    data,
    employeeTaskAssignmentStatusOptions
}: {
    data: AllEmployeeTaskAssignments
    employeeTaskAssignmentStatusOptions: EmployeeTaskAssignmentStatus[]
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(
        updateEmployeeTaskAssignmentStatusAction.bind(null, data.id), initialActionState);

    useEffect(() => {
        if (state.success) {
            toast.success("Pekerjaan karyawan berhasil diperbarui!", {
                position: "top-center",
                description: "Status pekerjaan berhasil diperbarui."
            });
            setIsOpen(false); // Tutup popup jika berhasil
        } else if (!state.success) {
            toast.error(state.message, {
                position: "top-center",
                description: state.message
            });
        }
    }, [state]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Lihat Pekerjaan
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{data.employeeTask.title}</DialogTitle>
                    <DialogDescription>
                        Dikumpulkan: {formatDateTime(data.updatedAt)}
                    </DialogDescription>
                </DialogHeader>
                <div className="border p-3 rounded-xl flex flex-col">
                    <span>Nama: {data.employee.user.name}</span>
                    <span>Nomor Telepon: {data.employee.phoneNumber}</span>
                </div>
                <form action={formAction} className="space-y-6">
                    <Field>
                        <FieldLabel>Status Pekerjaan:</FieldLabel>
                        <Select defaultValue={data.employeeTaskAssignmentStatusId.toString()}
                            name="employeeTaskAssignmentStatusId">
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Pilih Status</SelectLabel>
                                    {employeeTaskAssignmentStatusOptions.map((item) => (
                                        <SelectItem key={item.id} value={item.id.toString()}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isPending}>
                                Tutup
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            Simpan {isPending && <Spinner />}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}