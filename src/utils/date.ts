import { BUSINESS_TIMEZONE } from "@/lib/constants";
import { format, parseISO } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { id } from "date-fns/locale";

export const formatDateTime = (date: Date | string | null | undefined): string => {
    if (!date) return "-";

    return format(new Date(date), "EEEE, dd MMMM yyyy HH:mm", { locale: id });
};

export const formatDateOnly = (
    date: Date | string | null | undefined
): string => {
    if (!date) return "-";

    const parsedDate = new Date(date);
    const currentYear = new Date().getFullYear();

    const pattern =
        parsedDate.getFullYear() === currentYear
            ? "EEEE, dd MMMM"
            : "EEEE, dd MMMM yyyy";

    return format(parsedDate, pattern, { locale: id });
};

export const formatToDateLocal = (dateInput: Date | string | null | undefined): string => {
    if (!dateInput) return "";

    const date = new Date(dateInput);

    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);

    return localDate.toISOString().slice(0, 10);
};

export const today = (): string => format(new Date(), "yyyy-MM-dd", { locale: id });

export const formatDateTimeString = (
    date: Date | string | null | undefined
): string => {
    if (!date) return "-";

    const parsedDate = new Date(date);
    const currentYear = new Date().getFullYear();

    const pattern =
        parsedDate.getFullYear() === currentYear
            ? "EEEE, dd MMMM HH:mm"
            : "EEEE, dd MMMM HH:mm yyyy";

    return format(parsedDate, pattern, { locale: id });
};

export const formatDateTimeWitaString = (
    date: Date | string | null | undefined
): string => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    // 1. Dapatkan tahun target dan tahun saat ini dalam zona waktu WITA
    const dateYear = formatInTimeZone(parsedDate, BUSINESS_TIMEZONE, "yyyy");
    const currentYear = formatInTimeZone(new Date(), BUSINESS_TIMEZONE, "yyyy");

    // 2. Tentukan pola format
    const pattern =
        dateYear === currentYear
            ? "EEEE, dd MMMM HH:mm"
            : "EEEE, dd MMMM yyyy HH:mm";

    // 3. Format tanggal menggunakan zona waktu yang ditentukan
    const formattedDate = formatInTimeZone(parsedDate, BUSINESS_TIMEZONE, pattern, {
        locale: id
    });

    return `${formattedDate} WITA`;
};

export const formatDateTimeBusinessTz = (date: Date | string) => {
    if (date instanceof Date) {
        return toZonedTime(date, BUSINESS_TIMEZONE);
    }
    if (typeof date === "string") {
        return toZonedTime(parseISO(date), BUSINESS_TIMEZONE);
    }

    throw new Error("Format tanggal tidak valid. Harus berupa Date atau string ISO.");
}

// export const formatDateTimeBusinessToUtcTz = (date: Date | string) => {
//     if (date instanceof Date) {
//         return 
//     }
//     if (typeof date === "string") {
//     }

//     throw new Error("Format tanggal tidak valid. Harus berupa Date atau string ISO.");
// }