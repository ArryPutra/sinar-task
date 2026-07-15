"use client"

import { AttachmentList } from "@/components/shared/attachment-list";
import BackButton from "@/components/shared/back-button";
import LeafletMap from "@/components/shared/leaflet-map/leaflet-map";
import { Badge } from "@/components/ui/badge";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Prisma } from "@/generated/prisma/client";
import { formatDateTime } from "@/utils/date";

export default function EmployeeTaskDetail({
    data
}: {
    data: Prisma.EmployeeTaskGetPayload<{
        include: {
            employeeTaskStatus: {
                select: {
                    name: true,
                    colorHex: true
                }
            },
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
                            phoneNumber: true,
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
                    <FieldDescription>Judul</FieldDescription>
                    <FieldTitle>{data.title}</FieldTitle>
                </Field>
                <Field>
                    <FieldDescription>Kategori Pekerjaan</FieldDescription>
                    <FieldTitle>{data.employeeTaskCategory.name}</FieldTitle>
                </Field>
                <Field>
                    <FieldDescription>Waktu Mulai</FieldDescription>
                    <FieldTitle>{formatDateTime(data.startAt)}</FieldTitle>
                </Field>
                <Field>
                    <FieldDescription>Jatuh Tempo</FieldDescription>
                    <FieldTitle>{formatDateTime(data.dueAt)}</FieldTitle>
                </Field>
                <Field>
                    <FieldDescription>Status</FieldDescription>
                    <FieldTitle>
                        <Badge style={{
                            backgroundColor: data.employeeTaskStatus.colorHex,
                        }}>
                            {data.employeeTaskStatus.name}
                        </Badge>
                    </FieldTitle>
                </Field>
                <Field>
                    <FieldDescription>Nama Lokasi</FieldDescription>
                    <FieldTitle>{data.locationName}</FieldTitle>
                </Field>
                <Field className="col-span-2">
                    <FieldDescription>Deskripsi</FieldDescription>
                    <FieldTitle>{data.description || <span className="text-muted-foreground font-normal italic">Tidak ada deskripsi</span>}</FieldTitle>
                </Field>
                <Field className="col-span-2">
                    <LeafletMap
                        latitude={data.latitude}
                        longitude={data.longitude} />
                </Field>
                <Field className="col-span-2">
                    <FieldDescription>
                        Daftar Lampiran File
                    </FieldDescription>
                    <AttachmentList fileUrls={data.fileUrls} />
                </Field>
                <Field className="col-span-2">
                    <FieldDescription>Daftar Karyawan Ditugaskan</FieldDescription>
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
                                        <TableCell>{item.employee.phoneNumber}</TableCell>
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
