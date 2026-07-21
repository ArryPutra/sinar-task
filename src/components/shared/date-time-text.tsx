"use client"

import { formatDateTimeString } from "@/utils/date";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export function DateTimeText({
    date,
    fallback = "-"
}: {
    date: Date | string | null | undefined;
    fallback?: string;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <Skeleton className="inline-block h-[1em] w-24 align-middle rounded-sm" />;
    }

    return <span>{date ? formatDateTimeString(date) : fallback}</span>;
}