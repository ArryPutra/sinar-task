"use server"

import { Prisma } from "@/generated/prisma/client";
import { uploadStreamToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { ActionState } from "@/types/action-state";
import { startOfDay } from "date-fns";
import { getCurrentEmployee } from "../employee/action";
import { getAllEmployeeTaskAssignmentQuery, getEmployeeTaskAssignmentsByEmployeeIdActionQuery } from "./queris";

export async function getAllEmployeeTaskAssignment({
    page = 1,
    search = "",
}: {
    page: number
    search?: string
}) {
    try {
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const where: Prisma.EmployeeTaskAssignmentWhereInput = {
            ...(search && {
                OR: [
                    {
                        employee: {
                            user: {
                                name: {
                                    contains: search,
                                    mode: "insensitive",
                                }
                            }
                        }
                    }
                ],
            }),
        };

        const [data, totalCount] = await Promise.all([
            prisma.employeeTaskAssignment.findMany({
                where,
                orderBy: {
                    employeeTask: {
                        createdAt: "desc"
                    }
                },
                skip,
                take: pageSize,
                ...getAllEmployeeTaskAssignmentQuery
            }),
            prisma.employeeTaskAssignment.count({ where })
        ]);

        return {
            success: true,
            error: null,
            data,
            totalCount,
        };
    } catch (error) {
        console.error(error);

        return {
            error: "Gagal mengambil daftar penugasan pekerjaan karyawan.",
            success: false,
            data: [],
            totalCount: 0
        };
    }
}

export async function getEmployeeTaskAssignmentsByEmployeeIdAction(employeeId: string) {
    try {
        const employeeTaskAssignmentsResponse = await prisma.employeeTaskAssignment.findMany({
            where: {
                employeeId: employeeId
            },
            orderBy: {
                createdAt: "desc"
            },
            ...getEmployeeTaskAssignmentsByEmployeeIdActionQuery
        });

        return employeeTaskAssignmentsResponse;
    } catch (error) {
        console.error(error);

        return [];
    }
}

// export async function submitEmployeeTaskAssignmentAction(
//     employeeTaskId: string,
//     prevState: ActionState,
//     formData: FormData
// ): Promise<ActionState> {
//     const listDocument = await prisma.employeeTaskDocumentCategory.findMany({
//         select: {
//             id: true,
//             name: true,
//             slug: true,
//             isRequired: true
//         }
//     });

//     const files: {
//         file: File;
//         employeeTaksDocumentCategoryId: number;
//     }[] = [];

//     for (const documentRequired of listDocument) {
//         const file = formData.get(documentRequired.slug) as File;

//         if (file.size !== 0) {
//             files.push({
//                 file,
//                 employeeTaksDocumentCategoryId: documentRequired.id
//             });
//         }
//     }

//     try {
//         const uploadedFiles = await Promise.all(
//             files.map(async (file) => {
//                 const uploaded = await uploadStreamToCloudinary(
//                     file.file,
//                     "employee_task_documents"
//                 );

//                 return {
//                     employeeTaskDocumentCategoryId: file.employeeTaksDocumentCategoryId,
//                     fileUrl: uploaded.secure_url,
//                 };
//             })
//         );

//         await prisma.$transaction(async (tx) => {
//             const employeeTaskAssignmentId = await tx.employeeTaskAssignment.create({
//                 data: {
//                     employeeTaskId: employeeTaskId,
//                     employeeId: (await getCurrentEmployee()).data?.id!,
//                     note: formData.get("note") as string || null,
//                     submittedAt: new Date()
//                 }
//             });

//             await tx.employeeTaskDocument.createMany({
//                 data: uploadedFiles.map((file) => ({
//                     employeeTaskAssignmentId: employeeTaskAssignmentId.id,
//                     employeeTaskDocumentCategoryId: file.employeeTaskDocumentCategoryId,
//                     fileUrls: [file.fileUrl],
//                 })),
//             });
//         });

//         return {
//             error: null,
//             success: true
//         }
//     } catch (error) {
//         console.error(error);

//         return {
//             error: null,
//             success: false
//         }
//     }
// }

// export async function submitEmployeeTaskAssignmentAction(
//     id: string,
//     prevState: ActionState,
//     formData: FormData
// ) {
//     const validatedFields = submitEmployeeTaskAssignmentActionSchema.safeParse(
//         Object.fromEntries(formData.entries())
//     );

//     if (!validatedFields.success) {
//         return {
//             error: validatedFields.error?.message,
//             success: false,
//             message: "Validasi gagal. Silakan periksa kembali input Anda.",
//             fields: Object.fromEntries(formData.entries()),
//             fieldErrors: validatedFields.error?.flatten().fieldErrors
//         };
//     }

//     // Memastikan bahwa taskAssigment adalah milik karyawan yang sedang login
//     const taskAssignment = await prisma.employeeTaskAssignment.findUnique({
//         where: {
//             id: id
//         },
//         include: {
//             employeeTask: {
//                 select: {
//                     employeeTaskStatusId: true
//                 }
//             }
//         }
//     });
//     if (!taskAssignment) {
//         return {
//             error: "Pekerjaan tidak ditemukan atau tidak dimiliki oleh karyawan ini.",
//             success: false,
//             message: "Pekerjaan tidak ditemukan atau tidak dimiliki oleh karyawan ini.",
//             fields: Object.fromEntries(formData.entries()),
//             fieldErrors: null
//         };
//     }

//     const files = formData.getAll("fileUrls") as File[];

//     // Memastikan bahwa setidaknya ada satu file yang diunggah
//     if (files[0].size === 0 && taskAssignment.fileUrls.length === 0) {
//         return {
//             error: "Lampiran harus diunggah.",
//             success: false,
//             message: "Lampiran harus diunggah.",
//             fields: Object.fromEntries(formData.entries()),
//             fieldErrors: {
//                 fileUrls: ["Lampiran harus diunggah."]
//             }
//         };
//     }

//     // Memastikan bahwa status taskAssignment tidak boleh sama dengan 3 (selesai)
//     if (taskAssignment.employeeTaskAssignmentStatusId === 4) {
//         return {
//             error: "Pekerjaan sudah selesai dan tidak dapat diubah.",
//             success: false,
//             message: "Pekerjaan sudah selesai dan tidak dapat diubah.",
//             fields: Object.fromEntries(formData.entries()),
//             fieldErrors: null
//         };
//     }

//     // Memastikan bahwa status task tidak boleh ditutup 3 (ditutup)
//     if (taskAssignment.employeeTask.employeeTaskStatusId === 3) {
//         return {
//             error: "Pekerjaan sudah ditutup dan tidak dapat dikumpulkan.",
//             success: false,
//             message: "Pekerjaan sudah ditutup dan tidak dapat dikumpulkan.",
//             fields: Object.fromEntries(formData.entries()),
//             fieldErrors: null
//         };
//     }

//     const uploadedUrls: string[] = [];

//     try {
//         for (const file of files) {
//             if (file.size === 0) continue;
//             const uploadResult = await uploadStreamToCloudinary(file, 'employee_task_assignments');
//             if (uploadResult.secure_url) {
//                 uploadedUrls.push(uploadResult.secure_url);
//             }
//         }

//         await prisma.employeeTaskAssignment.update({
//             where: {
//                 id: id
//             },
//             data: {
//                 note: validatedFields.data.note,
//                 fileUrls: uploadedUrls,
//                 employeeTaskAssignmentStatusId: 2
//             }
//         });

//         revalidatePath(`/employee/dashboard`);

//         // menghapus file lama dari Cloudinary jika ada
//         for (const oldFileUrl of taskAssignment?.fileUrls || []) {
//             await deleteFileFromCloudinary(oldFileUrl);
//         }

//         return {
//             error: null,
//             success: true,
//             message: "Pekerjaan berhasil dikumpulkan!"
//         }
//     } catch (error) {
//         console.error(error);

//         for (const url of uploadedUrls) {
//             await deleteFileFromCloudinary(url);
//         }

//         return {
//             error: "Gagal mengirimkan penugasan pekerjaan karyawan.",
//             success: false,
//             message: "Terjadi kesalahan saat mengirimkan penugasan pekerjaan karyawan. Silakan coba lagi.",
//             fields: Object.fromEntries(formData.entries()),
//             fieldErrors: null
//         };
//     }
// }

// export async function updateEmployeeTaskAssignmentStatusAction(
//     id: string,
//     prevState: ActionState,
//     formData: FormData
// ): Promise<ActionState> {
//     const employeeTaskAssignmentStatusId = Number(formData.get("employeeTaskAssignmentStatusId"));

//     try {
//         await prisma.employeeTaskAssignment.update({
//             where: {
//                 id: id
//             },
//             data: {
//                 employeeTaskAssignmentStatusId: employeeTaskAssignmentStatusId
//             }
//         });

//         revalidatePath(`/admin/employee-tasks/${id}`);

//         return {
//             error: null,
//             success: true,
//             message: "Status pekerjaan berhasil diperbarui!"
//         }
//     }
//     catch (error) {
//         console.error(error);

//         return {
//             error: "Gagal memperbarui status pekerjaan.",
//             success: false,
//             message: "Terjadi kesalahan saat memperbarui status pekerjaan. Silakan coba lagi."
//         };
//     }
// }