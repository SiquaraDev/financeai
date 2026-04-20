"use client";

import { useState, useCallback } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    subMonths,
    startOfYear,
    endOfYear,
    subYears,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export type FilterKey =
    | "all"
    | "this_month"
    | "last_month"
    | "3_months"
    | "6_months"
    | "this_year"
    | "last_year"
    | "custom";

export interface DateRange {
    start: Date | null;
    end: Date | null;
}

export function getDateRange(
    filter: FilterKey,
    customStart?: string,
    customEnd?: string,
): DateRange {
    const now = new Date();

    const startOf = (d: Date) => {
        const s = startOfMonth(d);
        s.setHours(0, 0, 0, 0);
        return s;
    };
    const endOf = (d: Date) => {
        const e = endOfMonth(d);
        e.setHours(23, 59, 59, 999);
        return e;
    };

    switch (filter) {
        case "all":
            return { start: null, end: null };
        case "this_month":
            return { start: startOf(now), end: endOf(now) };
        case "last_month": {
            const l = subMonths(now, 1);
            return { start: startOf(l), end: endOf(l) };
        }
        case "3_months":
            return { start: startOf(subMonths(now, 2)), end: endOf(now) };
        case "6_months":
            return { start: startOf(subMonths(now, 5)), end: endOf(now) };
        case "this_year": {
            const s = startOfYear(now);
            s.setHours(0, 0, 0, 0);
            const e = endOfYear(now);
            e.setHours(23, 59, 59, 999);
            return { start: s, end: e };
        }
        case "last_year": {
            const ly = subYears(now, 1);
            const s = startOfYear(ly);
            s.setHours(0, 0, 0, 0);
            const e = endOfYear(ly);
            e.setHours(23, 59, 59, 999);
            return { start: s, end: e };
        }
        case "custom": {
            const parse = (str: string, isEnd = false) => {
                const [y, m, d] = str.split("-").map(Number);
                const dt = new Date(y, m - 1, d);
                isEnd ? dt.setHours(23, 59, 59, 999) : dt.setHours(0, 0, 0, 0);
                return dt;
            };
            return {
                start: customStart ? parse(customStart) : startOf(now),
                end: customEnd ? parse(customEnd, true) : endOf(now),
            };
        }
        default:
            return { start: null, end: null };
    }
}

export function formatPeriodLabel(filter: FilterKey, range: DateRange): string {
    if (filter === "all") return "Todos os períodos";
    if (filter === "this_month")
        return format(new Date(), "MMMM 'de' yyyy", { locale: ptBR });
    if (range.start && range.end)
        return `${format(range.start, "dd/MM/yyyy")} – ${format(range.end, "dd/MM/yyyy")}`;
    return "Todos os períodos";
}

export function toLocalISO(d: Date): string {
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

interface UseDateRangeOptions {
    initialFilter?: FilterKey;
}

interface UseDateRangeReturn {
    activeFilter: FilterKey;
    customStart: string;
    customEnd: string;
    range: DateRange;
    periodLabel: string;
    setActiveFilter: (key: FilterKey) => void;
    setCustomStart: (v: string) => void;
    setCustomEnd: (v: string) => void;
}

export function useDateRange(
    options: UseDateRangeOptions = {},
): UseDateRangeReturn {
    const { initialFilter = "this_month" } = options;

    const [activeFilter, setActiveFilter] = useState<FilterKey>(initialFilter);
    const [customStart, setCustomStart] = useState(
        format(startOfMonth(new Date()), "yyyy-MM-dd"),
    );
    const [customEnd, setCustomEnd] = useState(
        format(endOfMonth(new Date()), "yyyy-MM-dd"),
    );

    const range = getDateRange(activeFilter, customStart, customEnd);
    const periodLabel = formatPeriodLabel(activeFilter, range);

    const handleFilterChange = useCallback((key: FilterKey) => {
        setActiveFilter(key);
    }, []);

    return {
        activeFilter,
        customStart,
        customEnd,
        range,
        periodLabel,
        setActiveFilter: handleFilterChange,
        setCustomStart,
        setCustomEnd,
    };
}
