"use client"

import { AttachmentList } from "@/components/attachment-list";
import BackButton from "@/components/back-button";
import LeafletMap from "@/components/leaflet-map/leaflet-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Prisma } from "@/generated/prisma/client";
import { formatDateTime } from "@/utils/date";
import { ExternalLink, File, FileText, Image, Paperclip } from "lucide-react";

export default function EmployeeTaskDetail({
    data
}: {
    data: Prisma.EmployeeTaskGetPayload<{
        include: {
            employeeTaskCategory: {
                select: {
                    name: true
                }
            },
            employeeTaskAssignment: {
                select: {
                    employeeId: true,
                    employee: {
                        select: {
                            nomorTelepon: true,
                            user: {
                                select: {
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    },
                    employeeTaskAssignmentStatus: {
                        select: {
                            name: true,
                            colorHex: true
                        }
                    }
                }
            }
        }
    }>
}) {

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
                    <LeafletMap
                        latitude={data.latitude}
                        longitude={data.longitude} />
                </Field>
                <Field className="col-span-2">
                    <FieldLabel>
                        Daftar Lampiran File
                    </FieldLabel>
                    <AttachmentList fileUrls={data.fileUrls} />
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
                                data.employeeTaskAssignment.length > 0 &&
                                data.employeeTaskAssignment.map((item, index) => (
                                    <TableRow key={item.employeeId}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>{item.employee.user.name}</TableCell>
                                        <TableCell>{item.employee.user.email}</TableCell>
                                        <TableCell>{item.employee.nomorTelepon}</TableCell>
                                        <TableCell>
                                            <Badge style={{
                                                backgroundColor: item.employeeTaskAssignmentStatus.colorHex,
                                            }}>
                                                {item.employeeTaskAssignmentStatus.name}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                            {
                                data.employeeTaskAssignment.length === 0 &&
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
