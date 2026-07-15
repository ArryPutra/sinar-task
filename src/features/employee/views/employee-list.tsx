"use client"

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { EditIcon, EyeIcon } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { EmployeeWithUser } from "../queris";

export default function EmployeeList({
    data
}: {
    data: EmployeeWithUser[]
}) {

    const router = useRouter();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Nomor Telepon</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{item.user.name}</TableCell>
                        <TableCell>{item.user.email}</TableCell>
                        <TableCell>{item.phoneNumber}</TableCell>
                        <TableCell className="space-x-2">
                            <Button variant={'outline'} size={'icon'}
                                onClick={() => router.push(`/admin/employees/${item.id}`)}>
                                <EyeIcon />
                            </Button>
                            <Button size={'icon'}
                                onClick={() => router.push(`/admin/employees/${item.id}/edit`)}>
                                <EditIcon />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
                {
                    data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                Tidak ada data karyawan
                            </TableCell>
                        </TableRow>
                    )
                }
            </TableBody>
        </Table>
    )
}