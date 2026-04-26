"use client";

import { useCallback } from "react";
import {
    formatCurrency,
    formatCurrencyCompact,
    formatCurrencyWithSign,
} from "@/utils";

export function useFormatCurrency() {
    const format = useCallback((value: number) => formatCurrency(value), []);
    const compact = useCallback(
        (value: number) => formatCurrencyCompact(value),
        [],
    );
    const withSign = useCallback(
        (value: number) => formatCurrencyWithSign(value),
        [],
    );

    return { format, compact, withSign };
}
