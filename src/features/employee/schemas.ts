import z from "zod";

export const createEmployeeSchema = z.object({
    name: z.string().trim().min(1, "Nama karyawan harus diisi."),
    email: z.string().email("Email tidak valid."),
    phoneNumber: z
        .string()
        .min(10, "Nomor telepon minimal 10 digit.")
        .max(13, "Nomor telepon maksimal 13 digit.")
        .regex(
            /^08\d+$/,
            "Nomor telepon harus diawali 08 dan hanya boleh berisi angka."
        ),
    password: z.string().trim().min(6, "Password harus memiliki minimal 6 karakter.")
});

export const updateEmployeeSchema = z.object({
    name: z.string().min(1, "Nama karyawan harus diisi."),
    email: z.string().email("Email tidak valid."),
    phoneNumber: z
        .string()
        .min(10, "Nomor telepon minimal 10 digit.")
        .max(13, "Nomor telepon maksimal 13 digit.")
        .regex(
            /^08\d+$/,
            "Nomor telepon harus diawali 08 dan hanya boleh berisi angka."
        ),
    newPassword: z.preprocess(
        (value) => value === "" ? undefined : value,
        z.string().min(6, "Password harus memiliki minimal 6 karakter.").trim().optional()
    ),
});

export const createSelfEmployeeSchema = z.object({
    name: z.string().min(1, "Nama karyawan harus diisi."),
    phoneNumber: z
        .string()
        .min(10, "Nomor telepon minimal 10 digit.")
        .max(13, "Nomor telepon maksimal 13 digit.")
        .regex(
            /^08\d+$/,
            "Nomor telepon harus diawali 08 dan hanya boleh berisi angka."
        ),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type CreateSelfEmployeeInput = z.infer<typeof createSelfEmployeeSchema>;