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
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatCurrency, formatCurrencyCompact } from "@/utils";
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

const PIE_COLORS = [
    "#378ADD",
    "#1D9E75",
    "#EF9F27",
    "#D4537E",
    "#7F77DD",
    "#D85A30",
];

const AXIS_TICK = {
    fill: "var(--text-muted)",
    fontSize: 11,
    fontFamily: "var(--font-mono)",
};

const TOOLTIP_STYLE: React.CSSProperties = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-lg)",
    color: "var(--text-primary)",
    fontSize: "13px",
    fontFamily: "var(--font-body)",
};

const LEGEND_STYLE = {
    fontSize: "12px",
    color: "var(--text-secondary)",
    fontFamily: "var(--font-body)",
};

const GRID = (
    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
);

function BarVariant({ data }: { data: MonthData[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                {GRID}
                <XAxis dataKey="month" tick={AXIS_TICK} />
                <YAxis tickFormatter={formatCurrencyCompact} tick={AXIS_TICK} />
                <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={TOOLTIP_STYLE}
                />
                <Legend wrapperStyle={LEGEND_STYLE} />
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

function LineVariant({ data }: { data: MonthData[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                {GRID}
                <XAxis dataKey="month" tick={AXIS_TICK} />
                <YAxis tickFormatter={formatCurrencyCompact} tick={AXIS_TICK} />
                <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={TOOLTIP_STYLE}
                />
                <Legend wrapperStyle={LEGEND_STYLE} />
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

function AreaVariant({ data }: { data: MonthData[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
                {GRID}
                <XAxis dataKey="month" tick={AXIS_TICK} />
                <YAxis tickFormatter={formatCurrencyCompact} tick={AXIS_TICK} />
                <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={TOOLTIP_STYLE}
                />
                <Legend wrapperStyle={LEGEND_STYLE} />
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

function PieVariant({ data }: { data: CategoryData[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                    }
                >
                    {data.map((_, i) => (
                        <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={TOOLTIP_STYLE}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

function ScatterVariant({ data }: { data: MonthData[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
                {GRID}
                <XAxis
                    dataKey="gastos"
                    name="Gastos"
                    tickFormatter={formatCurrencyCompact}
                    tick={AXIS_TICK}
                />
                <YAxis
                    dataKey="receitas"
                    name="Receitas"
                    tickFormatter={formatCurrencyCompact}
                    tick={AXIS_TICK}
                />
                <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={TOOLTIP_STYLE}
                />
                <Scatter data={data} fill="var(--accent-brand-light)" />
            </ScatterChart>
        </ResponsiveContainer>
    );
}

const VARIANTS: Record<
    ChartType,
    (props: {
        monthlyData: MonthData[];
        categoryData: CategoryData[];
    }) => React.ReactElement
> = {
    bar: ({ monthlyData }) => <BarVariant data={monthlyData} />,
    line: ({ monthlyData }) => <LineVariant data={monthlyData} />,
    area: ({ monthlyData }) => <AreaVariant data={monthlyData} />,
    pie: ({ categoryData }) => <PieVariant data={categoryData} />,
    scatter: ({ monthlyData }) => <ScatterVariant data={monthlyData} />,
};

export default function ChartRenderer({
    chartType,
    monthlyData,
    categoryData,
    loading,
}: ChartRendererProps) {
    if (loading) return <LoadingSpinner height={300} label="Carregando..." />;
    const Variant = VARIANTS[chartType];
    return <Variant monthlyData={monthlyData} categoryData={categoryData} />;
}
