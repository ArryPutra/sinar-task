import TextLink from "@/components/text-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EyeIcon } from "lucide-react";
import { AllEmployeeTaskAssignments } from "../queris";

export default function EmployeeTaskAssignmentList({
    taskAssignments
}: {
    taskAssignments: AllEmployeeTaskAssignments[]
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Judul Tugas</TableHead>
                    <TableHead>Status Pekerjaan</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {taskAssignments.map((task, index) => (
                    <TableRow key={task.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                            <TextLink
                                url={`/admin/employees/${task.employeeId}`}
                                label={task.employee.user.name ?? "Tidak ada nama"}
                            />
                        </TableCell>
                        <TableCell>
                            <TextLink
                                url={`/admin/employee-tasks/${task.employeeTask.id}`}
                                label={task.employeeTask.title}
                            />
                        </TableCell>
                        <TableCell>
                            <Badge style={{
                                backgroundColor: task.employeeTaskAssignmentStatus.colorHex
                            }}>
                                {task.employeeTaskAssignmentStatus.name}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Button size="icon" variant="outline">
                                <EyeIcon />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
