"use client";

import { useState, useEffect, useCallback } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ApiService } from "@/services";
import type { Transaction } from "@/types";

export type PeriodType = "monthly" | "quarterly" | "yearly";

export interface MonthData {
    month: string;
    receitas: number;
    gastos: number;
    saldo: number;
}

export interface CategoryData {
    name: string;
    value: number;
}

const PERIOD_MONTHS: Record<PeriodType, number> = {
    monthly: 6,
    quarterly: 12,
    yearly: 24,
};

class ReportsApiService extends ApiService {
    constructor() {
        super("/api");
    }

    async fetchMonthTransactions(
        start: string,
        end: string,
    ): Promise<Transaction[]> {
        const raw = await this.get<{ transactions: Transaction[] }>(
            "/transactions",
            {
                limit: 200,
                start,
                end,
            },
        );
        return raw.transactions ?? [];
    }
}

const reportsApi = new ReportsApiService();

interface UseReportsDataReturn {
    monthlyData: MonthData[];
    categoryData: CategoryData[];
    loading: boolean;
}

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
            const txs = await reportsApi.fetchMonthTransactions(
                startOfMonth(date).toISOString(),
                endOfMonth(date).toISOString(),
            );

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
                    { locale: ptBR },
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
