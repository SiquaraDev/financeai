"use client";

export type ChartType = "bar" | "line" | "pie" | "area" | "scatter";
export type PeriodType = "monthly" | "quarterly" | "yearly";

const CHART_TYPES: { type: ChartType; label: string }[] = [
    { type: "bar", label: "Barras" },
    { type: "line", label: "Linhas" },
    { type: "pie", label: "Pizza" },
    { type: "area", label: "Área" },
    { type: "scatter", label: "Dispersão" },
];

const PERIODS: { v: PeriodType; l: string }[] = [
    { v: "monthly", l: "6 meses" },
    { v: "quarterly", l: "12 meses" },
    { v: "yearly", l: "2 anos" },
];

interface ChartControlsProps {
    chartType: ChartType;
    period: PeriodType;
    onChartTypeChange: (t: ChartType) => void;
    onPeriodChange: (p: PeriodType) => void;
}

export default function ChartControls({
    chartType,
    period,
    onChartTypeChange,
    onPeriodChange,
}: ChartControlsProps) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1.5rem",
                flexWrap: "wrap",
                marginBottom: "1.25rem",
            }}
        >
            {/* Tipo de gráfico */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-2)",
                    minWidth: 0,
                }}
            >
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
                <div
                    style={{
                        display: "flex",
                        gap: "var(--space-2)",
                        flexWrap: "wrap",
                    }}
                >
                    {CHART_TYPES.map(({ type, label }) => {
                        const active = chartType === type;
                        return (
                            <button
                                key={type}
                                onClick={() => onChartTypeChange(type)}
                                style={{
                                    padding: "5px clamp(8px, 2vw, 14px)",
                                    borderRadius: "var(--radius-full)",
                                    fontSize: "var(--text-xs)",
                                    fontWeight: active ? 600 : 500,
                                    fontFamily: "var(--font-body)",
                                    cursor: "pointer",
                                    transition: "all var(--transition-base)",
                                    border: active
                                        ? "none"
                                        : "1px solid var(--border)",
                                    background: active
                                        ? "var(--gradient-brand)"
                                        : "transparent",
                                    color: active
                                        ? "var(--text-on-brand)"
                                        : "var(--text-muted)",
                                    boxShadow: active
                                        ? "var(--shadow-brand)"
                                        : "none",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Período */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-2)",
                    minWidth: 0,
                }}
            >
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
                <div
                    style={{
                        display: "flex",
                        gap: "var(--space-2)",
                        flexWrap: "wrap",
                    }}
                >
                    {PERIODS.map(({ v, l }) => {
                        const active = period === v;
                        return (
                            <button
                                key={v}
                                onClick={() => onPeriodChange(v)}
                                style={{
                                    padding: "5px clamp(8px, 2vw, 14px)",
                                    borderRadius: "var(--radius-full)",
                                    fontSize: "var(--text-xs)",
                                    fontWeight: active ? 600 : 500,
                                    fontFamily: "var(--font-body)",
                                    cursor: "pointer",
                                    transition: "all var(--transition-base)",
                                    border: active
                                        ? "none"
                                        : "1px solid var(--border)",
                                    background: active
                                        ? "var(--accent-teal-glow)"
                                        : "transparent",
                                    color: active
                                        ? "var(--accent-teal-light)"
                                        : "var(--text-muted)",
                                    boxShadow: active
                                        ? "var(--shadow-teal)"
                                        : "none",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {l}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
