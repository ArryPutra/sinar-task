"use server"

import { prisma } from "@/lib/prisma";
import { ActionState } from "@/types/action-state";
import { formatDateOnly, toDatabaseDateTime } from "@/utils/date";
import { revalidatePath } from "next/cache";

export async function submitTaskReportAction(
    taskAssignmentId: string,
    selectedDate: string,
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const uploadedFilesString = JSON.parse(formData.get("uploadedFilesData") as string);
    const reportNote = formData.get("reportNote") as string;
    const activityNote = formData.get("activityNote") as string;

    console.log(reportNote);
    console.log(activityNote);

    try {
        await prisma.$transaction(async (tx) => {
            // upsert laporan pekerjaan
            const taskReport = await tx.employeeTaskReport.upsert({
                where: {
                    employeeTaskAssignmentId_reportDate: {
                        employeeTaskAssignmentId: taskAssignmentId,
                        reportDate: toDatabaseDateTime(
                            selectedDate,
                        ),
                    }
                },
                create: {
                    employeeTaskAssignmentId: taskAssignmentId,
                    reportDate: toDatabaseDateTime(
                        selectedDate,
                    ),
                    note: reportNote.trim(),
                    employeeTaskReportStatusId: 1,
                    submittedAt: new Date(),
                },
                update: {
                    note: reportNote.trim(),
                    submittedAt: new Date(),
                },
                select: {
                    id: true,
                    employeeTaskReportStatusId: true,
                    employeeTaskAssignment: {
                        select: {
                            employee: {
                                select: {
                                    user: {
                                        select: {
                                            id: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            // jika filesDocument tidak kosong
            if (uploadedFilesString.length > 0) {
                for (const fileItem of uploadedFilesString) {
                    // pengecekan data dokumen sesuai input file
                    const existingDocument = await tx.employeeTaskDocument.findUnique({
                        where: {
                            employeeTaskReportId_employeeTaskDocumentCategoryId: {
                                employeeTaskReportId: taskReport.id,
                                employeeTaskDocumentCategoryId: fileItem.documentCategoryId,
                            },
                        },
                    });

                    // jika dokumen tersedia (sudah ada upload sebelumnya)
                    if (existingDocument) {
                        await tx.employeeTaskDocument.update({
                            where: { id: existingDocument.id },
                            data: {
                                fileUrls: [
                                    ...existingDocument.fileUrls,
                                    ...fileItem.fileUrls, // Menambahkan file URL baru
                                ],
                            },
                        });
                    }
                    // jika dokumen belum ada
                    else {
                        await tx.employeeTaskDocument.create({
                            data: {
                                employeeTaskReportId: taskReport.id,
                                employeeTaskDocumentCategoryId: fileItem.documentCategoryId,
                                fileUrls: fileItem.fileUrls,
                            },
                        });
                    }
                }
            }

            // mencegah update laporan jadi ditinjau jika terjadi report disetujui oleh admin
            if (taskReport.employeeTaskReportStatusId !== 4) {
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
                // jika semua dokumen wajib sudah diisi
                const updatedTaskReport = await tx.employeeTaskReport.update({
                    where: {
                        id: taskReport.id
                    },
                    data: {
                        employeeTaskReportStatusId: hasAllDocumentComplete ? 2 : 1
                    },
                    select: {
                        employeeTaskReportStatusId: true
                    }
                });

                if (updatedTaskReport.employeeTaskReportStatusId !== 1) {
                    await tx.employeeTaskReportStatusActivity.create({
                        data: {
                            employeeTaskReportId: taskReport.id,
                            employeeTaskReportStatusId: updatedTaskReport.employeeTaskReportStatusId,
                            note: activityNote.trim(),
                            userId: taskReport.employeeTaskAssignment.employee.user.id
                        }
                    });
                }
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