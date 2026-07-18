import { Prisma } from "@/generated/prisma/client";

export const taskCardDetailQuery = {
    select: {
        title: true,
        startAt: true,
        dueAt: true,
        locationName: true,
        fileUrls: true,
        slug: true,
        description: true,
        admin: {
            select: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        },
        employeeTaskCategory: {
            select: {
                name: true,
            }
        },
        employeeTaskStatus: {
            select: {
                name: true,
                colorHex: true
            }
        }
    }
} satisfies Prisma.EmployeeTaskDefaultArgs

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

export type TaskCardDetailQuery =
    Prisma.EmployeeTaskGetPayload<typeof taskCardDetailQuery>;
export type EmployeeTasksByEmployeeId =
    Prisma.EmployeeTaskGetPayload<typeof employeeTasksByEmployeeId>;
export type EmployeeTaskById =
    Prisma.EmployeeTaskGetPayload<typeof employeeTaskById>;