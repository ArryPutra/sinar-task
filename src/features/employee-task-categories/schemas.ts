import z from "zod";

export const formEmployeeTaskCategorySchema = z.object({
    name: z.string().min(1, "Nama kategori harus diisi."),
    description: z.string().optional()
});

export type CreateEmployeeTaskCategoryInput = z.infer<typeof formEmployeeTaskCategorySchema>;