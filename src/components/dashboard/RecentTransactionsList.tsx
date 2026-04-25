import { format } from "date-fns";
import EmptyState from "@/components/ui/EmptyState";
import { formatCurrency, parseSafeDate } from "@/lib/formatters";

interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
    date: string;
}

interface RecentTransactionsListProps {
    transactions: Transaction[];
}

function TxIcon({ isIncome }: { isIncome: boolean }) {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            {isIncome ? (
                <>
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                </>
            ) : (
                <>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                </>
            )}
        </svg>
    );
}

export default function RecentTransactionsList({
    transactions,
}: RecentTransactionsListProps) {
    if (transactions.length === 0) {
        return <EmptyState title="Nenhuma transação no período" />;
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
            }}
        >
            {transactions.map((t) => {
                const isIncome = t.type === "INCOME";
                const color = isIncome
                    ? "var(--color-success-light)"
                    : "var(--color-danger-light)";
                const bg = isIncome
                    ? "var(--color-success-bg)"
                    : "var(--color-danger-bg)";
                const border = isIncome
                    ? "var(--color-success-border)"
                    : "var(--color-danger-border)";

                return (
                    <div
                        key={t.id}
                        className="tx-row"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: ".625rem",
                                minWidth: 0,
                                flex: 1,
                            }}
                        >
                            <div
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    flexShrink: 0,
                                    borderRadius: "var(--radius-md)",
                                    background: bg,
                                    border: `1px solid ${border}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color,
                                    marginBottom: ".1rem",
                                }}
                            >
                                <TxIcon isIncome={isIncome} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <p
                                    style={{
                                        fontSize: "var(--text-xs)",
                                        fontWeight: 500,
                                        color: "var(--text-primary)",
                                        lineHeight: 1.3,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {t.title}
                                </p>
                                <p
                                    style={{
                                        fontSize: "10px",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    {t.category} ·{" "}
                                    {format(parseSafeDate(t.date), "dd/MM")}
                                </p>
                            </div>
                        </div>

                        <span
                            className="font-mono"
                            style={{
                                fontSize: "var(--text-xs)",
                                fontWeight: 600,
                                flexShrink: 0,
                                marginLeft: ".5rem",
                                color,
                            }}
                        >
                            {isIncome ? "+" : "-"}
                            {formatCurrency(Number(t.amount))}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
