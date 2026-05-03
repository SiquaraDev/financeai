import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatCurrency } from "@/lib/formatters";

const COLORS = [
    "var(--accent-brand-light)",
    "var(--accent-teal-light)",
    "var(--color-warning-light)",
    "var(--color-success-light)",
    "var(--color-info-light)",
];

interface CategoryExpenseListProps {
    byCategory: Record<string, number>;
    totalExpense: number;
    loading: boolean;
}

export default function CategoryExpenseList({
    byCategory,
    totalExpense,
    loading,
}: CategoryExpenseListProps) {
    if (loading) {
        return <LoadingSpinner height={160} />;
    }

    if (Object.keys(byCategory).length === 0) {
        return <EmptyState title="Nenhum gasto no período" />;
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
                                        {formatCurrency(value)}
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
