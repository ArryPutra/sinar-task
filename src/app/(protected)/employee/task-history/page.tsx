import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCurrentEmployee } from '@/features/employee/action';
import { prisma } from '@/lib/prisma';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

export default async function EmployeeTaskHistoryPage() {
    const currentEmployee = await getCurrentEmployee();

    const taskAssingmentResponses = await prisma.employeeTaskAssignment.findMany({
        where: {
            employeeId: currentEmployee?.data?.id
        },
        select: {
            id: true,
            employeeTask: {
                select: {
                    title: true,
                    employeeTaskStatus: {
                        select: {
                            name: true,
                            colorHex: true
                        }
                    }
                }
            }
        }
    });

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    taskAssingmentResponses.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.employeeTask.title}</TableCell>
                            <TableCell>
                                <Badge style={{ backgroundColor: item.employeeTask.employeeTaskStatus.colorHex, color: "white" }}>
                                    {item.employeeTask.employeeTaskStatus.name}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Link href={`/employee/dashboard/task-assignment/${item.id}`}>
                                    <Button size="sm">
                                        Lihat <ArrowRightIcon />
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}
