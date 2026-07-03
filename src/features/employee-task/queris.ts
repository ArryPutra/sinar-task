import { Prisma } from "@/generated/prisma/client";

export const employeeTasksByEmployeeId = {
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
        employeeTaskAssignment: {
            select: {
                employeeTaskAssignmentStatus: {
                    select: {
                        name: true,
                        colorHex: true
                    }
                }
            }
        }
    }
} satisfies Prisma.EmployeeTaskDefaultArgs;

export type EmployeeTasksByEmployeeId =
    Prisma.EmployeeTaskGetPayload<typeof employeeTasksByEmployeeId>;