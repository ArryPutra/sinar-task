"use client"

import BackButton from "@/components/back-button";
import { Badge } from "@/components/ui/badge";
import { Field, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Prisma } from "@/generated/prisma/client";
import { formatDateTime } from "@/utils/date";
import { useRouter } from "next/navigation";

export default function EmployeeTaskDetail({
    data
}: {
    data: Prisma.EmployeeTasksGetPayload<{
        include: {
            employeeTaskCategory: {
                select: {
                    name: true
                }
            },
            employeeTaskAssignments: {
                select: {
                    employeeId: true,
                    employee: {
                        select: {
                            user: {
                                select: {
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            }
        }
    }>
}) {

    const router = useRouter();

    return (
        <>
            <BackButton />
            <FieldGroup className="grid grid-cols-2 max-md:grid-cols-1">
                <Field>
                    <FieldLabel>Judul</FieldLabel>
                    <FieldTitle>{data.title}</FieldTitle>
                </Field>
                <Field>
                    <FieldLabel>Kategori Tugas</FieldLabel>
                    <FieldTitle>{data.employeeTaskCategory.name}</FieldTitle>
                </Field>
                <Field>
                    <FieldLabel>Waktu Mulai</FieldLabel>
                    <FieldTitle>{formatDateTime(data.startAt)}</FieldTitle>
                </Field>
                <Field>
                    <FieldLabel>Jatuh Tempo</FieldLabel>
                    <FieldTitle>{formatDateTime(data.dueAt)}</FieldTitle>
                </Field>
                <Field className="col-span-2">
                    <FieldLabel>Deskripsi</FieldLabel>
                    <FieldTitle>{data.description || <span className="text-muted-foreground">Tidak ada deskripsi</span>}</FieldTitle>
                </Field>
                <Field className="col-span-2">
                    <FieldLabel>Daftar Karyawan Ditugaskan</FieldLabel>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Nomor Telepon</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data.employeeTaskAssignments.length > 0 &&
                                    data.employeeTaskAssignments.map((item, index) => (
                                        <TableRow key={item.employeeId}>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell>{item.employee.user.name}</TableCell>
                                            <TableCell>{item.employee.user.email}</TableCell>
                                            <TableCell>08xx</TableCell>
                                            <TableCell>
                                                <Badge variant={'destructive'}>Belum Selesai</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            }
                            {
                                data.employeeTaskAssignments.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        Tidak ada karyawan yang ditugaskan.
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </Field>
            </FieldGroup>
        </>
    )
}
