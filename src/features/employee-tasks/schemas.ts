import z from "zod";

export const formEmployeeTaskSchema = z.object({
    employeeTaskCategoryId: z.coerce.number().min(1, "Kategori tugas karyawan harus dipilih."),
    title: z.string().min(1, "Title harus diisi."),
    description: z.string(),
    startAt: z.coerce.date("Tanggal mulai harus diisi."),
    dueAt: z.coerce.date("Tanggal jatuh tempo harus diisi.")
}).superRefine((data, ctx) => {
    if (data.dueAt < data.startAt) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Tanggal mulai tidak boleh melebihi tanggal jatuh tempo.",
            path: ["startAt"],
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Tanggal jatuh tempo tidak boleh kurang dari tanggal mulai.",
            path: ["dueAt"],
        });
    }
});

export type CreateEmployeeTaskInput = z.infer<typeof formEmployeeTaskSchema>;