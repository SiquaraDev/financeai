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

import ChartControls, {
    type ChartType,
    type PeriodType,
} from "@/components/reports/ChartControls";
import ChartRenderer, {
    type MonthData,
    type CategoryData,
} from "@/components/reports/ChartRenderer";
import CategoryPieSection from "@/components/reports/CategoryPieSection";
import SectionHeader from "@/components/ui/SectionHeader";
import { IconBarChart, IconActivity, IconPieChart } from "@/components/icons";

const tooltipStyle: React.CSSProperties = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-lg)",
    color: "var(--text-primary)",
    fontSize: "13px",
    fontFamily: "var(--font-body)",
};

const axisTickStyle = {
    fill: "var(--text-muted)",
    fontSize: 11,
    fontFamily: "var(--font-mono)",
};

const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(v);

export default function ReportsPage() {
    const [chartType, setChartType] = useState<ChartType>("bar");
    const [period, setPeriod] = useState<PeriodType>("monthly");
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

            const income = txs
                .filter((t: { type: string }) => t.type === "INCOME")
                .reduce(
                    (s: number, t: { amount: number }) => s + Number(t.amount),
                    0,
                );
            const expense = txs
                .filter((t: { type: string }) => t.type === "EXPENSE")
                .reduce(
                    (s: number, t: { amount: number }) => s + Number(t.amount),
                    0,
                );

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
            txs.filter((t: { type: string }) => t.type === "EXPENSE").forEach(
                (t: { category: string; amount: number }) => {
                    catMap[t.category] =
                        (catMap[t.category] || 0) + Number(t.amount);
                },
            );
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
            <style>{`
        @media (max-width: 480px) {
          .reports-cat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

            {/* Header */}
            <div
                className="animate-fade-in"
                style={{ marginBottom: "clamp(1rem, 3vw, 2rem)" }}
            >
                <h1
                    className="font-display"
                    style={{
                        fontSize: "clamp(18px, 5vw, 30px)",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.2,
                        marginBottom: "var(--space-1)",
                    }}
                >
                    Relatórios
                </h1>
                <p
                    style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--text-secondary)",
                    }}
                >
                    Visualize seus dados financeiros
                </p>
            </div>

            {/* Card principal — controles + gráfico */}
            <div
                className="card-glass animate-fade-in delay-75"
                style={{
                    padding: "clamp(.875rem, 3vw, 1.5rem)",
                    marginBottom: "clamp(.5rem, 2vw, 1rem)",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        height: "3px",
                        background: "var(--gradient-brand-h)",
                        margin: "-clamp(.875rem,3vw,1.5rem) -clamp(.875rem,3vw,1.5rem) clamp(.875rem,3vw,1.5rem)",
                    }}
                />

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
            </div>

            {/* Evolução do saldo */}
            {chartType !== "pie" && (
                <div
                    className="card-glass animate-fade-in delay-150"
                    style={{
                        padding: "clamp(.875rem, 3vw, 1.5rem)",
                        marginBottom: "clamp(.5rem, 2vw, 1rem)",
                        overflow: "hidden",
                    }}
                >
                    <SectionHeader
                        title="Evolução do saldo"
                        icon={<IconActivity size={12} />}
                        iconBg="var(--accent-teal-glow)"
                        iconBorder="rgba(20,184,166,.25)"
                        iconColor="var(--accent-teal-light)"
                    />
                    {loading ? (
                        <div
                            style={{
                                height: 200,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <svg
                                className="animate-spin"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--text-muted)"
                                strokeWidth="2.5"
                            >
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={monthlyData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="var(--border-subtle)"
                                />
                                <XAxis dataKey="month" tick={axisTickStyle} />
                                <YAxis
                                    tickFormatter={(v) =>
                                        `R$${(v / 1000).toFixed(0)}k`
                                    }
                                    tick={axisTickStyle}
                                />
                                <Tooltip
                                    formatter={(v: number) => fmt(v)}
                                    contentStyle={tooltipStyle}
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
                </div>
            )}

            {/* Gastos por categoria */}
            {chartType !== "pie" && categoryData.length > 0 && (
                <div
                    className="card-glass animate-fade-in delay-225"
                    style={{
                        padding: "clamp(.875rem, 3vw, 1.5rem)",
                        overflow: "hidden",
                    }}
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
                </div>
            )}
        </div>
    );
}
