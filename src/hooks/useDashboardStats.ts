"use client";

import { useState, useEffect, useCallback } from "react";
import { toLocalISO, type FilterKey } from "./useDateRange";
import { getDateRange } from "./useDateRange";

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
    date: string;
    description?: string;
    source?: string;
}

export interface DashboardStats {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    byCategory: Record<string, number>;
    recent: Transaction[];
}

interface UseDashboardStatsParams {
    activeFilter: FilterKey;
    customStart: string;
    customEnd: string;
}

interface UseDashboardStatsReturn {
    stats: DashboardStats | null;
    loading: boolean;
    refetch: () => void;
}

export function useDashboardStats({
    activeFilter,
    customStart,
    customEnd,
}: UseDashboardStatsParams): UseDashboardStatsReturn {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        setLoading(true);

        const { start, end } = getDateRange(
            activeFilter,
            customStart,
            customEnd,
        );
        const startParam = start ? `&start=${toLocalISO(start)}` : "";
        const endParam = end ? `&end=${toLocalISO(end)}` : "";

        try {
            const res = await fetch(
                `/api/transactions?limit=200${startParam}${endParam}`,
            );
            const data = await res.json();
            const txs: Transaction[] = data.transactions ?? [];

            const totalIncome = txs
                .filter((t) => t.type === "INCOME")
                .reduce((s, t) => s + Number(t.amount), 0);

            const totalExpense = txs
                .filter((t) => t.type === "EXPENSE")
                .reduce((s, t) => s + Number(t.amount), 0);

            const byCategory = txs
                .filter((t) => t.type === "EXPENSE")
                .reduce<Record<string, number>>((acc, t) => {
                    acc[t.category] = (acc[t.category] ?? 0) + Number(t.amount);
                    return acc;
                }, {});

            const recent = [...txs]
                .sort(
                    (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                .slice(0, 5);

            setStats({
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                byCategory,
                recent,
            });
        } catch {
            setStats(null);
        } finally {
            setLoading(false);
        }
    }, [activeFilter, customStart, customEnd]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, refetch: fetchStats };
}
