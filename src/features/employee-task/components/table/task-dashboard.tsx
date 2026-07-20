"use client"

import { DateTimeText } from "@/components/shared/date-time-text";
import DropdownSelect from "@/components/shared/dropdown-select";
import SearchInput from "@/components/shared/search-input";
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
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { AllEmployeeTaskDashboardData } from "../../queris";

export default function TaskDashboardTable({
    data,
    page
}: {
    data: AllEmployeeTaskDashboardData[]
    page: number
}) {

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
                        <TableHead>Laporan Peninjauan</TableHead>
                        <TableHead>Jatuh Tempo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ditugaskan</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => {
                        const totalReviewReport = item.employeeTaskAssignment.reduce(
                            (total, assignment) => total + assignment._count.employeeTaskReports,
                            0
                        );
                        return (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{(page - 1) * 10 + index + 1}</TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{totalReviewReport} Laporan</TableCell>
                                <TableCell>
                                    <DateTimeText date={item.dueAt} />
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
                                        item._count.employeeTaskAssignment === 0 ? (
                                            <span className="text-red-500">Belum ditugaskan</span>
                                        ) : (
                                            <span>
                                                {`${item._count.employeeTaskAssignment} Karyawan`}
                                            </span>
                                        )
                                    }
                                </TableCell>
                                <TableCell className="space-x-2">
                                    <Link href={`/admin/dashboard/tasks/${item.id}`}>
                                        <Button variant="outline" size="sm">
                                            Lihat Detail <ArrowRightIcon />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        )
                    })}
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