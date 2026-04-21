"use client";

import { useState, useEffect, useCallback } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import type {
    MonthData,
    CategoryData,
} from "@/components/reports/ChartRenderer";
import type { PeriodType } from "@/components/reports/ChartControls";

const PERIOD_MONTHS: Record<PeriodType, number> = {
    monthly: 6,
    quarterly: 12,
    yearly: 24,
};

interface UseReportsDataReturn {
    monthlyData: MonthData[];
    categoryData: CategoryData[];
    loading: boolean;
}

type RawTransaction = { type: string; amount: number; category: string };

export function useReportsData(period: PeriodType): UseReportsDataReturn {
    const [monthlyData, setMonthlyData] = useState<MonthData[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const months = PERIOD_MONTHS[period];
        const results: MonthData[] = [];
        const catMap: Record<string, number> = {};

        for (let i = months - 1; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            const start = startOfMonth(date).toISOString();
            const end = endOfMonth(date).toISOString();

            const res = await fetch(
                `/api/transactions?limit=200&start=${start}&end=${end}`,
            );
            const data = await res.json();
            const txs: RawTransaction[] = data.transactions ?? [];

            const income = txs
                .filter((t) => t.type === "INCOME")
                .reduce((s, t) => s + Number(t.amount), 0);
            const expense = txs
                .filter((t) => t.type === "EXPENSE")
                .reduce((s, t) => s + Number(t.amount), 0);

            results.push({
                month: format(
                    date,
                    period === "monthly" ? "MMM/yy" : "MM/yyyy",
                    {
                        locale: ptBR,
                    },
                ),
                receitas: Math.round(income),
                gastos: Math.round(expense),
                saldo: Math.round(income - expense),
            });

            txs.filter((t) => t.type === "EXPENSE").forEach((t) => {
                catMap[t.category] =
                    (catMap[t.category] || 0) + Number(t.amount);
            });
        }

        setMonthlyData(results);
        setCategoryData(
            Object.entries(catMap)
                .map(([name, value]) => ({ name, value: Math.round(value) }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 6),
        );
        setLoading(false);
    }, [period]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { monthlyData, categoryData, loading };
}
