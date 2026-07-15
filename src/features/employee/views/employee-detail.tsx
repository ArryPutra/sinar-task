"use client"

import BackButton from "@/components/shared/back-button";
import TextLink from "@/components/shared/text-link";
import { Badge } from "@/components/ui/badge";
import { Field, FieldDescription, FieldGroup, FieldTitle } from "@/components/ui/field";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "nextjs-toploader/app";
import { EmployeeWithUserAndTask } from "../queris";

export default function EmployeeDetail({
  data
}: {
  data: EmployeeWithUserAndTask;
}) {

  const router = useRouter();

  return (
    <>
      <BackButton />
      <FieldGroup className="grid grid-cols-2 max-md:grid-cols-1">
        <Field>
          <FieldDescription>Nama</FieldDescription>
          <FieldTitle>{data.user.name}</FieldTitle>
        </Field>
        <Field>
          <FieldDescription>Email</FieldDescription>
          <FieldTitle>{data.user.email}</FieldTitle>
        </Field>
        <Field>
          <FieldDescription>Nomor Telepon</FieldDescription>
          <FieldTitle>{data.phoneNumber}</FieldTitle>
        </Field>
        <Field className="col-span-2">
          <FieldDescription>Daftar Pekerjaan</FieldDescription>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                data.employeeTaskAssignment.length > 0 &&
                data.employeeTaskAssignment.map((item, index) => (
                  <TableRow key={item.employeeTaskId}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <TextLink url={`/admin/employee-tasks/${item.employeeTaskId}`} label={item.employeeTask.title} />
                    </TableCell>
                    <TableCell>{item.employeeTask.employeeTaskCategory.name}</TableCell>
                    <TableCell>
                      <Badge
                        style={{
                          backgroundColor: item.employeeTaskAssignmentStatus.colorHex
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
                    Tidak ada yang ditugaskan.
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
