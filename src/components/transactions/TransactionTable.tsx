"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import Badge from "@/components/ui/Badge";
import { formatCurrency, parseSafeDate } from "@/lib/formatters";
import type {
    Transaction,
    TransactionSortColumn,
    SortDirection,
} from "@/types";

export type { TransactionSortColumn as SortColumn };

interface TransactionTableProps {
    transactions: Transaction[];
    sortColumn: TransactionSortColumn | null;
    sortDirection: SortDirection;
    onSort: (col: TransactionSortColumn) => void;
    onEdit: (t: Transaction) => void;
    onDelete: (id: string) => void;
}

function SortIcon({
    column,
    sortColumn,
    sortDirection,
}: {
    column: TransactionSortColumn;
    sortColumn: TransactionSortColumn | null;
    sortDirection: SortDirection;
}) {
    const active = sortColumn === column;
    return (
        <span
            style={{
                display: "inline-flex",
                flexDirection: "column",
                gap: "1px",
                marginLeft: "5px",
                verticalAlign: "middle",
                opacity: active ? 1 : 0.3,
                transition: "opacity var(--transition-base)",
            }}
        >
            <svg
                width="7"
                height="5"
                viewBox="0 0 7 5"
                aria-hidden
                fill={
                    active && sortDirection === "asc"
                        ? "var(--accent-brand-light)"
                        : "var(--text-muted)"
                }
            >
                <path d="M3.5 0L7 5H0L3.5 0Z" />
            </svg>
            <svg
                width="7"
                height="5"
                viewBox="0 0 7 5"
                aria-hidden
                fill={
                    active && sortDirection === "desc"
                        ? "var(--accent-brand-light)"
                        : "var(--text-muted)"
                }
            >
                <path d="M3.5 5L0 0H7L3.5 5Z" />
            </svg>
        </span>
    );
}

function TypeIcon({ isIncome }: { isIncome: boolean }) {
    return (
        <svg
            width="11"
            height="11"
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

const TH_COLS: {
    col: TransactionSortColumn;
    label: string;
    align?: "left" | "right";
}[] = [
    { col: "title", label: "Descrição" },
    { col: "category", label: "Categoria" },
    { col: "date", label: "Data" },
    { col: "amount", label: "Valor", align: "right" },
];

function sortTransactions(
    transactions: Transaction[],
    col: TransactionSortColumn | null,
    dir: SortDirection,
): Transaction[] {
    if (!col) return transactions;
    return [...transactions].sort((a, b) => {
        let va: string | number;
        let vb: string | number;
        switch (col) {
            case "title":
                va = a.title.toLowerCase();
                vb = b.title.toLowerCase();
                break;
            case "category":
                va = a.category.toLowerCase();
                vb = b.category.toLowerCase();
                break;
            case "date":
                va = new Date(a.date).getTime();
                vb = new Date(b.date).getTime();
                break;
            case "amount":
                va = Number(a.amount);
                vb = Number(b.amount);
                break;
            default:
                return 0;
        }
        if (va < vb) return dir === "asc" ? -1 : 1;
        if (va > vb) return dir === "asc" ? 1 : -1;
        return 0;
    });
}

export default function TransactionTable({
    transactions,
    sortColumn,
    sortDirection,
    onSort,
    onEdit,
    onDelete,
}: TransactionTableProps) {
    const sorted = useMemo(
        () => sortTransactions(transactions, sortColumn, sortDirection),
        [transactions, sortColumn, sortDirection],
    );

    return (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    {TH_COLS.map(({ col, label, align = "left" }) => (
                        <th
                            key={col}
                            onClick={() => onSort(col)}
                            style={{
                                padding: ".75rem 1rem",
                                textAlign: align,
                                fontSize: "var(--text-xs)",
                                fontWeight: 600,
                                color:
                                    sortColumn === col
                                        ? "var(--accent-brand-light)"
                                        : "var(--text-muted)",
                                textTransform: "uppercase",
                                letterSpacing: ".06em",
                                background: "var(--bg-elevated)",
                                whiteSpace: "nowrap",
                                cursor: "pointer",
                                userSelect: "none",
                                verticalAlign: "middle",
                                transition: "color var(--transition-base)",
                            }}
                        >
                            {label}
                            <SortIcon
                                column={col}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                            />
                        </th>
                    ))}
                    <th
                        style={{
                            padding: ".75rem 1rem",
                            background: "var(--bg-elevated)",
                            width: "120px",
                        }}
                    />
                </tr>
            </thead>

            <tbody>
                {sorted.map((t) => {
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
                        <tr
                            key={t.id}
                            style={{
                                borderBottom: "1px solid var(--border-subtle)",
                                verticalAlign: "middle",
                            }}
                            className="tx-table-row"
                        >
                            <td
                                style={{
                                    padding: ".75rem 1rem",
                                    verticalAlign: "middle",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: ".625rem",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "28px",
                                            height: "28px",
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
                                        <TypeIcon isIncome={isIncome} />
                                    </div>
                                    <span
                                        style={{
                                            fontSize: "var(--text-sm)",
                                            color: "var(--text-primary)",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {t.title}
                                    </span>
                                </div>
                            </td>

                            <td style={{ padding: ".75rem 1rem" }}>
                                <Badge variant="neutral">{t.category}</Badge>
                            </td>

                            <td
                                style={{
                                    padding: ".75rem 1rem",
                                    fontSize: "var(--text-sm)",
                                    color: "var(--text-muted)",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {format(parseSafeDate(t.date), "dd/MM/yyyy")}
                            </td>

                            <td
                                style={{
                                    padding: ".75rem 1rem",
                                    textAlign: "right",
                                }}
                            >
                                <span
                                    className="font-mono"
                                    style={{
                                        fontSize: "var(--text-sm)",
                                        fontWeight: 600,
                                        color,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {isIncome ? "+" : "-"}
                                    {formatCurrency(Number(t.amount))}
                                </span>
                            </td>

                            <td
                                style={{
                                    padding: ".75rem 1rem",
                                    textAlign: "right",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        gap: ".5rem",
                                        justifyContent: "flex-end",
                                    }}
                                >
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
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
