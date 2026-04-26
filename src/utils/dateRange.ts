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
import type { DateFilterKey, DateRange, AiShortcut } from "@/types";

// DateRange and AiShortcut live in @/types — imported, not redefined.

export function getDateRange(
    filter: DateFilterKey,
    customStart?: string,
    customEnd?: string,
): DateRange {
    const now = new Date();

    const startOf = (d: Date): Date => {
        const s = startOfMonth(d);
        s.setHours(0, 0, 0, 0);
        return s;
    };

    const endOf = (d: Date): Date => {
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
            const last = subMonths(now, 1);
            return { start: startOf(last), end: endOf(last) };
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
            const parse = (str: string, isEnd = false): Date => {
                const [y, m, d] = str.split("-").map(Number);
                const dt = new Date(y, m - 1, d);
                isEnd
                    ? dt.setHours(23, 59, 59, 999)
                    : dt.setHours(0, 0, 0, 0);
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

export function formatPeriodLabel(
    filter: DateFilterKey,
    range: DateRange,
): string {
    if (filter === "all") return "Todos os períodos";
    if (filter === "this_month")
        return format(new Date(), "MMMM 'de' yyyy", { locale: ptBR });
    if (range.start && range.end) {
        return `${format(range.start, "dd/MM/yyyy")} – ${format(range.end, "dd/MM/yyyy")}`;
    }
    return "Todos os períodos";
}

export function toLocalISO(d: Date): string {
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export function dateRangeToParams(
    range: DateRange,
): Record<string, string | undefined> {
    return {
        start: range.start ? toLocalISO(range.start) : undefined,
        end: range.end ? toLocalISO(range.end) : undefined,
    };
}

export function applyAiShortcut(shortcut: AiShortcut): {
    start: string;
    end: string;
} {
    const now = new Date();
    const fmt = (d: Date) => format(d, "yyyy-MM-dd");

    switch (shortcut) {
        case "last_month":
            return {
                start: fmt(startOfMonth(subMonths(now, 1))),
                end: fmt(endOfMonth(subMonths(now, 1))),
            };
        case "3_months":
            return {
                start: fmt(startOfMonth(subMonths(now, 2))),
                end: fmt(endOfMonth(now)),
            };
        case "6_months":
            return {
                start: fmt(startOfMonth(subMonths(now, 5))),
                end: fmt(endOfMonth(now)),
            };
        case "year":
            return {
                start: fmt(startOfMonth(subMonths(now, 11))),
                end: fmt(endOfMonth(now)),
            };
    }
}
