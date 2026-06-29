"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Prisma } from "@/generated/prisma/client";
import { initialActionState } from "@/types/action-state";
import { formatDateTime } from "@/utils/date";
import { EditIcon, EyeIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { toast } from "sonner";
import { deleteEmployeeTaskByIdAction } from "../actions";

export default function EmployeeTaskList({
    data
}: {
    data: Prisma.EmployeeTasksGetPayload<{
        include: {
            employeeTaskCategory: {
                select: {
                    name: true
                }
            },
            employeeTaskAssignments: true
        }
    }>[]
}) {

    const router = useRouter();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Waktu Mulai</TableHead>
                    <TableHead>Jatuh Tempo</TableHead>
                    <TableHead>Ditugaskan</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.employeeTaskCategory?.name}</TableCell>
                        <TableCell>
                            {formatDateTime(item.startAt)}
                        </TableCell>
                        <TableCell>
                            {formatDateTime(item.dueAt)}
                        </TableCell>
                        <TableCell>
                            {
                                item.employeeTaskAssignments.length === 0 ? (
                                    <span className="text-red-500">Belum ditugaskan</span>
                                ) : (
                                    <span>
                                        {item.employeeTaskAssignments.length === 1 ? "1 Karyawan" : `${item.employeeTaskAssignments.length} Karyawan`}
                                    </span>
                                )
                            }
                        </TableCell>
                        <TableCell className="space-x-2">
                            <Button variant={'outline'} size={'icon'}
                                onClick={() => router.push(`/admin/employee-tasks/${item.id}`)}>
                                <EyeIcon />
                            </Button>
                            <Button size={'icon'}
                                onClick={() => router.push(`/admin/employee-tasks/${item.id}/edit`)}>
                                <EditIcon />
                            </Button>
                            <DeleteActionButton
                                id={item.id}
                                judul={item.title} />
                        </TableCell>
                    </TableRow>
                ))}
                {
                    data.length === 0 &&
                    <TableRow>
                        <TableCell colSpan={6} className="text-center">
                            Tidak ada tugas karyawan.
                        </TableCell>
                    </TableRow>
                }
            </TableBody>
        </Table>
    )
}

function DeleteActionButton({
    id,
    judul,
}: {
    id: string
    judul: string
}) {

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();

        toast.promise(
            new Promise(async (resolve, reject) => {
                startTransition(async () => {
                    const result = await deleteEmployeeTaskByIdAction(id, initialActionState);

                    if (result?.success) {
                        resolve(result);
                    } else {
                        reject(new Error(result?.error || "Gagal menghapus"));
                    }
                });
            }),
            {
                loading: `Menghapus tugas "${judul}"...`,
                success: `Berhasil menghapus tugas karyawan "${judul}".`,
                error: (err) => err.message,
                position: "top-center"
            }
        );
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant={'destructive'}
                    size={'icon'}>
                    <TrashIcon className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Tugas Karyawan</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus tugas karyawan <strong>{judul}</strong> ini? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <form onSubmit={handleDelete}>
                        <AlertDialogAction
                            variant={'destructive'}
                            type="submit">
                            Hapus
                        </AlertDialogAction>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}