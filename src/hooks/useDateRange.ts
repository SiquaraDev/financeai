"use client";

import { useState, useCallback } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { getDateRange, formatPeriodLabel } from "@/utils/dateRange";
import type { DateFilterKey, DateRange } from "@/types";
interface UseDateRangeOptions {
    initialFilter?: DateFilterKey;
}

interface UseDateRangeReturn {
    activeFilter: DateFilterKey;
    customStart: string;
    customEnd: string;
    range: DateRange;
    periodLabel: string;
    setActiveFilter: (key: DateFilterKey) => void;
    setCustomStart: (v: string) => void;
    setCustomEnd: (v: string) => void;
}

export function useDateRange(
    options: UseDateRangeOptions = {},
): UseDateRangeReturn {
    const { initialFilter = "this_month" } = options;

    const [activeFilter, setActiveFilter] =
        useState<DateFilterKey>(initialFilter);
    const [customStart, setCustomStart] = useState(
        format(startOfMonth(new Date()), "yyyy-MM-dd"),
    );
    const [customEnd, setCustomEnd] = useState(
        format(endOfMonth(new Date()), "yyyy-MM-dd"),
    );

    const range = getDateRange(activeFilter, customStart, customEnd);
    const periodLabel = formatPeriodLabel(activeFilter, range);

    const handleFilterChange = useCallback((key: DateFilterKey) => {
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
