"use client";

import { useMemo } from "react";
import { format } from "date-fns";

export type SortColumn = "title" | "category" | "date" | "amount" | null;
export type SortDirection = "asc" | "desc";

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
    date: string;
    description?: string;
    source?: string;
}

interface TransactionTableProps {
    transactions: Transaction[];
    sortColumn: SortColumn;
    sortDirection: SortDirection;
    onSort: (col: SortColumn) => void;
    onEdit: (t: Transaction) => void;
    onDelete: (id: string) => void;
}

const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(v);

function SortIcon({
    column,
    sortColumn,
    sortDirection,
}: {
    column: SortColumn;
    sortColumn: SortColumn;
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

const TH_COLS: { col: SortColumn; label: string; align?: "left" | "right" }[] =
    [
        { col: "title", label: "Descrição" },
        { col: "category", label: "Categoria" },
        { col: "date", label: "Data" },
        { col: "amount", label: "Valor", align: "right" },
    ];

export default function TransactionTable({
    transactions,
    sortColumn,
    sortDirection,
    onSort,
    onEdit,
    onDelete,
}: TransactionTableProps) {
    const sorted = useMemo(() => {
        if (!sortColumn) return transactions;
        return [...transactions].sort((a, b) => {
            let va: string | number;
            let vb: string | number;
            switch (sortColumn) {
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
            if (va < vb) return sortDirection === "asc" ? -1 : 1;
            if (va > vb) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [transactions, sortColumn, sortDirection]);

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
                    {/* Coluna de ações — sem ordenação */}
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
                                transition: "background var(--transition-base)",
                                verticalAlign: "middle",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background =
                                    "var(--bg-elevated)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                    "transparent")
                            }
                        >
                            {/* Descrição */}
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
                                        <svg
                                            width="11"
                                            height="11"
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

                            {/* Categoria */}
                            <td style={{ padding: ".75rem 1rem" }}>
                                <span
                                    style={{
                                        fontSize: "var(--text-xs)",
                                        fontWeight: 500,
                                        padding: "2px 8px",
                                        borderRadius: "var(--radius-full)",
                                        background: "var(--bg-elevated)",
                                        border: "1px solid var(--border-subtle)",
                                        color: "var(--text-secondary)",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {t.category}
                                </span>
                            </td>

                            {/* Data */}
                            <td
                                style={{
                                    padding: ".75rem 1rem",
                                    fontSize: "var(--text-sm)",
                                    color: "var(--text-muted)",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {format(
                                    new Date(
                                        t.date.split("T")[0] + "T12:00:00",
                                    ),
                                    "dd/MM/yyyy",
                                )}
                            </td>

                            {/* Valor */}
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
                                    {fmt(Number(t.amount))}
                                </span>
                            </td>

                            {/* Ações */}
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
                                        style={{
                                            fontSize: "var(--text-xs)",
                                            fontWeight: 500,
                                            color: "var(--accent-brand-light)",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: "4px 8px",
                                            borderRadius: "var(--radius-sm)",
                                            transition:
                                                "background var(--transition-base)",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background =
                                                "var(--accent-brand-glow)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background =
                                                "none")
                                        }
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onDelete(t.id)}
                                        style={{
                                            fontSize: "var(--text-xs)",
                                            fontWeight: 500,
                                            color: "var(--color-danger-light)",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: "4px 8px",
                                            borderRadius: "var(--radius-sm)",
                                            transition:
                                                "background var(--transition-base)",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background =
                                                "var(--color-danger-bg)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background =
                                                "none")
                                        }
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
