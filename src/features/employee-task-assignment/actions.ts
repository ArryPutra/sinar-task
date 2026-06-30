"use server"

import { prisma } from "@/lib/prisma";

export async function getEmployeeTaskAssignments(employeeId: string) {
    try {
        const response = await prisma.employeeTaskAssignment.findMany({
            where: {
                employeeId: employeeId
            }
        });

        console.log(response)

        return {
            error: false,
            success: true,
            data: response
        }
    } catch (error) {
        console.error(error);

        return {
            error: true,
            success: false,
            data: null
        }
    }
}