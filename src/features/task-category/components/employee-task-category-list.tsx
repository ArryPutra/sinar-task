"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { initialActionState } from "@/types/action-state";
import { formatDateTime } from "@/utils/date";
import { EditIcon, TrashIcon } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { startTransition } from "react";
import { toast } from "sonner";
import { deleteEmployeeTaskCategoryByIdAction } from "../actions";

export default function EmployeeTaskCategoryListPage({
    data
}: {
    data: {
        id: number,
        name: string,
        description: string | null,
        createdAt: Date,
        updatedAt: Date
    }[]
}) {

    const router = useRouter();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Waktu Dibuat</TableHead>
                    <TableHead>Waktu Diperbarui</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="truncate max-w-48">
                            {
                                item.description ||
                                <span className="text-muted-foreground">Tidak ada deskripsi</span>
                            }
                        </TableCell>
                        <TableCell>{formatDateTime(item.createdAt)}</TableCell>
                        <TableCell>{formatDateTime(item.updatedAt)}</TableCell>
                        <TableCell className="space-x-2">
                            <Button size={'icon'}
                                onClick={() => router.push(`/admin/employee-task-categories/${item.id}/edit`)}>
                                <EditIcon />
                            </Button>
                            <DeleteActionButton
                                id={item.id}
                                judul={item.name} />
                        </TableCell>
                    </TableRow>
                ))}
                {
                    data.length === 0 &&
                    <TableRow>
                        <TableCell colSpan={6} className="text-center">
                            Tidak ada kategori pekerjaan karyawan.
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
    id: number
    judul: string
}) {

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();

        toast.promise(
            new Promise(async (resolve, reject) => {
                startTransition(async () => {
                    const result = await deleteEmployeeTaskCategoryByIdAction(id, initialActionState);

                    if (result?.success) {
                        resolve(result);
                    } else {
                        reject(new Error(result?.error || "Gagal menghapus"));
                    }
                });
            }),
            {
                loading: `Menghapus kategori pekerjaan "${judul}"...`,
                success: `Berhasil menghapus kategori pekerjaan karyawan "${judul}".`,
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
                    <AlertDialogTitle>Hapus Kategori Pekerjaan Karyawan</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus kategori pekerjaan karyawan <strong>{judul}</strong> ini? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={handleDelete}>
                        Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}