"use client"

import { useEffect, useRef } from "react";
import DateReport from "./date";
import { format, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { formatDateTimeBusinessTz } from "@/utils/date";

export default function DateReportList({
    selectedDateString,
    dates,
    taskReports
}: {
    selectedDateString: string
    dates: Date[]
    taskReports: {
        reportDate: Date
        employeeTaskReportStatus: {
            name: string
            icon: string
            colorHex: string
        }
    }[] | null
}) {

    const selectedDateCardDRef = useRef<HTMLButtonElement | null>(null);
    useEffect(() => {
        selectedDateCardDRef.current?.scrollIntoView({
            behavior: "smooth",
            inline: "center", // center, start, atau nearest
            block: "nearest",
        });
    }, [selectedDateString]);

    return (
        <div className="flex flex-wrap gap-3 max-lg:flex-nowrap max-lg:overflow-x-scroll max-lg:-mx-4 max-lg:pl-4">
            {
                dates.map((date, index) => {
                    const report = taskReports?.find(report => isSameDay(formatDateTimeBusinessTz(report.reportDate), date));
                    const selected = isSameDay(date, selectedDateString);

                    return (
                        <DateReport
                            key={index}
                            ref={selected ? selectedDateCardDRef : null}
                            date={{
                                name: format(date, "yyyy-MM-dd"),
                                dayName: format(date, "EEEE", { locale: id }),
                                dayMonth: format(date, "d MMMM", { locale: id })
                            }}
                            isSelected={selected}
                            report={{
                                status: report?.employeeTaskReportStatus.name ?? "Belum Dikerjakan",
                                icon: report?.employeeTaskReportStatus?.icon ?? "CircleDashed",
                                colorHex: report?.employeeTaskReportStatus?.colorHex ?? "black",
                            }} />
                    )
                })
            }
        </div>
    )
}
