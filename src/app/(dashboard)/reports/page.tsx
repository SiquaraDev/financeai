"use client";

import { useState, useEffect, useCallback } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ChartControls, {
    type ChartType,
    type PeriodType,
} from "@/components/reports/ChartControls";
import ChartRenderer, {
    type MonthData,
    type CategoryData,
} from "@/components/reports/ChartRenderer";
import CategoryPieSection from "@/components/reports/CategoryPieSection";
import { IconBarChart, IconActivity, IconPieChart } from "@/components/icons";
import { formatCurrency, formatCurrencyCompact } from "@/lib/formatters";

const TOOLTIP_STYLE: React.CSSProperties = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-lg)",
    color: "var(--text-primary)",
    fontSize: "13px",
    fontFamily: "var(--font-body)",
};

const AXIS_TICK = {
    fill: "var(--text-muted)",
    fontSize: 11,
    fontFamily: "var(--font-mono)",
};

function useReportsData(period: PeriodType) {
    const [monthlyData, setMonthlyData] = useState<MonthData[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const months =
            period === "monthly" ? 6 : period === "quarterly" ? 12 : 24;
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
            const txs = data.transactions ?? [];

            type Tx = { type: string; amount: number; category: string };

            const income = txs
                .filter((t: Tx) => t.type === "INCOME")
                .reduce((s: number, t: Tx) => s + Number(t.amount), 0);
            const expense = txs
                .filter((t: Tx) => t.type === "EXPENSE")
                .reduce((s: number, t: Tx) => s + Number(t.amount), 0);

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

            txs.filter((t: Tx) => t.type === "EXPENSE").forEach((t: Tx) => {
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

export default function ReportsPage() {
    const [chartType, setChartType] = useState<ChartType>("bar");
    const [period, setPeriod] = useState<PeriodType>("monthly");
    const { monthlyData, categoryData, loading } = useReportsData(period);

    return (
        <div
            style={{
                padding: "clamp(.75rem, 4vw, 2rem)",
                width: "100%",
                maxWidth: "1400px",
                margin: "0 auto",
                boxSizing: "border-box",
            }}
        >
            <PageHeader
                title="Relatórios"
                subtitle="Visualize seus dados financeiros"
            />

            <Card
                variant="glass"
                accentBar="brand"
                className="animate-fade-in delay-75"
                style={{ marginBottom: "clamp(.5rem, 2vw, 1rem)" }}
            >
                <ChartControls
                    chartType={chartType}
                    period={period}
                    onChartTypeChange={setChartType}
                    onPeriodChange={setPeriod}
                />
                <SectionHeader
                    title={
                        chartType === "pie"
                            ? "Gastos por categoria"
                            : "Receitas vs Gastos"
                    }
                    icon={<IconBarChart size={12} />}
                    iconBg="var(--accent-brand-glow)"
                    iconBorder="var(--border-glow)"
                    iconColor="var(--accent-brand-light)"
                />
                <ChartRenderer
                    chartType={chartType}
                    monthlyData={monthlyData}
                    categoryData={categoryData}
                    loading={loading}
                />
            </Card>

            {chartType !== "pie" && (
                <Card
                    variant="glass"
                    className="animate-fade-in delay-150"
                    style={{ marginBottom: "clamp(.5rem, 2vw, 1rem)" }}
                >
                    <SectionHeader
                        title="Evolução do saldo"
                        icon={<IconActivity size={12} />}
                        iconBg="var(--accent-teal-glow)"
                        iconBorder="rgba(20,184,166,.25)"
                        iconColor="var(--accent-teal-light)"
                    />
                    {loading ? (
                        <LoadingSpinner height={200} />
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={monthlyData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="var(--border-subtle)"
                                />
                                <XAxis dataKey="month" tick={AXIS_TICK} />
                                <YAxis
                                    tickFormatter={formatCurrencyCompact}
                                    tick={AXIS_TICK}
                                />
                                <Tooltip
                                    formatter={(v: number) => formatCurrency(v)}
                                    contentStyle={TOOLTIP_STYLE}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="saldo"
                                    stroke="var(--accent-brand-light)"
                                    fill="var(--accent-brand-glow)"
                                    name="Saldo"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </Card>
            )}

            {chartType !== "pie" && categoryData.length > 0 && (
                <Card
                    variant="glass"
                    className="animate-fade-in delay-225"
                    style={{ overflow: "hidden" }}
                >
                    <SectionHeader
                        title="Gastos por categoria (período)"
                        icon={<IconPieChart size={12} />}
                        iconBg="var(--color-warning-bg)"
                        iconBorder="var(--color-warning-border)"
                        iconColor="var(--color-warning-light)"
                    />
                    <div
                        className="reports-cat-grid"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "var(--space-4)",
                            alignItems: "center",
                        }}
                    >
                        <CategoryPieSection data={categoryData} />
                    </div>
                </Card>
            )}
        </div>
    );
}
