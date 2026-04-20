import { format } from "date-fns";

interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
    date: string;
}

const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(v);

export default function RecentTransactionsList({
    transactions,
}: {
    transactions: Transaction[];
}) {
    if (transactions.length === 0) {
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
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <p
                    style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--text-muted)",
                    }}
                >
                    Nenhuma transação no período
                </p>
            </div>
        );
    }

    return (
        <div>
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
                    <div key={t.id} className="tx-row">
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
                                }}
                            >
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    {isIncome ? (
                                        <>
                                            <line
                                                x1="12"
                                                y1="19"
                                                x2="12"
                                                y2="5"
                                            />
                                            <polyline points="5 12 12 5 19 12" />
                                        </>
                                    ) : (
                                        <>
                                            <line
                                                x1="12"
                                                y1="5"
                                                x2="12"
                                                y2="19"
                                            />
                                            <polyline points="19 12 12 19 5 12" />
                                        </>
                                    )}
                                </svg>
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
                                    {format(
                                        new Date(
                                            t.date.split("T")[0] + "T12:00:00",
                                        ),
                                        "dd/MM",
                                    )}
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
                            {fmt(Number(t.amount))}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
