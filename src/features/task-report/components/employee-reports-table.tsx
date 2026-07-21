"use client"

import { DateTimeText } from '@/components/shared/date-time-text';
import DropdownSelect from '@/components/shared/dropdown-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDateTimeBusinessTz } from '@/utils/date';
import { format } from 'date-fns';
import { ArrowRightIcon, ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';
import { EmployeeTaskReportListData } from '../queris';

export default function EmployeeReportsTable({
    reports,
    reportStatuses
}: {
    reports: EmployeeTaskReportListData[]
    reportStatuses: {
        id: number
        name: string
    }[]
}) {

    const router = useRouter();

    const handleDetailClick = (
        taskAssignmentId: string,
        reportDate: Date,
        employeeId: string,
        taskId: string
    ) => {
        const formattedDate = format(formatDateTimeBusinessTz(reportDate), 'yyyy-MM-dd');

        const params = new URLSearchParams();
        params.set("date", formattedDate);

        router.push(`/admin/dashboard/task-assignment/${taskAssignmentId}?${params}`);
    }

    return (
        <>
            <div className="flex flex-wrap gap-2 justify-between">
                <DropdownSelect
                    queryKey="employeeTaskReportStatusId"
                    placeholder="Pilih Status"
                    label="Status"
                    items={reportStatuses.map((status) => ({
                        value: status.id,
                        label: status.name
                    }))}
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Karyawan</TableHead>
                        <TableHead>Status Laporan</TableHead>
                        <TableHead>Waktu Dikumpulkan</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>1</TableCell>
                                <TableCell>
                                    <Link
                                        href={`/admin/employees/${report.employeeTaskAssignment.employee.id}`}
                                        className='flex items-center gap-2 cursor-pointer group hover:text-blue-500 duration-150 hover:underline w-fit'>
                                        <span>{report.employeeTaskAssignment.employee.user.name}</span><ExternalLinkIcon className='size-3.5 group text-muted-foreground group-hover:text-blue-500 duration-150' />
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Badge style={{ backgroundColor: report.employeeTaskReportStatus.colorHex, color: "white" }}>
                                        {report.employeeTaskReportStatus.name}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DateTimeText date={report.updatedAt} />
                                </TableCell>
                                <TableCell>
                                    <Button size="sm" onClick={() => {
                                        handleDetailClick(
                                            report.employeeTaskAssignment.id,
                                            report.reportDate,
                                            report.employeeTaskAssignment.employee.id,
                                            report.employeeTaskAssignment.employeeTask.id
                                        )
                                    }}>
                                        <span>Detail</span><ArrowRightIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                    {
                        reports.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={99} className="text-center text-muted-foreground">
                                    Belum ada laporan.
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </>
    )
}
