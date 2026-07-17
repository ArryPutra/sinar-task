import { Prisma } from "@/generated/prisma/client";

export const getEmployeeTaskAssignmentsByEmployeeIdActionQuery = {
    include: {
        employeeTask: {
            include: {
                employeeTaskStatus: {
                    select: {
                        name: true,
                        colorHex: true
                    }
                },
                employeeTaskCategory: {
                    select: {
                        name: true,
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
        }
    }
} satisfies Prisma.EmployeeTaskAssignmentDefaultArgs;

export const getAllEmployeeTaskAssignmentQuery = {
    include: {
        employee: {
            select: {
                phoneNumber: true,
                user: {
                    select: {
                        name: true
                    }
                }
            }
        },
        employeeTask: true,
        employeeTaskAssignmentStatus: {
            select: {
                name: true,
                colorHex: true
            }
        }
    }
} satisfies Prisma.EmployeeTaskAssignmentDefaultArgs;

export type EmployeeTaskAssignmentByEmployeeId =
    Prisma.EmployeeTaskAssignmentGetPayload<typeof getEmployeeTaskAssignmentsByEmployeeIdActionQuery>;

export type AllEmployeeTaskAssignments =
    Prisma.EmployeeTaskAssignmentGetPayload<typeof getAllEmployeeTaskAssignmentQuery>;