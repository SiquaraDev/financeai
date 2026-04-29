"use client";

import FilterBar from "@/components/ui/FilterBar";

export type FilterKey =
    | "all"
    | "this_month"
    | "last_month"
    | "3_months"
    | "6_months"
    | "this_year"
    | "last_year"
    | "custom";

const FILTER_OPTIONS: { value: FilterKey; label: string }[] = [
    { value: "all", label: "Sem filtro" },
    { value: "this_month", label: "Este mês" },
    { value: "last_month", label: "Mês anterior" },
    { value: "3_months", label: "3 meses" },
    { value: "6_months", label: "6 meses" },
    { value: "this_year", label: "Este ano" },
    { value: "last_year", label: "Ano anterior" },
    { value: "custom", label: "Personalizado" },
];

interface PeriodFilterProps {
    activeFilter: FilterKey;
    customStart: string;
    customEnd: string;
    periodLabel: string;
    onFilterChange: (key: FilterKey) => void;
    onCustomStartChange: (v: string) => void;
    onCustomEndChange: (v: string) => void;
}

export default function PeriodFilter({
    activeFilter,
    customStart,
    customEnd,
    periodLabel,
    onFilterChange,
    onCustomStartChange,
    onCustomEndChange,
}: PeriodFilterProps) {
    return (
        <div
            className="card-glass animate-fade-in delay-75"
            style={{
                padding:
                    "clamp(.75rem, 2vw, 1rem) clamp(.875rem, 3vw, 1.25rem)",
                marginBottom: "clamp(.75rem, 2vw, 1.5rem)",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    marginBottom: "var(--space-3)",
                }}
            >
                <span
                    style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--accent-brand-glow)",
                        border: "1px solid var(--border-glow)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: "var(--accent-brand-light)",
                    }}
                >
                    <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                </span>
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
                <span
                    style={{
                        marginLeft: "auto",
                        fontSize: "var(--text-xs)",
                        color: "var(--accent-brand-light)",
                        fontWeight: 500,
                        background: "var(--accent-brand-glow)",
                        border: "1px solid var(--border-glow)",
                        borderRadius: "var(--radius-full)",
                        padding: "2px 10px",
                        whiteSpace: "nowrap",
                    }}
                >
                    {periodLabel.charAt(0).toUpperCase() +
                        periodLabel.slice(1).toLowerCase()}
                </span>
            </div>

            <FilterBar
                options={FILTER_OPTIONS}
                active={activeFilter}
                onChange={onFilterChange}
            />

            {activeFilter === "custom" && (
                <div
                    className="animate-fade-in"
                    style={{
                        display: "flex",
                        gap: ".5rem",
                        marginTop: ".75rem",
                    }}
                >
                    {[
                        {
                            label: "De",
                            value: customStart,
                            onChange: onCustomStartChange,
                        },
                        {
                            label: "Até",
                            value: customEnd,
                            onChange: onCustomEndChange,
                        },
                    ].map(({ label, value, onChange }) => (
                        <div
                            key={label}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                            }}
                        >
                            <label
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: "var(--text-muted)",
                                }}
                            >
                                {label}
                            </label>
                            <input
                                type="date"
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                style={{
                                    padding: "6px 8px",
                                    fontSize: "var(--text-xs)",
                                    width: "auto",
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
