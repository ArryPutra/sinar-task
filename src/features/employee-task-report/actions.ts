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
    const uploadedFilesString = formData.get("uploadedFilesData") as string;
    const filesDocumentClient = uploadedFilesString ? JSON.parse(uploadedFilesString) : [];

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
                    employeeTaskReportStatusId: 1,
                },
                update: {
                    note: formData.get("note") as string,
                    employeeTaskReportStatusId: 1,
                },
            });

            // jika filesDocument tidak kosong
            if (filesDocumentClient.length > 0) {
                for (const fileItem of filesDocumentClient) {
                    const existingDocument = await tx.employeeTaskDocument.findUnique({
                        where: {
                            employeeTaskReportId_employeeTaskDocumentCategoryId: {
                                employeeTaskReportId: taskReport.id,
                                employeeTaskDocumentCategoryId: fileItem.documentCategoryId,
                            },
                        },
                    });

                    if (existingDocument) {
                        await tx.employeeTaskDocument.update({
                            where: { id: existingDocument.id },
                            data: {
                                fileUrls: [
                                    ...existingDocument.fileUrls,
                                    ...fileItem.fileUrls, // Menambahkan URL baru dari Cloudinary
                                ],
                            },
                        });
                    } else {
                        await tx.employeeTaskDocument.create({
                            data: {
                                employeeTaskReportId: taskReport.id,
                                employeeTaskDocumentCategoryId: fileItem.documentCategoryId,
                                fileUrls: fileItem.fileUrls,
                            },
                        });
                    }
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
                const hasAllDocumentComplete = (totalRequiredCategories === uploadedRequiredDocuments);
                await tx.employeeTaskReport.update({
                    where: {
                        id: taskReport.id
                    },
                    data: {
                        employeeTaskReportStatusId: hasAllDocumentComplete ? 2 : 1
                    }
                });
            }
        });

        revalidatePath('/employee/dashboard/${employeeTaskSlug}', 'page');

        return {
            success: true,
            message: `Laporan pekerjaan ${formatDateOnly(selectedDate)} berhasil disubmit!`,
        }
    } catch (error) {
        console.error(error);

        revalidatePath('/employee/dashboard/[employeeTaskSlug]', 'page');

        return {
            success: false,
            message: "Gagal submit laporan pekerjaan, silahkan coba lagi.",
        }
    }
}

export async function removeDocumentFileUrlAction(
    removeFileUrl: string,
    documentId: number
) {
    // 1. Ambil fileUrls dan removedFileUrls saat ini
    const taskDocument = await prisma.employeeTaskDocument.findUnique({
        where: {
            id: documentId,
        },
        select: {
            fileUrls: true,
            removedFileUrls: true, // Tambahkan ini untuk mengambil data yang sudah ada
        },
    });

    if (!taskDocument) {
        throw new Error("Dokumen tidak ditemukan.");
    }

    // 2. Hapus URL dari daftar file aktif
    const updatedFileUrls = taskDocument.fileUrls.filter(
        (url) => url !== removeFileUrl
    );

    // 3. Gabungkan URL yang baru dihapus ke dalam array removedFileUrls yang lama
    // Gunakan fallback [] jika removedFileUrls sebelumnya kosong/null
    const updatedRemovedFileUrls = [
        ...(taskDocument.removedFileUrls || []),
        removeFileUrl
    ];

    // 4. Update database
    await prisma.employeeTaskDocument.update({
        where: {
            id: documentId,
        },
        data: {
            fileUrls: updatedFileUrls,
            removedFileUrls: updatedRemovedFileUrls,
        },
    });

    revalidatePath("/employee/dashboard/[employeeTaskSlug]", "page");
}