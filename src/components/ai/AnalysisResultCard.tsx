interface AnalysisResult {
    summary: string;
    tips: string[];
}

const TIP_STYLES = [
    {
        bg: "var(--color-success-bg)",
        border: "var(--color-success-border)",
        color: "var(--color-success-light)",
    },
    {
        bg: "var(--accent-brand-glow)",
        border: "var(--border-glow)",
        color: "var(--accent-brand-light)",
    },
    {
        bg: "var(--color-warning-bg)",
        border: "var(--color-warning-border)",
        color: "var(--color-warning-light)",
    },
    {
        bg: "var(--accent-teal-glow)",
        border: "rgba(20,184,166,.22)",
        color: "var(--accent-teal-light)",
    },
];

export default function AnalysisResultCard({
    analysis,
}: {
    analysis: AnalysisResult;
}) {
    return (
        <div
            className="card-glass animate-fade-in"
            style={{
                overflow: "hidden",
                borderRadius: "var(--radius-xl)",
                maxHeight: "clamp(300px, 45vh, 520px)",
                flexShrink: 0,
            }}
        >
            <div
                style={{
                    height: "3px",
                    background: "var(--gradient-success)",
                }}
            />
            <div
                style={{
                    overflowY: "auto",
                    overflowX: "hidden",
                    maxHeight: "clamp(300px, 45vh, 520px)",
                    paddingInline: "clamp(.875rem, 3vw, 1.25rem)",
                    paddingBottom: "clamp(.875rem, 3vw, 1.25rem)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: ".5rem",
                        margin: ".875rem 0",
                    }}
                >
                    <span
                        style={{
                            width: "26px",
                            height: "26px",
                            flexShrink: 0,
                            borderRadius: "var(--radius-md)",
                            background: "var(--color-success-bg)",
                            border: "1px solid var(--color-success-border)",
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
                            stroke="var(--color-success-light)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
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
                        Resumo do período
                    </h2>
                </div>

                <div
                    style={{
                        background: "var(--accent-brand-glow)",
                        border: "1px solid var(--border-glow)",
                        borderRadius: "var(--radius-lg)",
                        padding: "clamp(.625rem, 2vw, .875rem)",
                        marginBottom: ".875rem",
                    }}
                >
                    <p
                        style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--text-secondary)",
                            lineHeight: 1.7,
                        }}
                    >
                        {analysis.summary}
                    </p>
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
                    Dicas personalizadas
                </p>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-2)",
                    }}
                >
                    {analysis.tips.map((tip, i) => {
                        const s = TIP_STYLES[i % TIP_STYLES.length];
                        return (
                            <div
                                key={i}
                                style={{
                                    background: s.bg,
                                    border: `1px solid ${s.border}`,
                                    borderRadius: "var(--radius-md)",
                                    padding: "8px 12px",
                                    display: "flex",
                                    gap: "var(--space-2)",
                                    alignItems: "flex-start",
                                }}
                            >
                                <span
                                    style={{
                                        color: s.color,
                                        fontSize: "10px",
                                        marginTop: "2px",
                                        flexShrink: 0,
                                    }}
                                >
                                    ✦
                                </span>
                                <p
                                    style={{
                                        fontSize: "var(--text-xs)",
                                        color: "var(--text-secondary)",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {tip}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
