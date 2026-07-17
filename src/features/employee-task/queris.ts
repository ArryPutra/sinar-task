import { Prisma } from "@/generated/prisma/client";

export const employeeTaskById = {
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
                employeeId: true,
                employeeTaskAssignmentStatus: {
                    select: {
                        name: true,
                        colorHex: true
                    }
                },
                employee: {
                    select: {
                        phoneNumber: true,
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                },
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
} satisfies Prisma.EmployeeTaskDefaultArgs;

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
    }
} satisfies Prisma.EmployeeTaskDefaultArgs;

export type EmployeeTasksByEmployeeId =
    Prisma.EmployeeTaskGetPayload<typeof employeeTasksByEmployeeId>;
export type EmployeeTaskById =
    Prisma.EmployeeTaskGetPayload<typeof employeeTaskById>;