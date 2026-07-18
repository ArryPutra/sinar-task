"use server"

import { uploadStreamToCloudinary } from "@/lib/cloudinary";
import { APP_BUSINESS_TIMEZONE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { ActionState } from "@/types/action-state";
import { formatDateOnly } from "@/utils/date";
import { startOfDay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { revalidatePath } from "next/cache";

export async function submitTaskReportAction(
    taskAssignmentId: string,
    selectedDate: string,
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const documentRequirements = await prisma.employeeTaskDocumentCategory.findMany({
        select: { id: true, slug: true, isRequired: true }
    });

    // array untuk menyimpan file url yang sdh jadi
    const filesArray: {
        fileUrls: string[]
        documentCategoryId: number
        isRequired: boolean
    }[] = [];

    // perulangan untuk tiap inputan file
    for (const documentRequirement of documentRequirements) {
        const files = formData.getAll(documentRequirement.slug) as File[];

        // memastikan setiap file tidak kosong
        if (files[0].size !== 0) {
            // memasukkan setiap file ke cloudinary
            let fileUrls: string[] = [];
            for (const file of files) {
                const uploadResult = await uploadStreamToCloudinary(file, 'task_documents');
                // tampung di variabel fileUrls sementara
                fileUrls.push(uploadResult.secure_url);
            }
            // tambahkan ke filesArray
            filesArray.push({
                fileUrls,
                documentCategoryId: documentRequirement.id,
                isRequired: documentRequirement.isRequired
            })
        }
    }

    try {
        await prisma.$transaction(async (tx) => {
            // upsert laporan pekerjaan
            const taskReport = await prisma.employeeTaskReport.upsert({
                where: {
                    employeeTaskAssignmentId_reportDate: {
                        employeeTaskAssignmentId: taskAssignmentId,
                        reportDate: fromZonedTime(
                            startOfDay(selectedDate),
                            APP_BUSINESS_TIMEZONE
                        ),
                    }
                },
                create: {
                    employeeTaskAssignmentId: taskAssignmentId,
                    reportDate: fromZonedTime(
                        startOfDay(selectedDate),
                        APP_BUSINESS_TIMEZONE
                    ),
                    note: formData.get("note") as string,
                    isDocumentComplete: false,
                    employeeTaskReportStatusId: 1
                },
                update: {
                    note: formData.get("note") as string
                },
            });

            // jika filesArray tidak kosong
            if (filesArray.length > 0) {
                for (const fileItem of filesArray) {
                    await tx.employeeTaskDocument.upsert({
                        where: {
                            employeeTaskReportId_employeeTaskDocumentCategoryId: {
                                employeeTaskReportId: taskReport.id,
                                employeeTaskDocumentCategoryId: fileItem.documentCategoryId,
                            }
                        },
                        create: {
                            employeeTaskReportId: taskReport.id,
                            employeeTaskDocumentCategoryId: fileItem.documentCategoryId,
                            fileUrls: fileItem.fileUrls
                        },
                        update: {
                            fileUrls: fileItem.fileUrls
                        },
                    });
                }

                // cek apakah semua dokumen wajib sudah diupload
                const totalRequiredCategories = await tx.employeeTaskDocumentCategory.count({
                    where: { isRequired: true }
                });
                const uploadedRequiredDocuments = await tx.employeeTaskDocument.count({
                    where: {
                        employeeTaskReportId: taskReport.id,
                        employeeTaskDocumentCategory: {
                            isRequired: true
                        },
                        NOT: {
                            fileUrls: {
                                isEmpty: true
                            }
                        }
                    }
                });
                const isDocumentComplete = (totalRequiredCategories === uploadedRequiredDocuments);
                await tx.employeeTaskReport.update({
                    where: {
                        id: taskReport.id
                    },
                    data: {
                        isDocumentComplete: isDocumentComplete
                    }
                });
            }
        });

        revalidatePath('/employee/dashboard/[employeeTaskSlug]', 'page');

        return {
            success: true,
            message: `Laporan pekerjaan ${formatDateOnly(selectedDate)} berhasil disubmit!`,
        }
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Gagal submit laporan pekerjaan.",
        }
    }
}