import { Prisma } from "@/generated/prisma/client";

export const taskReportSubmissionFormQuery = {
    select: {
        id: true,
        noteByEmployee: true,
        noteByAdmin: true,
        submittedAt: true,
        reportDate: true,
        updatedAt: true,
        employeeTaskReportStatus: {
            omit: {
                createdAt: true,
                updatedAt: true
            }
        },
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
} satisfies Prisma.EmployeeTaskReportDefaultArgs

export const employeeTaskReportListQuery = {
    select: {
        id: true,
        submittedAt: true,
        reportDate: true,
        employeeTaskReportStatus: {
            select: {
                name: true,
                colorHex: true
            }
        },
        employeeTaskAssignment: {
            select: {
                id: true,
                employee: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                employeeTask: {
                    select: {
                        id: true,
                    }
                }
            }
        },
    },
} satisfies Prisma.EmployeeTaskReportDefaultArgs

export type TaskReportSubmissionFormData =
    Prisma.EmployeeTaskReportGetPayload<typeof taskReportSubmissionFormQuery>
export type EmployeeTaskReportListData =
    Prisma.EmployeeTaskReportGetPayload<typeof employeeTaskReportListQuery>