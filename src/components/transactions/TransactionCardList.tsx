import { format } from "date-fns";
import type { Transaction } from "./TransactionTable";

interface TransactionCardListProps {
    transactions: Transaction[];
    onEdit: (t: Transaction) => void;
    onDelete: (id: string) => void;
}

const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(v);

export default function TransactionCardList({
    transactions,
    onEdit,
    onDelete,
}: TransactionCardListProps) {
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
                    <div
                        key={t.id}
                        style={{
                            padding: ".75rem .625rem",
                            borderBottom: "1px solid var(--border-subtle)",
                            display: "flex",
                            alignItems: "center",
                            gap: ".5rem",
                        }}
                    >
                        {/* Ícone */}
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
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
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
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
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                                style={{
                                    fontSize: "var(--text-sm)",
                                    fontWeight: 500,
                                    color: "var(--text-primary)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {t.title}
                            </p>
                            <p
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: "var(--text-muted)",
                                    marginTop: "2px",
                                }}
                            >
                                {t.category} ·{" "}
                                {format(
                                    new Date(
                                        t.date.split("T")[0] + "T12:00:00",
                                    ),
                                    "dd/MM/yyyy",
                                )}
                            </p>
                        </div>

                        {/* Valor + ações */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                gap: ".375rem",
                                flexShrink: 0,
                            }}
                        >
                            <span
                                className="font-mono"
                                style={{
                                    fontSize: "var(--text-xs)",
                                    fontWeight: 600,
                                    color,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {isIncome ? "+" : "-"}
                                {fmt(Number(t.amount))}
                            </span>
                            <div style={{ display: "flex", gap: ".25rem" }}>
                                <button
                                    onClick={() => onEdit(t)}
                                    style={{
                                        fontSize: "10px",
                                        fontWeight: 500,
                                        color: "var(--accent-brand-light)",
                                        background: "var(--accent-brand-glow)",
                                        border: "1px solid var(--border-glow)",
                                        cursor: "pointer",
                                        padding: "3px 6px",
                                        borderRadius: "var(--radius-sm)",
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(t.id)}
                                    style={{
                                        fontSize: "10px",
                                        fontWeight: 500,
                                        color: "var(--color-danger-light)",
                                        background: "var(--color-danger-bg)",
                                        border: "1px solid var(--color-danger-border)",
                                        cursor: "pointer",
                                        padding: "3px 6px",
                                        borderRadius: "var(--radius-sm)",
                                    }}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
