import { format } from "date-fns";
import { id } from "date-fns/locale";

export const formatDateTime = (date: Date | string | null | undefined): string => {
    if (!date) return "-";

    return format(new Date(date), "dd MMMM yyyy HH:mm", { locale: id });
};

export const formatToDatetimeLocal = (dateInput: Date | string | null | undefined): string => {
    if (!dateInput) return "";

    const date = new Date(dateInput);

    // Geser waktu sesuai zona waktu lokal agar jamnya tidak berubah (misal WIB/WITA)
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);

    // Mengambil format YYYY-MM-DDTHH:mm
    return localDate.toISOString().slice(0, 16);
};