"use server";

import { prisma } from "@/lib/prisma";
import { ActionState } from "@/types/action-state";
import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "../auth/actions";

export async function createReportStatusActivityAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const taskReportId = Number(formData.get("taskReportId"));
    const taskReportStatusId = Number(formData.get("taskReportStatusId"));
    const note = formData.get("note") as string;

    console.log(taskReportStatusId)

    if (!taskReportStatusId) {
        return {
            success: false,
            fieldErrors: {
                taskReportStatusId: ["Status laporan harus dipilih."]
            }
        }
    }

    const adminResponse = await getCurrentAdmin();
    const admin = adminResponse.data;
    if (!admin) {
        throw new Error("Data admin tidak ditemukan");
    }

    try {
        await prisma.$transaction(async (tx) => {
            await tx.employeeTaskReport.update({
                where: {
                    id: taskReportId
                },
                data: {
                    employeeTaskReportStatusId: taskReportStatusId
                }
            });

            await tx.employeeTaskReportStatusActivity.create({
                data: {
                    employeeTaskReportId: taskReportId,
                    employeeTaskReportStatusId: taskReportStatusId,
                    userId: admin.userId,
                    note: note.trim(),
                }
            });
        });

        revalidatePath(`/admin/employee-tasks/${taskReportId}`);

        return {
            success: true,
            message: "Status laporan berhasil dibuat!"
        }
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Terjadi kesalahan saat membuat status laporan."
        }
    }
}