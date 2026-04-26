"use client";

import { format } from "date-fns";
import { TransactionIcon } from "@/components/ui/TransactionIcon";
import { formatCurrency, parseSafeDate } from "@/utils";
import { transactionColorTokens } from "@/styles/design-tokens";
import type { Transaction } from "@/types";

interface TransactionCardListProps {
    transactions: Transaction[];
    onEdit: (t: Transaction) => void;
    onDelete: (id: string) => void;
}

export default function TransactionCardList({
    transactions,
    onEdit,
    onDelete,
}: TransactionCardListProps) {
    return (
        <div>
            {transactions.map((t) => {
                const { color } = transactionColorTokens(t.type);
                const isIncome = t.type === "INCOME";

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
                        <TransactionIcon type={t.type} size={36} />

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
                                {format(parseSafeDate(t.date), "dd/MM/yyyy")}
                            </p>
                        </div>

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
                                {formatCurrency(Number(t.amount))}
                            </span>
                            <div style={{ display: "flex", gap: ".25rem" }}>
                                <button
                                    onClick={() => onEdit(t)}
                                    className="tx-action-btn tx-action-btn--edit"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(t.id)}
                                    className="tx-action-btn tx-action-btn--delete"
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
