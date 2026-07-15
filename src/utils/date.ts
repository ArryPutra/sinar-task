import { format } from "date-fns";
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