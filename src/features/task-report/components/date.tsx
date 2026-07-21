"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as Icons from 'lucide-react';
import { LucideIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

export default function DateReport({
    date,
    isSelected,
    report
}: {
    date: {
        name: string
        dayName: string,
        dayMonth: string,
    }
    isSelected: boolean,
    report: {
        status: string
        icon: string
        colorHex: string
    }
}) {
    const Icon = (Icons[report.icon as keyof typeof Icons] ?? Icons.CircleDashed) as LucideIcon;

    const router = useRouter();
    const searchParams = useSearchParams();

    const handleClick = () => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("date", date.name);
        router.push(`?${params.toString()}`);
    };

    return (
        <Button
            onClick={handleClick}
            variant="outline"
            className={cn("flex flex-col h-fit p-4 items-start gap-2 min-w-32 cursor-pointer",
                !isSelected && "opacity-50 bg-transparent border-none hover:opacity-75",
            )}>
            <div className="flex justify-between w-full">
                <span className="text-xs font-medium uppercase text-muted-foreground">
                    {date.dayName}
                </span>
                <Icon />
            </div>

            <span className="text-lg font-bold">
                {date.dayMonth}
            </span>

            <Badge style={{ backgroundColor: report.colorHex, color: "white" }}>
                {report?.status}
            </Badge>
        </Button>
    )
}
