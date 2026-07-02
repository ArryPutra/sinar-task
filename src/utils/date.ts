import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz"; // <--- Import ini
import { id } from "date-fns/locale";

// Tentukan zona waktu target aplikasi kamu (misal Asia/Makassar untuk WITA atau Asia/Jakarta untuk WIB)
const TIMEZONE = "Asia/Makassar";

export const formatDateTime = (date: Date | string | null | undefined): string => {
    if (!date) return "-";

    // Paksa tanggal konversi ke zona waktu WITA/WIB terlebih dahulu, siapapun servernya
    const zonedDate = toZonedTime(new Date(date), TIMEZONE);

    return format(zonedDate, "dd MMMM yyyy HH:mm", { locale: id });
};

export const formatToDatetimeLocal = (dateInput: Date | string | null | undefined): string => {
    if (!dateInput) return "";

    // Paksa konversi ke zona waktu WITA/WIB
    const zonedDate = toZonedTime(new Date(dateInput), TIMEZONE);

    // Format manual ke YYYY-MM-DDTHH:mm yang aman dari gangguan timezone server
    return format(zonedDate, "yyyy-MM-dd'T'HH:mm");
};