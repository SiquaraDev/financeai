"use client";

import { useState, useCallback, useMemo } from "react";
import type { SortState, SortDirection } from "@/types";

interface UseSortReturn<T extends string> {
    sortColumn: T | null;
    sortDirection: SortDirection;
    sortState: SortState<T>;
    handleSort: (col: T) => void;
    getSortedItems: <I>(
        items: I[],
        getKey: (item: I) => string | number,
    ) => I[];
}

export function useSort<T extends string>(
    initialColumn: T | null = null,
    initialDirection: SortDirection = "asc",
): UseSortReturn<T> {
    const [sortColumn, setSortColumn] = useState<T | null>(initialColumn);
    const [sortDirection, setSortDirection] =
        useState<SortDirection>(initialDirection);

    const sortState = useMemo<SortState<T>>(
        () => ({ column: sortColumn, direction: sortDirection }),
        [sortColumn, sortDirection],
    );

    const handleSort = useCallback((col: T) => {
        setSortColumn((prev) => {
            if (prev === col) {
                setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
                return col;
            }
            setSortDirection("asc");
            return col;
        });
    }, []);

    const getSortedItems = useCallback(
        <I>(items: I[], getKey: (item: I) => string | number): I[] => {
            if (!sortColumn) return items;
            return [...items].sort((a, b) => {
                const va = getKey(a);
                const vb = getKey(b);
                if (va < vb) return sortDirection === "asc" ? -1 : 1;
                if (va > vb) return sortDirection === "asc" ? 1 : -1;
                return 0;
            });
        },
        [sortColumn, sortDirection],
    );

    return { sortColumn, sortDirection, sortState, handleSort, getSortedItems };
}
