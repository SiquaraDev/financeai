"use client";

import { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";

import TransactionTable, {
    type SortColumn,
    type SortDirection,
    type Transaction,
} from "@/components/transactions/TransactionTable";
import TransactionCardList from "@/components/transactions/TransactionCardList";
import TransactionModal, {
    type TransactionFormData,
} from "@/components/transactions/TransactionModal";
import ImportModal from "@/components/transactions/ImportModal";
import { IconUpload, IconPlus } from "@/components/icons";

const EMPTY_FORM: TransactionFormData = {
    title: "",
    amount: "",
    type: "EXPENSE",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
};

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<TransactionFormData>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [importError, setImportError] = useState("");

    const [sortColumn, setSortColumn] = useState<SortColumn>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    /* ── Fetch ── */
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

    /* ── Ordenação ── */
    const handleSort = (col: SortColumn) => {
        if (sortColumn === col)
            setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
        else {
            setSortColumn(col);
            setSortDirection("asc");
        }
    };

    /* ── Modal criar/editar ── */
    const openCreate = () => {
        setForm(EMPTY_FORM);
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

    /* ── Importação ── */
    const handleImportJSON = async (file: File) => {
        try {
            const text = await file.text();
            const items = Array.isArray(JSON.parse(text))
                ? JSON.parse(text)
                : [JSON.parse(text)];
            for (const item of items)
                await fetch("/api/transactions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...item, source: "JSON" }),
                });
            setShowImport(false);
            fetchTransactions();
        } catch {
            setImportError("JSON inválido. Verifique o formato do arquivo.");
        }
    };

    const handleImportExcel = async (file: File) => {
        try {
            const wb = XLSX.read(await file.arrayBuffer());
            const rows = XLSX.utils.sheet_to_json(
                wb.Sheets[wb.SheetNames[0]],
            ) as Record<string, unknown>[];
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
            <style>{`
        .tx-table-wrapper { display: block; }
        .tx-cards-wrapper { display: none; }
        @media (max-width: 640px) { .tx-table-wrapper { display: none; } .tx-cards-wrapper { display: block; } }
      `}</style>

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
                        <IconUpload /> Importar
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
                        <IconPlus /> Nova
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
                        <div className="tx-table-wrapper">
                            <TransactionTable
                                transactions={transactions}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                                onSort={handleSort}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                            />
                        </div>
                        <div className="tx-cards-wrapper">
                            <TransactionCardList
                                transactions={transactions}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                            />
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

            {/* Modais */}
            {showModal && (
                <TransactionModal
                    form={form}
                    editingId={editingId}
                    saving={saving}
                    onFormChange={(updates) =>
                        setForm((f) => ({ ...f, ...updates }))
                    }
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
            {showImport && (
                <ImportModal
                    error={importError}
                    onImport={handleFileImport}
                    onClose={() => setShowImport(false)}
                />
            )}
        </div>
    );
}
