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

function ControlGroup({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
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
                {label}
            </p>
            <div
                style={{
                    display: "flex",
                    gap: "var(--space-2)",
                    flexWrap: "wrap",
                }}
            >
                {children}
            </div>
        </div>
    );
}

function PillButton({
    active,
    onClick,
    children,
    activeStyle,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    activeStyle: React.CSSProperties;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: "5px clamp(8px, 2vw, 14px)",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--text-xs)",
                fontWeight: active ? 600 : 500,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                transition: "all var(--transition-base)",
                border: active ? "none" : "1px solid var(--border)",
                color: active ? undefined : "var(--text-muted)",
                boxShadow: active ? undefined : "none",
                whiteSpace: "nowrap",
                ...(active ? activeStyle : { background: "transparent" }),
            }}
        >
            {children}
        </button>
    );
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
            <ControlGroup label="Tipo de gráfico">
                {CHART_TYPES.map(({ type, label }) => (
                    <PillButton
                        key={type}
                        active={chartType === type}
                        onClick={() => onChartTypeChange(type)}
                        activeStyle={{
                            background: "var(--gradient-brand)",
                            color: "var(--text-on-brand)",
                            boxShadow: "var(--shadow-brand)",
                        }}
                    >
                        {label}
                    </PillButton>
                ))}
            </ControlGroup>
            <ControlGroup label="Período">
                {PERIODS.map(({ v, l }) => (
                    <PillButton
                        key={v}
                        active={period === v}
                        onClick={() => onPeriodChange(v)}
                        activeStyle={{
                            background: "var(--accent-teal-glow)",
                            color: "var(--accent-teal-light)",
                            boxShadow: "var(--shadow-teal)",
                        }}
                    >
                        {l}
                    </PillButton>
                ))}
            </ControlGroup>
        </div>
    );
}
