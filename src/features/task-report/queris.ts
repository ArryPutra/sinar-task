import { Prisma } from "@/generated/prisma/client";

export const taskReportSubmissionFormQuery = {
    select: {
        id: true,
        note: true,
        submittedAt: true,
        reportDate: true,
        updatedAt: true,
        employeeTaskReportStatus: {
            omit: {
                createdAt: true,
                updatedAt: true
            }
        },
        employeeTaskReportStatusActivities: {
            select: {
                id: true,
                note: true,
                user: {
                    select: {
                        name: true,
                    }
                },
                createdAt: true,
                employeeTaskReportStatus: {
                    select: {
                        name: true,
                        icon: true,
                        colorHex: true
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