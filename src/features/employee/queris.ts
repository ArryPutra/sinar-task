import { Prisma } from "@/generated/prisma/client";

export const employeeWithUser = {
    include: {
        user: {
            select: {
                id: true,
                name: true,
                email: true,
            },
        },
    },
} satisfies Prisma.EmployeeDefaultArgs;

export const employeeWithUserAndTask = {
    include: {
        user: {
            select: {
                id: true,
                name: true,
                email: true,
            },
        },
        employeeTaskAssignment: {
            include: {
                employeeTaskAssignmentStatus: {
                    select: {
                        name: true,
                        colorHex: true
                    }
                },
                employeeTask: {
                    select: {
                        id: true,
                        title: true,
                        employeeTaskCategory: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        },
    },
} satisfies Prisma.EmployeeDefaultArgs;

export type EmployeeWithUserAndTask =
    Prisma.EmployeeGetPayload<typeof employeeWithUserAndTask>;

export type EmployeeWithUser =
    Prisma.EmployeeGetPayload<typeof employeeWithUser>;