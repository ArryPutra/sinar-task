"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type DateTimeTextType =
  | "datetime"
  | "date"
  | "time"
  | "timeSeconds"
  | "day"
  | "dayDate"
  | "monthYear"
  | "year";

interface DateTimeTextProps {
  date: Date | string | null | undefined;
  fallback?: string;
  type?: DateTimeTextType;
  className?: string;
}

function formatDate(
  date: Date | string,
  type: DateTimeTextType = "datetime"
) {
  const value = typeof date === "string" ? new Date(date) : date;

  switch (type) {
    case "date":
      return format(value, "dd MMMM yyyy", { locale: id });

    case "time":
      return format(value, "HH:mm", { locale: id });

    case "timeSeconds":
      return format(value, "HH:mm:ss", { locale: id });

    case "day":
      return format(value, "EEEE", { locale: id });

    case "dayDate":
      return format(value, "EEEE, dd MMMM yyyy", { locale: id });

    case "monthYear":
      return format(value, "MMMM yyyy", { locale: id });

    case "year":
      return format(value, "yyyy", { locale: id });

    case "datetime":
    default:
      return format(value, "dd MMMM yyyy HH:mm", { locale: id });
  }
}

export function DateTimeText({
  date,
  fallback = "-",
  type = "datetime",
  className
}: DateTimeTextProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Skeleton className="inline-block h-[1em] w-24 align-middle rounded-sm" />
    );
  }

  return <span className={className}>{date ? formatDate(date, type) : fallback}</span>;
}