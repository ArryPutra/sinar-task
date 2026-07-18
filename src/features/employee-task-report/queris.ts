import { Prisma } from "@/generated/prisma/client";

export const taskReportSubmissionFormQuery = {
    select: {
        id: true,
        note: true,
        reportDate: true,
        updatedAt: true,
        employeeTaskReportStatus: {
            omit: {
                id: true,
                createdAt: true,
                updatedAt: true
            }
        }
    }
} satisfies Prisma.EmployeeTaskReportDefaultArgs

export type TaskReportSubmissionFormData =
    Prisma.EmployeeTaskReportGetPayload<typeof taskReportSubmissionFormQuery>