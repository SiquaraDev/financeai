"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { TRANSACTION_CATEGORIES } from "@/types";
import * as XLSX from "xlsx";

interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
    date: string;
    description?: string;
    source: string;
}

interface FormData {
    title: string;
    amount: string;
    type: "INCOME" | "EXPENSE";
    category: string;
    date: string;
    description: string;
}

type SortColumn = "title" | "category" | "date" | "amount" | null;
type SortDirection = "asc" | "desc";

const emptyForm: FormData = {
    title: "",
    amount: "",
    type: "EXPENSE",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
};

/* ── Ícone de ordenação ── */
function SortIcon({
    column,
    sortColumn,
    sortDirection,
}: {
    column: SortColumn;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
}) {
    const isActive = sortColumn === column;
    return (
        <span
            style={{
                display: "inline-flex",
                flexDirection: "column",
                gap: "1px",
                marginLeft: "5px",
                verticalAlign: "middle",
                opacity: isActive ? 1 : 0.3,
                transition: "opacity var(--transition-base)",
            }}
        >
            {/* seta cima */}
            <svg
                width="7"
                height="5"
                viewBox="0 0 7 5"
                fill={
                    isActive && sortDirection === "asc"
                        ? "var(--accent-brand-light)"
                        : "var(--text-muted)"
                }
            >
                <path d="M3.5 0L7 5H0L3.5 0Z" />
            </svg>
            {/* seta baixo */}
            <svg
                width="7"
                height="5"
                viewBox="0 0 7 5"
                fill={
                    isActive && sortDirection === "desc"
                        ? "var(--accent-brand-light)"
                        : "var(--text-muted)"
                }
            >
                <path d="M3.5 5L0 0H7L3.5 5Z" />
            </svg>
        </span>
    );
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<FormData>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [importError, setImportError] = useState("");

    /* ── Ordenação ── */
    const [sortColumn, setSortColumn] = useState<SortColumn>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            // mesma coluna → inverte direção
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            // coluna nova → reseta para asc
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    /* ── Transações ordenadas (client-side) ── */
    const sortedTransactions = useMemo(() => {
        if (!sortColumn) return transactions;

        return [...transactions].sort((a, b) => {
            let valA: string | number;
            let valB: string | number;

            switch (sortColumn) {
                case "title":
                    valA = a.title.toLowerCase();
                    valB = b.title.toLowerCase();
                    break;
                case "category":
                    valA = a.category.toLowerCase();
                    valB = b.category.toLowerCase();
                    break;
                case "date":
                    valA = new Date(a.date).getTime();
                    valB = new Date(b.date).getTime();
                    break;
                case "amount":
                    valA = Number(a.amount);
                    valB = Number(b.amount);
                    break;
                default:
                    return 0;
            }

            if (valA < valB) return sortDirection === "asc" ? -1 : 1;
            if (valA > valB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [transactions, sortColumn, sortDirection]);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), limit: "15" });
        if (filter !== "ALL") params.set("type", filter);
        const res = await fetch(`/api/transactions?${params}`);
        const data = await res.json();
        setTransactions(data.transactions ?? []);
        setTotal(data.total ?? 0);
        setLoading(false);
    }, [page, filter]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const openCreate = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowModal(true);
    };

    const openEdit = (t: Transaction) => {
        setForm({
            title: t.title,
            amount: String(t.amount),
            type: t.type,
            category: t.category,
            date: t.date.split("T")[0],
            description: t.description ?? "",
        });
        setEditingId(t.id);
        setShowModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        const payload = { ...form, amount: parseFloat(form.amount) };
        const url = editingId
            ? `/api/transactions/${editingId}`
            : "/api/transactions";
        const method = editingId ? "PUT" : "POST";
        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        setShowModal(false);
        setSaving(false);
        fetchTransactions();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir esta transação?")) return;
        await fetch(`/api/transactions/${id}`, { method: "DELETE" });
        fetchTransactions();
    };

    const handleImportJSON = async (file: File) => {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            const items = Array.isArray(data) ? data : [data];
            for (const item of items) {
                await fetch("/api/transactions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...item, source: "JSON" }),
                });
            }
            setShowImport(false);
            fetchTransactions();
        } catch {
            setImportError("JSON inválido. Verifique o formato do arquivo.");
        }
    };

    const handleImportExcel = async (file: File) => {
        try {
            const buffer = await file.arrayBuffer();
            const wb = XLSX.read(buffer);
            const ws = wb.Sheets[wb.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(ws) as Record<
                string,
                unknown
            >[];
            for (const row of rows) {
                await fetch("/api/transactions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: row["titulo"] ?? row["title"] ?? "Importado",
                        amount: Number(row["valor"] ?? row["amount"] ?? 0),
                        type: row["tipo"] ?? row["type"] ?? "EXPENSE",
                        category:
                            row["categoria"] ?? row["category"] ?? "Outros",
                        date:
                            row["data"] ??
                            row["date"] ??
                            new Date().toISOString(),
                        source: "EXCEL",
                    }),
                });
            }
            setShowImport(false);
            fetchTransactions();
        } catch {
            setImportError("Erro ao ler o arquivo Excel.");
        }
    };

    const handleFileImport = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "json" | "excel" | "pdf",
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImportError("");
        if (type === "json") handleImportJSON(file);
        if (type === "excel") handleImportExcel(file);
        if (type === "pdf")
            setImportError(
                "Importação de PDF: implemente extração no backend com pdf-parse.",
            );
    };

    const formatCurrency = (v: number) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(v);

    const categories =
        form.type === "INCOME"
            ? TRANSACTION_CATEGORIES.INCOME
            : TRANSACTION_CATEGORIES.EXPENSE;

    /* ── Cabeçalho de coluna clicável ── */
    const ThCol = ({
        col,
        label,
        align = "left",
    }: {
        col: SortColumn;
        label: string;
        align?: "left" | "right";
    }) => (
        <th
            onClick={() => handleSort(col)}
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
            onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-secondary)")
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                    sortColumn === col
                        ? "var(--accent-brand-light)"
                        : "var(--text-muted)")
            }
        >
            {label}
            <SortIcon
                column={col}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
            />
        </th>
    );

    return (
        <div
            style={{
                padding: "clamp(.75rem, 4vw, 2rem)",
                width: "100%",
                maxWidth: "1400px",
                margin: "0 auto",
                boxSizing: "border-box",
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                    flexWrap: "wrap",
                }}
            >
                <div>
                    <h1
                        className="font-display"
                        style={{
                            fontSize: "clamp(18px, 5vw, 28px)",
                            fontWeight: 800,
                            color: "var(--text-primary)",
                            letterSpacing: "-0.03em",
                            lineHeight: 1.2,
                        }}
                    >
                        Transações
                    </h1>
                    <p
                        style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--text-muted)",
                            marginTop: ".25rem",
                        }}
                    >
                        {total} registro{total !== 1 ? "s" : ""} no total
                    </p>
                </div>
                <div style={{ display: "flex", gap: ".625rem", flexShrink: 0 }}>
                    <button
                        onClick={() => {
                            setShowImport(true);
                            setImportError("");
                        }}
                        className="btn-ghost"
                        style={{
                            padding: ".5rem 1rem",
                            fontSize: "var(--text-sm)",
                            borderRadius: "var(--radius-md)",
                            display: "flex",
                            alignItems: "center",
                            gap: ".375rem",
                        }}
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Importar
                    </button>
                    <button
                        onClick={openCreate}
                        className="btn-primary"
                        style={{
                            padding: ".5rem 1rem",
                            fontSize: "var(--text-sm)",
                            borderRadius: "var(--radius-md)",
                            display: "flex",
                            alignItems: "center",
                            gap: ".375rem",
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
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Nova
                    </button>
                </div>
            </div>

            {/* Filtros de tipo */}
            <div
                style={{
                    display: "flex",
                    gap: ".5rem",
                    marginBottom: "1.25rem",
                    flexWrap: "wrap",
                }}
            >
                {(["ALL", "INCOME", "EXPENSE"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => {
                            setFilter(f);
                            setPage(1);
                        }}
                        style={{
                            padding: ".375rem .875rem",
                            borderRadius: "var(--radius-full)",
                            fontSize: "var(--text-sm)",
                            fontWeight: filter === f ? 600 : 500,
                            cursor: "pointer",
                            transition: "all var(--transition-base)",
                            border:
                                filter === f
                                    ? "none"
                                    : "1px solid var(--border)",
                            background:
                                filter === f
                                    ? "var(--gradient-brand)"
                                    : "transparent",
                            color:
                                filter === f
                                    ? "var(--text-on-brand)"
                                    : "var(--text-muted)",
                            boxShadow:
                                filter === f ? "var(--shadow-brand)" : "none",
                        }}
                    >
                        {f === "ALL"
                            ? "Todas"
                            : f === "INCOME"
                              ? "Receitas"
                              : "Gastos"}
                    </button>
                ))}
            </div>

            {/* Lista */}
            <div className="card-glass" style={{ overflow: "hidden" }}>
                {loading ? (
                    <div
                        style={{
                            padding: "3rem",
                            textAlign: "center",
                            color: "var(--text-muted)",
                            fontSize: "var(--text-sm)",
                        }}
                    >
                        Carregando...
                    </div>
                ) : transactions.length === 0 ? (
                    <div style={{ padding: "3rem", textAlign: "center" }}>
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--text-dim)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ margin: "0 auto .75rem" }}
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
                            Nenhuma transação encontrada.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop: tabela */}
                        <div className="tx-table-wrapper">
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                }}
                            >
                                <thead>
                                    <tr
                                        style={{
                                            borderBottom:
                                                "1px solid var(--border-subtle)",
                                        }}
                                    >
                                        <ThCol col="title" label="Descrição" />
                                        <ThCol
                                            col="category"
                                            label="Categoria"
                                        />
                                        <ThCol col="date" label="Data" />
                                        <ThCol
                                            col="amount"
                                            label="Valor"
                                            align="right"
                                        />
                                        {/* coluna de ações — sem ordenação */}
                                        <th
                                            style={{
                                                padding: ".75rem 1rem",
                                                background:
                                                    "var(--bg-elevated)",
                                                width: "120px",
                                            }}
                                        />
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedTransactions.map((t) => (
                                        <tr
                                            key={t.id}
                                            style={{
                                                borderBottom:
                                                    "1px solid var(--border-subtle)",
                                                transition:
                                                    "background var(--transition-base)",
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
                                                            borderRadius:
                                                                "var(--radius-md)",
                                                            background:
                                                                t.type ===
                                                                "INCOME"
                                                                    ? "var(--color-success-bg)"
                                                                    : "var(--color-danger-bg)",
                                                            border: `1px solid ${t.type === "INCOME" ? "var(--color-success-border)" : "var(--color-danger-border)"}`,
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                    >
                                                        <svg
                                                            width="11"
                                                            height="11"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke={
                                                                t.type ===
                                                                "INCOME"
                                                                    ? "var(--color-success-light)"
                                                                    : "var(--color-danger-light)"
                                                            }
                                                            strokeWidth="2.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            {t.type ===
                                                            "INCOME" ? (
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
                                                            fontSize:
                                                                "var(--text-sm)",
                                                            color: "var(--text-primary)",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {t.title}
                                                    </span>
                                                </div>
                                            </td>
                                            <td
                                                style={{
                                                    padding: ".75rem 1rem",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize:
                                                            "var(--text-xs)",
                                                        fontWeight: 500,
                                                        padding: "2px 8px",
                                                        borderRadius:
                                                            "var(--radius-full)",
                                                        background:
                                                            "var(--bg-elevated)",
                                                        border: "1px solid var(--border-subtle)",
                                                        color: "var(--text-secondary)",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {t.category}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    padding: ".75rem 1rem",
                                                    fontSize: "var(--text-sm)",
                                                    color: "var(--text-muted)",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {format(
                                                    new Date(t.date),
                                                    "dd/MM/yyyy",
                                                )}
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
                                                        fontSize:
                                                            "var(--text-sm)",
                                                        fontWeight: 600,
                                                        color:
                                                            t.type === "INCOME"
                                                                ? "var(--color-success-light)"
                                                                : "var(--color-danger-light)",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {t.type === "INCOME"
                                                        ? "+"
                                                        : "-"}
                                                    {formatCurrency(
                                                        Number(t.amount),
                                                    )}
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
                                                        justifyContent:
                                                            "flex-end",
                                                    }}
                                                >
                                                    <button
                                                        onClick={() =>
                                                            openEdit(t)
                                                        }
                                                        style={{
                                                            fontSize:
                                                                "var(--text-xs)",
                                                            fontWeight: 500,
                                                            color: "var(--accent-brand-light)",
                                                            background: "none",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            padding: "4px 8px",
                                                            borderRadius:
                                                                "var(--radius-sm)",
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
                                                        onClick={() =>
                                                            handleDelete(t.id)
                                                        }
                                                        style={{
                                                            fontSize:
                                                                "var(--text-xs)",
                                                            fontWeight: 500,
                                                            color: "var(--color-danger-light)",
                                                            background: "none",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            padding: "4px 8px",
                                                            borderRadius:
                                                                "var(--radius-sm)",
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
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile: cards */}
                        <div className="tx-cards-wrapper">
                            {sortedTransactions.map((t) => (
                                <div
                                    key={t.id}
                                    style={{
                                        padding: ".75rem .625rem",
                                        borderBottom:
                                            "1px solid var(--border-subtle)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: ".5rem",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            flexShrink: 0,
                                            borderRadius: "var(--radius-md)",
                                            background:
                                                t.type === "INCOME"
                                                    ? "var(--color-success-bg)"
                                                    : "var(--color-danger-bg)",
                                            border: `1px solid ${t.type === "INCOME" ? "var(--color-success-border)" : "var(--color-danger-border)"}`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke={
                                                t.type === "INCOME"
                                                    ? "var(--color-success-light)"
                                                    : "var(--color-danger-light)"
                                            }
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            {t.type === "INCOME" ? (
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
                                                new Date(t.date),
                                                "dd/MM/yyyy",
                                            )}
                                        </p>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-end",
                                            gap: ".375rem",
                                            flexShrink: 0,
                                            minWidth: 0,
                                        }}
                                    >
                                        <span
                                            className="font-mono"
                                            style={{
                                                fontSize: "var(--text-xs)",
                                                fontWeight: 600,
                                                color:
                                                    t.type === "INCOME"
                                                        ? "var(--color-success-light)"
                                                        : "var(--color-danger-light)",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {t.type === "INCOME" ? "+" : "-"}
                                            {formatCurrency(Number(t.amount))}
                                        </span>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: ".25rem",
                                            }}
                                        >
                                            <button
                                                onClick={() => openEdit(t)}
                                                style={{
                                                    fontSize: "10px",
                                                    fontWeight: 500,
                                                    color: "var(--accent-brand-light)",
                                                    background:
                                                        "var(--accent-brand-glow)",
                                                    border: "1px solid var(--border-glow)",
                                                    cursor: "pointer",
                                                    padding: "3px 6px",
                                                    borderRadius:
                                                        "var(--radius-sm)",
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(t.id)
                                                }
                                                style={{
                                                    fontSize: "10px",
                                                    fontWeight: 500,
                                                    color: "var(--color-danger-light)",
                                                    background:
                                                        "var(--color-danger-bg)",
                                                    border: "1px solid var(--color-danger-border)",
                                                    cursor: "pointer",
                                                    padding: "3px 6px",
                                                    borderRadius:
                                                        "var(--radius-sm)",
                                                }}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Paginação */}
            {total > 15 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: ".75rem",
                        marginTop: "1.25rem",
                        flexWrap: "wrap",
                    }}
                >
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="btn-ghost"
                        style={{
                            padding: ".375rem .875rem",
                            fontSize: "var(--text-sm)",
                            borderRadius: "var(--radius-md)",
                            opacity: page === 1 ? 0.4 : 1,
                        }}
                    >
                        ← Anterior
                    </button>
                    <span
                        style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--text-muted)",
                        }}
                    >
                        {page} / {Math.ceil(total / 15)}
                    </span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= Math.ceil(total / 15)}
                        className="btn-ghost"
                        style={{
                            padding: ".375rem .875rem",
                            fontSize: "var(--text-sm)",
                            borderRadius: "var(--radius-md)",
                            opacity: page >= Math.ceil(total / 15) ? 0.4 : 1,
                        }}
                    >
                        Próxima →
                    </button>
                </div>
            )}

            {/* Modal criar/editar */}
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "var(--bg-overlay)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 50,
                        padding: "1rem",
                    }}
                >
                    <div
                        className="card-glass animate-fade-in-scale"
                        style={{
                            width: "100%",
                            maxWidth: "440px",
                            padding: "clamp(1.25rem, 4vw, 1.75rem)",
                            overflow: "hidden",
                            boxShadow:
                                "var(--shadow-xl), 0 0 0 1px var(--border-glow)",
                        }}
                    >
                        <div
                            style={{
                                height: "3px",
                                background: "var(--gradient-brand)",
                                margin: "-clamp(1.25rem, 4vw, 1.75rem) -clamp(1.25rem, 4vw, 1.75rem) 1.25rem",
                            }}
                        />
                        <h2
                            className="font-display"
                            style={{
                                fontSize: "var(--text-lg)",
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                marginBottom: "1.25rem",
                                marginTop: "1rem",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            {editingId ? "Editar transação" : "Nova transação"}
                        </h2>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                            }}
                        >
                            {/* Tipo */}
                            <div
                                style={{
                                    display: "flex",
                                    background: "var(--bg-surface)",
                                    border: "1px solid var(--border-subtle)",
                                    borderRadius: "var(--radius-lg)",
                                    padding: "4px",
                                }}
                            >
                                {(["EXPENSE", "INCOME"] as const).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() =>
                                            setForm((f) => ({
                                                ...f,
                                                type: t,
                                                category: "",
                                            }))
                                        }
                                        style={
                                            {
                                                flex: 1,
                                                padding: ".5rem",
                                                borderRadius:
                                                    "var(--radius-md)",
                                                fontSize: "var(--text-sm)",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                transition:
                                                    "all var(--transition-base)",
                                                background:
                                                    form.type === t
                                                        ? t === "EXPENSE"
                                                            ? "var(--color-danger-bg)"
                                                            : "var(--color-success-bg)"
                                                        : "transparent",
                                                color:
                                                    form.type === t
                                                        ? t === "EXPENSE"
                                                            ? "var(--color-danger-light)"
                                                            : "var(--color-success-light)"
                                                        : "var(--text-muted)",
                                                border:
                                                    form.type === t
                                                        ? `1px solid ${t === "EXPENSE" ? "var(--color-danger-border)" : "var(--color-success-border)"}`
                                                        : "1px solid transparent",
                                            } as React.CSSProperties
                                        }
                                    >
                                        {t === "EXPENSE" ? "Gasto" : "Receita"}
                                    </button>
                                ))}
                            </div>

                            {/* Descrição */}
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: "var(--text-xs)",
                                        fontWeight: 500,
                                        color: "var(--text-secondary)",
                                        marginBottom: ".375rem",
                                        textTransform: "uppercase",
                                        letterSpacing: ".05em",
                                    }}
                                >
                                    Descrição
                                </label>
                                <input
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            title: e.target.value,
                                        }))
                                    }
                                    placeholder="Ex: Supermercado"
                                    style={{
                                        width: "100%",
                                        padding: ".625rem .875rem",
                                    }}
                                />
                            </div>

                            {/* Valor + Data */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: ".75rem",
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "var(--text-xs)",
                                            fontWeight: 500,
                                            color: "var(--text-secondary)",
                                            marginBottom: ".375rem",
                                            textTransform: "uppercase",
                                            letterSpacing: ".05em",
                                        }}
                                    >
                                        Valor (R$)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={form.amount}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                amount: e.target.value,
                                            }))
                                        }
                                        placeholder="0,00"
                                        style={{
                                            width: "100%",
                                            padding: ".625rem .875rem",
                                        }}
                                    />
                                </div>
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "var(--text-xs)",
                                            fontWeight: 500,
                                            color: "var(--text-secondary)",
                                            marginBottom: ".375rem",
                                            textTransform: "uppercase",
                                            letterSpacing: ".05em",
                                        }}
                                    >
                                        Data
                                    </label>
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                date: e.target.value,
                                            }))
                                        }
                                        style={{
                                            width: "100%",
                                            padding: ".625rem .875rem",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Categoria */}
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: "var(--text-xs)",
                                        fontWeight: 500,
                                        color: "var(--text-secondary)",
                                        marginBottom: ".375rem",
                                        textTransform: "uppercase",
                                        letterSpacing: ".05em",
                                    }}
                                >
                                    Categoria
                                </label>
                                <select
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            category: e.target.value,
                                        }))
                                    }
                                    style={{
                                        width: "100%",
                                        padding: ".625rem .875rem",
                                    }}
                                >
                                    <option value="">Selecione...</option>
                                    {categories.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Observação */}
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: "var(--text-xs)",
                                        fontWeight: 500,
                                        color: "var(--text-secondary)",
                                        marginBottom: ".375rem",
                                        textTransform: "uppercase",
                                        letterSpacing: ".05em",
                                    }}
                                >
                                    Observação (opcional)
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            description: e.target.value,
                                        }))
                                    }
                                    rows={2}
                                    placeholder="Alguma anotação..."
                                    style={{
                                        width: "100%",
                                        padding: ".625rem .875rem",
                                        resize: "none",
                                    }}
                                />
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: ".75rem",
                                marginTop: "1.25rem",
                            }}
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn-ghost"
                                style={{
                                    flex: 1,
                                    padding: ".625rem",
                                    fontSize: "var(--text-sm)",
                                    borderRadius: "var(--radius-md)",
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={
                                    saving ||
                                    !form.title ||
                                    !form.amount ||
                                    !form.category
                                }
                                className="btn-primary"
                                style={{
                                    flex: 1,
                                    padding: ".625rem",
                                    fontSize: "var(--text-sm)",
                                    borderRadius: "var(--radius-md)",
                                    opacity:
                                        saving ||
                                        !form.title ||
                                        !form.amount ||
                                        !form.category
                                            ? 0.5
                                            : 1,
                                }}
                            >
                                {saving ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal importar */}
            {showImport && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "var(--bg-overlay)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 50,
                        padding: "1rem",
                    }}
                >
                    <div
                        className="card-glass animate-fade-in-scale"
                        style={{
                            width: "100%",
                            maxWidth: "360px",
                            padding: "clamp(1.25rem, 4vw, 1.75rem)",
                            boxShadow:
                                "var(--shadow-xl), 0 0 0 1px var(--border-glow)",
                        }}
                    >
                        <h2
                            className="font-display"
                            style={{
                                fontSize: "var(--text-lg)",
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                marginBottom: ".375rem",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Importar transações
                        </h2>
                        <p
                            style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--text-muted)",
                                marginBottom: "1.25rem",
                            }}
                        >
                            Escolha o formato do arquivo
                        </p>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: ".625rem",
                            }}
                        >
                            {[
                                {
                                    label: "JSON",
                                    accept: ".json",
                                    type: "json" as const,
                                    color: "var(--color-warning-light)",
                                    bg: "var(--color-warning-bg)",
                                    border: "var(--color-warning-border)",
                                },
                                {
                                    label: "Excel (.xlsx)",
                                    accept: ".xlsx,.xls",
                                    type: "excel" as const,
                                    color: "var(--color-success-light)",
                                    bg: "var(--color-success-bg)",
                                    border: "var(--color-success-border)",
                                },
                                {
                                    label: "PDF",
                                    accept: ".pdf",
                                    type: "pdf" as const,
                                    color: "var(--color-danger-light)",
                                    bg: "var(--color-danger-bg)",
                                    border: "var(--color-danger-border)",
                                },
                            ].map((opt) => (
                                <label
                                    key={opt.type}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: ".75rem",
                                        padding: ".75rem 1rem",
                                        borderRadius: "var(--radius-lg)",
                                        border: "1px solid var(--border-subtle)",
                                        cursor: "pointer",
                                        transition:
                                            "border-color var(--transition-base), background var(--transition-base)",
                                        background: "transparent",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.borderColor =
                                            "var(--border)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.borderColor =
                                            "var(--border-subtle)")
                                    }
                                >
                                    <span
                                        style={{
                                            fontSize: "var(--text-xs)",
                                            fontWeight: 600,
                                            padding: "2px 0",
                                            width: "80px",
                                            textAlign: "center",
                                            borderRadius: "var(--radius-full)",
                                            color: opt.color,
                                            background: opt.bg,
                                            border: `1px solid ${opt.border}`,
                                            whiteSpace: "nowrap",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {opt.label}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "var(--text-sm)",
                                            color: "var(--text-secondary)",
                                            flex: 1,
                                        }}
                                    >
                                        Selecionar arquivo
                                    </span>
                                    <input
                                        type="file"
                                        accept={opt.accept}
                                        style={{ display: "none" }}
                                        onChange={(e) =>
                                            handleFileImport(e, opt.type)
                                        }
                                    />
                                </label>
                            ))}
                        </div>

                        {importError && (
                            <p
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: "var(--color-danger-light)",
                                    marginTop: ".75rem",
                                }}
                            >
                                {importError}
                            </p>
                        )}

                        <button
                            onClick={() => setShowImport(false)}
                            className="btn-ghost"
                            style={{
                                width: "100%",
                                marginTop: "1rem",
                                padding: ".625rem",
                                fontSize: "var(--text-sm)",
                                borderRadius: "var(--radius-md)",
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
