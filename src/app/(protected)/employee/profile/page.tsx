import { getCurrentEmployee } from "@/features/employee/action";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
    Calendar,
    FileText,
    Mail,
    Phone,
    User,
    Briefcase,
} from "lucide-react";
import { notFound } from "next/navigation";

export default async function EmployeeProfilePage() {
    const currentEmployee = await getCurrentEmployee();
    if (!currentEmployee.data) return notFound();

    const employee = currentEmployee.data;

    const taskTotal = await prisma.employeeTaskAssignment.count({
        where: {
            employeeId: employee.id,
        },
    });

    const taskReportTotal = await prisma.employeeTaskReport.count({
        where: {
            employeeTaskAssignment: {
                employeeId: employee?.id,
            },
        },
    });

    return (
        <div className="space-y-6">
            <div className="rounded-xl border bg-card p-8">
                <div className="flex flex-col items-center gap-4 md:flex-row">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                        {employee.user?.name?.charAt(0)}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold">
                            {employee.user.name}
                        </h1>

                        <p className="text-muted-foreground">
                            Karyawan
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border bg-card p-5">
                    <h2 className="mb-4 font-semibold">
                        Informasi Pribadi
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <User className="size-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Nama
                                </p>
                                <p>{employee.user.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Mail className="size-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Email
                                </p>
                                <p>{employee.user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Phone className="size-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Nomor Telepon
                                </p>
                                <p>{employee.phoneNumber}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar className="size-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Bergabung
                                </p>
                                <p>
                                    {format(
                                        employee!.createdAt,
                                        "dd MMMM yyyy",
                                        {
                                            locale: id,
                                        }
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-5">
                    <h2 className="mb-4 font-semibold">
                        Statistik
                    </h2>

                    <div className="grid gap-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-3">
                                <Briefcase className="size-5 text-primary" />
                                <span>Total Tugas</span>
                            </div>

                            <span className="text-2xl font-bold">
                                {taskTotal}
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-3">
                                <FileText className="size-5 text-primary" />
                                <span>Total Laporan</span>
                            </div>

                            <span className="text-2xl font-bold">
                                {taskReportTotal}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}