"use client";

import { useState, useEffect, useCallback } from "react";
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
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

type ChartType = "bar" | "line" | "pie" | "area" | "scatter";
type PeriodType = "monthly" | "quarterly" | "yearly";

const COLORS = [
    "#378ADD",
    "#1D9E75",
    "#EF9F27",
    "#D4537E",
    "#7F77DD",
    "#D85A30",
];

const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(v);

interface MonthData {
    month: string;
    receitas: number;
    gastos: number;
    saldo: number;
}

interface CategoryData {
    name: string;
    value: number;
}

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

    const chartTypes: { type: ChartType; label: string }[] = [
        { type: "bar", label: "Barras" },
        { type: "line", label: "Linhas" },
        { type: "pie", label: "Pizza" },
        { type: "area", label: "Área" },
        { type: "scatter", label: "Dispersão" },
    ];

    const periods = [
        { v: "monthly" as const, l: "6 meses" },
        { v: "quarterly" as const, l: "12 meses" },
        { v: "yearly" as const, l: "2 anos" },
    ];

    const LoadingChart = ({ height = 300 }: { height?: number }) => (
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

    const chartGridStyle: React.CSSProperties = {
        stroke: "var(--border-subtle)",
    };

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

    const renderChart = () => {
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
                                <Cell
                                    key={i}
                                    fill={COLORS[i % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(v: number) => formatCurrency(v)}
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
                            formatter={(v: number) => formatCurrency(v)}
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

        const ChartComponent =
            chartType === "bar"
                ? BarChart
                : chartType === "line"
                  ? LineChart
                  : AreaChart;

        return (
            <ResponsiveContainer width="100%" height={300}>
                <ChartComponent data={monthlyData}>
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
                        formatter={(v: number) => formatCurrency(v)}
                        contentStyle={tooltipStyle}
                    />
                    <Legend
                        wrapperStyle={{
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                            fontFamily: "var(--font-body)",
                        }}
                    />
                    {chartType === "area" ? (
                        <>
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
                        </>
                    ) : chartType === "line" ? (
                        <>
                            <Line
                                type="monotone"
                                dataKey="receitas"
                                stroke="var(--color-success-light)"
                                strokeWidth={2}
                                dot={{
                                    r: 3,
                                    fill: "var(--color-success-light)",
                                }}
                                name="Receitas"
                            />
                            <Line
                                type="monotone"
                                dataKey="gastos"
                                stroke="var(--color-danger-light)"
                                strokeWidth={2}
                                dot={{
                                    r: 3,
                                    fill: "var(--color-danger-light)",
                                }}
                                name="Gastos"
                            />
                            <Line
                                type="monotone"
                                dataKey="saldo"
                                stroke="var(--accent-brand-light)"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={{
                                    r: 3,
                                    fill: "var(--accent-brand-light)",
                                }}
                                name="Saldo"
                            />
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </ChartComponent>
            </ResponsiveContainer>
        );
    };

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
        .reports-controls {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .reports-controls-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          min-width: 0;
        }
        .reports-controls-buttons {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }
        .reports-cat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
          align-items: center;
        }
        @media (max-width: 480px) {
          .reports-controls {
            flex-direction: column;
            gap: 1rem;
          }
          .reports-cat-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 360px) {
          .reports-controls-buttons {
            gap: var(--space-1);
          }
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
                {/* Accent top bar */}
                <div
                    style={{
                        height: "3px",
                        background: "var(--gradient-brand-h)",
                        margin: "-clamp(.875rem, 3vw, 1.5rem) -clamp(.875rem, 3vw, 1.5rem) clamp(.875rem, 3vw, 1.5rem)",
                    }}
                />

                {/* Controles */}
                <div
                    className="reports-controls"
                    style={{ marginBottom: "1.25rem" }}
                >
                    {/* Tipo de gráfico */}
                    <div className="reports-controls-group">
                        <p
                            style={{
                                fontSize: "var(--text-xs)",
                                fontWeight: 600,
                                color: "var(--text-muted)",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                            }}
                        >
                            Tipo de gráfico
                        </p>
                        <div className="reports-controls-buttons">
                            {chartTypes.map(({ type, label }) => (
                                <button
                                    key={type}
                                    onClick={() => setChartType(type)}
                                    style={{
                                        padding: "5px clamp(8px, 2vw, 14px)",
                                        borderRadius: "var(--radius-full)",
                                        fontSize: "var(--text-xs)",
                                        fontWeight:
                                            chartType === type ? 600 : 500,
                                        fontFamily: "var(--font-body)",
                                        cursor: "pointer",
                                        transition:
                                            "all var(--transition-base)",
                                        border:
                                            chartType === type
                                                ? "none"
                                                : "1px solid var(--border)",
                                        background:
                                            chartType === type
                                                ? "var(--gradient-brand)"
                                                : "transparent",
                                        color:
                                            chartType === type
                                                ? "var(--text-on-brand)"
                                                : "var(--text-muted)",
                                        boxShadow:
                                            chartType === type
                                                ? "var(--shadow-brand)"
                                                : "none",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Período */}
                    <div className="reports-controls-group">
                        <p
                            style={{
                                fontSize: "var(--text-xs)",
                                fontWeight: 600,
                                color: "var(--text-muted)",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                            }}
                        >
                            Período
                        </p>
                        <div className="reports-controls-buttons">
                            {periods.map(({ v, l }) => (
                                <button
                                    key={v}
                                    onClick={() => setPeriod(v)}
                                    style={{
                                        padding: "5px clamp(8px, 2vw, 14px)",
                                        borderRadius: "var(--radius-full)",
                                        fontSize: "var(--text-xs)",
                                        fontWeight: period === v ? 600 : 500,
                                        fontFamily: "var(--font-body)",
                                        cursor: "pointer",
                                        transition:
                                            "all var(--transition-base)",
                                        border:
                                            period === v
                                                ? "none"
                                                : "1px solid var(--border)",
                                        background:
                                            period === v
                                                ? "var(--accent-teal-glow)"
                                                : "transparent",
                                        color:
                                            period === v
                                                ? "var(--accent-teal-light)"
                                                : "var(--text-muted)",
                                        boxShadow:
                                            period === v
                                                ? "var(--shadow-teal)"
                                                : "none",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Título do gráfico */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: ".625rem",
                        marginBottom: "1rem",
                    }}
                >
                    <span
                        style={{
                            width: "26px",
                            height: "26px",
                            flexShrink: 0,
                            borderRadius: "var(--radius-md)",
                            background: "var(--accent-brand-glow)",
                            border: "1px solid var(--border-glow)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--accent-brand-light)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    </span>
                    <h2
                        className="font-display"
                        style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {chartType === "pie"
                            ? "Gastos por categoria"
                            : "Receitas vs Gastos"}
                    </h2>
                </div>

                {renderChart()}
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
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".625rem",
                            marginBottom: "1rem",
                        }}
                    >
                        <span
                            style={{
                                width: "26px",
                                height: "26px",
                                flexShrink: 0,
                                borderRadius: "var(--radius-md)",
                                background: "var(--accent-teal-glow)",
                                border: "1px solid rgba(20,184,166,.25)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--accent-teal-light)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </span>
                        <h2
                            className="font-display"
                            style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Evolução do saldo
                        </h2>
                    </div>

                    {loading ? (
                        <LoadingChart height={200} />
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
                                    formatter={(v: number) => formatCurrency(v)}
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
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".625rem",
                            marginBottom: "1rem",
                        }}
                    >
                        <span
                            style={{
                                width: "26px",
                                height: "26px",
                                flexShrink: 0,
                                borderRadius: "var(--radius-md)",
                                background: "var(--color-warning-bg)",
                                border: "1px solid var(--color-warning-border)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--color-warning-light)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                                <path d="M22 12A10 10 0 0 0 12 2v10z" />
                            </svg>
                        </span>
                        <h2
                            className="font-display"
                            style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Gastos por categoria (período)
                        </h2>
                    </div>

                    <div className="reports-cat-grid">
                        {/* Pizza */}
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                >
                                    {categoryData.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={COLORS[i % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(v: number) => formatCurrency(v)}
                                    contentStyle={tooltipStyle}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Legenda */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-2)",
                            }}
                        >
                            {categoryData.map((cat, i) => (
                                <div
                                    key={cat.name}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--space-2)",
                                        padding:
                                            "var(--space-1) var(--space-2)",
                                        borderRadius: "var(--radius-md)",
                                        transition:
                                            "background var(--transition-base)",
                                        minWidth: 0,
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                            "var(--bg-elevated)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background =
                                            "transparent")
                                    }
                                >
                                    <div
                                        style={{
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "var(--radius-full)",
                                            flexShrink: 0,
                                            background:
                                                COLORS[i % COLORS.length],
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: "var(--text-xs)",
                                            color: "var(--text-secondary)",
                                            flex: 1,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            minWidth: 0,
                                        }}
                                    >
                                        {cat.name}
                                    </span>
                                    <span
                                        className="font-mono"
                                        style={{
                                            fontSize: "var(--text-xs)",
                                            fontWeight: 600,
                                            color: COLORS[i % COLORS.length],
                                            flexShrink: 0,
                                        }}
                                    >
                                        {formatCurrency(cat.value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
