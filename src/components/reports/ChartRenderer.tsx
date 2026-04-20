"use client";

import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import type { ChartType } from "./ChartControls";

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

interface ChartRendererProps {
    chartType: ChartType;
    monthlyData: MonthData[];
    categoryData: CategoryData[];
    loading: boolean;
}

const COLORS = [
    "#378ADD",
    "#1D9E75",
    "#EF9F27",
    "#D4537E",
    "#7F77DD",
    "#D85A30",
];

const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(v);

const axisTickStyle = {
    fill: "var(--text-muted)",
    fontSize: 11,
    fontFamily: "var(--font-mono)",
};

const tooltipStyle: React.CSSProperties = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-lg)",
    color: "var(--text-primary)",
    fontSize: "13px",
    fontFamily: "var(--font-body)",
};

const legendStyle = {
    fontSize: "12px",
    color: "var(--text-secondary)",
    fontFamily: "var(--font-body)",
};

function LoadingChart({ height = 300 }: { height?: number }) {
    return (
        <div
            style={{
                height,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--space-2)",
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
            <span
                style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--text-muted)",
                }}
            >
                Carregando...
            </span>
        </div>
    );
}

export default function ChartRenderer({
    chartType,
    monthlyData,
    categoryData,
    loading,
}: ChartRendererProps) {
    if (loading) return <LoadingChart />;

    if (chartType === "pie") {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                        }
                    >
                        {categoryData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(v: number) => fmt(v)}
                        contentStyle={tooltipStyle}
                    />
                </PieChart>
            </ResponsiveContainer>
        );
    }

    if (chartType === "scatter") {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border-subtle)"
                    />
                    <XAxis
                        dataKey="gastos"
                        name="Gastos"
                        tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                        tick={axisTickStyle}
                    />
                    <YAxis
                        dataKey="receitas"
                        name="Receitas"
                        tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                        tick={axisTickStyle}
                    />
                    <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        formatter={(v: number) => fmt(v)}
                        contentStyle={tooltipStyle}
                    />
                    <Scatter
                        data={monthlyData}
                        fill="var(--accent-brand-light)"
                    />
                </ScatterChart>
            </ResponsiveContainer>
        );
    }

    if (chartType === "area") {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border-subtle)"
                    />
                    <XAxis dataKey="month" tick={axisTickStyle} />
                    <YAxis
                        tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                        tick={axisTickStyle}
                    />
                    <Tooltip
                        formatter={(v: number) => fmt(v)}
                        contentStyle={tooltipStyle}
                    />
                    <Legend wrapperStyle={legendStyle} />
                    <Area
                        type="monotone"
                        dataKey="receitas"
                        stroke="var(--color-success-light)"
                        fill="var(--color-success-bg)"
                        name="Receitas"
                        strokeWidth={2}
                    />
                    <Area
                        type="monotone"
                        dataKey="gastos"
                        stroke="var(--color-danger-light)"
                        fill="var(--color-danger-bg)"
                        name="Gastos"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        );
    }

    if (chartType === "line") {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border-subtle)"
                    />
                    <XAxis dataKey="month" tick={axisTickStyle} />
                    <YAxis
                        tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                        tick={axisTickStyle}
                    />
                    <Tooltip
                        formatter={(v: number) => fmt(v)}
                        contentStyle={tooltipStyle}
                    />
                    <Legend wrapperStyle={legendStyle} />
                    <Line
                        type="monotone"
                        dataKey="receitas"
                        stroke="var(--color-success-light)"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "var(--color-success-light)" }}
                        name="Receitas"
                    />
                    <Line
                        type="monotone"
                        dataKey="gastos"
                        stroke="var(--color-danger-light)"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "var(--color-danger-light)" }}
                        name="Gastos"
                    />
                    <Line
                        type="monotone"
                        dataKey="saldo"
                        stroke="var(--accent-brand-light)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 3, fill: "var(--accent-brand-light)" }}
                        name="Saldo"
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    }

    // bar — default
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-subtle)"
                />
                <XAxis dataKey="month" tick={axisTickStyle} />
                <YAxis
                    tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                    tick={axisTickStyle}
                />
                <Tooltip
                    formatter={(v: number) => fmt(v)}
                    contentStyle={tooltipStyle}
                />
                <Legend wrapperStyle={legendStyle} />
                <Bar
                    dataKey="receitas"
                    fill="var(--color-success-light)"
                    name="Receitas"
                    radius={[4, 4, 0, 0]}
                />
                <Bar
                    dataKey="gastos"
                    fill="var(--color-danger-light)"
                    name="Gastos"
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
