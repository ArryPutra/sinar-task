"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

interface DropdownSelectProps {
    queryKey: string;
    placeholder: string;
    label: string;
    items: {
        value: string | number;
        label: string;
    }[];
    showAll?: boolean;
    allLabel?: string;
}

export default function DropdownSelect({
    queryKey,
    placeholder,
    label,
    items,
    showAll = true,
    allLabel = "Semua",
}: DropdownSelectProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const value = searchParams.get(queryKey) ?? "";

    function handleChange(value: string) {
        const params = new URLSearchParams(searchParams);

        if (value === "0") {
            params.delete(queryKey);
        } else {
            params.set(queryKey, value);
        }

        params.set("page", "1");

        router.push(`?${params.toString()}`);
    }

    return (
        <Select
            value={value}
            onValueChange={handleChange}>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>

                    {showAll && value !== "" && (
                        <SelectItem value="0">
                            {allLabel}
                        </SelectItem>
                    )}

                    {items.map((item) => (
                        <SelectItem
                            key={item.value}
                            value={item.value.toString()}
                        >
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}