import z from "zod";

export const createEmployeeSchema = z.object({
    name: z.string().min(1, "Nama karyawan harus diisi."),
    email: z.string().email("Email tidak valid."),
    nomorTelepon: z.string().min(1, "Nomor telepon harus diisi."),
    password: z.string().min(6, "Password harus memiliki minimal 6 karakter.")
});

export const updateEmployeeSchema = z.object({
    name: z.string().min(1, "Nama karyawan harus diisi."),
    email: z.string().email("Email tidak valid."),
    nomorTelepon: z.string().min(1, "Nomor telepon harus diisi."),
    password: z.preprocess(
        (value) => value === "" ? undefined : value,
        z.string().min(6, "Password harus memiliki minimal 6 karakter.").optional()
    ),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;