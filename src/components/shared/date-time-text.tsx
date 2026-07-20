"use client"

import { formatDateTimeString } from "@/utils/date";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export function DateTimeText({
    date,
}: {
    date: Date | string | null | undefined;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <Skeleton className="inline-block h-[1em] w-24 align-middle rounded-sm" />;
    }

    return <span>{formatDateTimeString(date)}</span>;
}