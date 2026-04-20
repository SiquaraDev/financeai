"use client";

import { GeminiIcon, IconSpinner } from "@/components/icons";

export type Shortcut = "last_month" | "3_months" | "6_months" | "year";

const SHORTCUTS: { value: Shortcut; label: string }[] = [
    { value: "last_month", label: "Último mês" },
    { value: "3_months", label: "3 meses" },
    { value: "6_months", label: "6 meses" },
    { value: "year", label: "Ano" },
];

interface NewAnalysisCardProps {
    startDate: string;
    endDate: string;
    activeShortcut: Shortcut;
    analyzing: boolean;
    onStartDateChange: (v: string) => void;
    onEndDateChange: (v: string) => void;
    onShortcut: (s: Shortcut) => void;
    onAnalyze: () => void;
}

export default function NewAnalysisCard({
    startDate,
    endDate,
    activeShortcut,
    analyzing,
    onStartDateChange,
    onEndDateChange,
    onShortcut,
    onAnalyze,
}: NewAnalysisCardProps) {
    return (
        <div
            className="card-glass animate-fade-in delay-75"
            style={{ padding: 0, overflow: "hidden", flexShrink: 0 }}
        >
            <div
                style={{
                    padding:
                        "clamp(.4375rem,1.5vw,.625rem) clamp(.875rem,3vw,1.25rem) 0",
                }}
            >
                <div
                    style={{
                        height: "3px",
                        background: "var(--gradient-brand-h)",
                        marginBottom: "clamp(.4375rem,1.5vw,.625rem)",
                    }}
                />
            </div>

            <div
                style={{
                    padding:
                        "0 clamp(.875rem,3vw,1.25rem) clamp(.875rem,3vw,1.25rem)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: ".625rem",
                        marginBottom: "1.125rem",
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
                            color: "var(--accent-brand-light)",
                        }}
                    >
                        <GeminiIcon size={12} />
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
                        Nova análise
                    </h2>
                </div>

                <p
                    style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "var(--space-2)",
                    }}
                >
                    Período
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "var(--space-2)",
                        marginBottom: "var(--space-3)",
                    }}
                >
                    {[
                        {
                            label: "De",
                            value: startDate,
                            onChange: onStartDateChange,
                        },
                        {
                            label: "Até",
                            value: endDate,
                            onChange: onEndDateChange,
                        },
                    ].map(({ label, value, onChange }) => (
                        <div key={label}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "var(--text-xs)",
                                    color: "var(--text-muted)",
                                    marginBottom: "var(--space-1)",
                                }}
                            >
                                {label}
                            </label>
                            <input
                                type="date"
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "8px 10px",
                                    fontSize: "var(--text-xs)",
                                }}
                            />
                        </div>
                    ))}
                </div>

                <p
                    style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "var(--space-2)",
                    }}
                >
                    Atalhos
                </p>
                <div
                    style={{
                        display: "flex",
                        gap: "var(--space-1)",
                        flexWrap: "wrap",
                        marginBottom: "1.125rem",
                    }}
                >
                    {SHORTCUTS.map(({ value, label }) => {
                        const active = activeShortcut === value;
                        return (
                            <button
                                key={value}
                                onClick={() => onShortcut(value)}
                                style={{
                                    padding: "5px 10px",
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
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={onAnalyze}
                    disabled={analyzing}
                    className="btn-primary"
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "var(--space-2)",
                        padding: "11px var(--space-5)",
                        fontSize: "var(--text-sm)",
                        borderRadius: "var(--radius-md)",
                    }}
                >
                    {analyzing ? (
                        <>
                            <IconSpinner size={14} /> Analisando…
                        </>
                    ) : (
                        <>
                            <GeminiIcon size={14} /> Analisar com Gemini
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
