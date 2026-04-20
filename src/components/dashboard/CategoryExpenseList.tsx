const COLORS = [
    "var(--accent-brand-light)",
    "var(--accent-teal-light)",
    "var(--color-warning-light)",
    "var(--color-success-light)",
    "var(--color-info-light)",
];

const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(v);

interface CategoryExpenseListProps {
    byCategory: Record<string, number>;
    totalExpense: number;
}

export default function CategoryExpenseList({
    byCategory,
    totalExpense,
}: CategoryExpenseListProps) {
    if (Object.keys(byCategory).length === 0) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "1.5rem 0",
                    gap: ".5rem",
                }}
            >
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--text-dim)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p
                    style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--text-muted)",
                    }}
                >
                    Nenhum gasto no período
                </p>
            </div>
        );
    }

    return (
        <div
            style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}
        >
            {Object.entries(byCategory)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([cat, value], i) => {
                    const pct = Math.round((value / totalExpense) * 100);
                    const color = COLORS[i % COLORS.length];
                    return (
                        <div key={cat} className="category-row">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: ".3rem",
                                    gap: ".375rem",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "var(--text-xs)",
                                        color: "var(--text-secondary)",
                                        fontWeight: 500,
                                        minWidth: 0,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        flex: 1,
                                    }}
                                >
                                    {cat}
                                </span>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: ".375rem",
                                        flexShrink: 0,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "var(--text-xs)",
                                            color: "var(--text-muted)",
                                        }}
                                    >
                                        {pct}%
                                    </span>
                                    <span
                                        className="font-mono"
                                        style={{
                                            fontSize: "var(--text-xs)",
                                            color,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {fmt(value)}
                                    </span>
                                </div>
                            </div>
                            <div
                                style={{
                                    height: "3px",
                                    background: "var(--bg-elevated)",
                                    borderRadius: "var(--radius-full)",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        height: "100%",
                                        width: `${pct}%`,
                                        background: color,
                                        borderRadius: "var(--radius-full)",
                                        transition:
                                            "width .6s cubic-bezier(0.16,1,0.3,1)",
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
