import { fromZonedTime } from "date-fns-tz";
import { z } from "zod";

const TIME_ZONE = "Asia/Makassar";

const zonedDateSchema = z.preprocess((value) => {
  if (typeof value !== "string" || value.trim() === "") {
    return value;
  }

  return fromZonedTime(value, TIME_ZONE);
}, z.date());

export const formEmployeeTaskSchema = z.object({
  employeeTaskCategoryId: z.coerce.number().min(1, "Kategori tugas karyawan harus dipilih."),
  title: z.string().min(1, "Title harus diisi."),
  description: z.string(),

  startAt: zonedDateSchema,
  dueAt: zonedDateSchema,

  latitude: z.coerce.number()
    .min(-90, "Latitude harus lebih besar dari -90.")
    .max(90, "Latitude harus kurang dari 90."),

  longitude: z.coerce.number()
    .min(-180, "Longitude harus lebih besar dari -180.")
    .max(180, "Longitude harus kurang dari 180."),

  locationName: z.string().min(1, "Nama lokasi harus diisi."),
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