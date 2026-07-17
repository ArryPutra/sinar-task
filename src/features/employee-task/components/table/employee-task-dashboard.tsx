"use client"

import DropdownSelect from "@/components/shared/dropdown-select";
import SearchInput from "@/components/shared/search-input";
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
import { Badge } from "@/components/ui/badge";
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
import { ArrowRightIcon, TrashIcon } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { startTransition } from "react";
import { toast } from "sonner";
import { deleteEmployeeTaskByIdAction } from "../../actions";
import { formatDateOnly } from "@/utils/date";

export default function EmployeeTaskDashboardTable({
    data,
    page
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
            employeeTaskAssignment: true,
            admin: {
                select: {
                    user: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    }>[]
    page: number
}) {

    const router = useRouter();

    return (
        <>
            <div className="flex flex-wrap gap-2 justify-between">
                <SearchInput />
                <DropdownSelect
                    queryKey="employeeTaskStatusId"
                    placeholder="Pilih Status"
                    label="Status"
                    items={[
                        {
                            value: "1",
                            label: "Belum Dimulai",
                        },
                        {
                            value: "2",
                            label: "Sedang Berlangsung",
                        },
                        {
                            value: "3",
                            label: "Ditutup",
                        },
                    ]}
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Judul</TableHead>
                        <TableHead>Jumlah Review</TableHead>
                        <TableHead>Waktu Mulai</TableHead>
                        <TableHead>Jatuh Tempo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ditugaskan</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{(page - 1) * 10 + index + 1}</TableCell>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>1</TableCell>
                            <TableCell>
                                {formatDateOnly(item.startAt)}
                            </TableCell>
                            <TableCell>
                                {formatDateOnly(item.dueAt)}
                            </TableCell>
                            <TableCell>
                                {

                                }
                                <Badge style={{ backgroundColor: item.employeeTaskStatus.colorHex }}>
                                    {item.employeeTaskStatus.name}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {
                                    item.employeeTaskAssignment.length === 0 ? (
                                        <span className="text-red-500">Belum ditugaskan</span>
                                    ) : (
                                        <span>
                                            {item.employeeTaskAssignment.length === 1 ? "1 Karyawan" : `${item.employeeTaskAssignment.length} Karyawan`}
                                        </span>
                                    )
                                }
                            </TableCell>
                            <TableCell className="space-x-2">
                                <Button variant="outline" size="sm">
                                    Lihat Detail <ArrowRightIcon />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {
                        data.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={99} className="text-center text-muted-foreground">
                                Tidak ada pekerjaan karyawan.
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </>
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
                loading: `Menghapus pekerjaan "${judul}"...`,
                success: `Berhasil menghapus pekerjaan karyawan "${judul}".`,
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
                    <AlertDialogTitle>Hapus Pekerjaan Karyawan</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus pekerjaan karyawan <strong>{judul}</strong> ini? Tindakan ini tidak dapat dibatalkan.
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