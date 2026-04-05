"use client";

import { useState, useEffect, useCallback } from "react";
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

const emptyForm: FormData = {
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
    const [form, setForm] = useState<FormData>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [importError, setImportError] = useState("");

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

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-medium text-gray-900">
                        Transações
                    </h1>
                    <p className="text-sm text-gray-500">
                        {total} registros no total
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setShowImport(true);
                            setImportError("");
                        }}
                        className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        + Importar
                    </button>
                    <button
                        onClick={openCreate}
                        className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        + Nova
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 mb-5">
                {(["ALL", "INCOME", "EXPENSE"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => {
                            setFilter(f);
                            setPage(1);
                        }}
                        className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                            filter === f
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
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
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-sm text-gray-400">
                        Carregando...
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-400">
                        Nenhuma transação encontrada.
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                                    Descrição
                                </th>
                                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                                    Categoria
                                </th>
                                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">
                                    Data
                                </th>
                                <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium">
                                    Valor
                                </th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => (
                                <tr
                                    key={t.id}
                                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {t.title}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-400">
                                        {format(new Date(t.date), "dd/MM/yyyy")}
                                    </td>
                                    <td
                                        className={`px-4 py-3 text-sm font-medium text-right ${
                                            t.type === "INCOME"
                                                ? "text-green-600"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {t.type === "INCOME" ? "+" : "-"}
                                        {formatCurrency(Number(t.amount))}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-3 justify-end">
                                            <button
                                                onClick={() => openEdit(t)}
                                                className="text-xs text-blue-500 hover:text-blue-700"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(t.id)
                                                }
                                                className="text-xs text-red-400 hover:text-red-600"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Paginação */}
            {total > 15 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                    >
                        Anterior
                    </button>
                    <span className="px-3 py-1.5 text-sm text-gray-500">
                        Página {page} de {Math.ceil(total / 15)}
                    </span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= Math.ceil(total / 15)}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                    >
                        Próxima
                    </button>
                </div>
            )}

            {/* Modal criar/editar */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-base font-medium text-gray-900 mb-5">
                            {editingId ? "Editar transação" : "Nova transação"}
                        </h2>
                        <div className="space-y-4">
                            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
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
                                        className={`flex-1 py-2 text-sm transition-colors ${
                                            form.type === t
                                                ? t === "EXPENSE"
                                                    ? "bg-red-500 text-white"
                                                    : "bg-green-500 text-white"
                                                : "text-gray-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        {t === "EXPENSE" ? "Gasto" : "Receita"}
                                    </button>
                                ))}
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">
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
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">
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
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">
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
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">
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
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Selecione...</option>
                                    {categories.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">
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
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 border border-gray-200 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50"
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
                                className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal importar */}
            {showImport && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6">
                        <h2 className="text-base font-medium text-gray-900 mb-2">
                            Importar transações
                        </h2>
                        <p className="text-xs text-gray-400 mb-5">
                            Escolha o formato do arquivo
                        </p>
                        <div className="space-y-3">
                            {[
                                {
                                    label: "JSON",
                                    accept: ".json",
                                    type: "json" as const,
                                    color: "amber",
                                },
                                {
                                    label: "Excel (.xlsx)",
                                    accept: ".xlsx,.xls",
                                    type: "excel" as const,
                                    color: "green",
                                },
                                {
                                    label: "PDF",
                                    accept: ".pdf",
                                    type: "pdf" as const,
                                    color: "red",
                                },
                            ].map((opt) => (
                                <label
                                    key={opt.type}
                                    className="flex items-center gap-3 border border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <span
                                        className={`text-xs font-medium px-2 py-0.5 rounded-full bg-${opt.color}-100 text-${opt.color}-700`}
                                    >
                                        {opt.label}
                                    </span>
                                    <span className="text-sm text-gray-600 flex-1">
                                        Selecionar arquivo
                                    </span>
                                    <input
                                        type="file"
                                        accept={opt.accept}
                                        className="hidden"
                                        onChange={(e) =>
                                            handleFileImport(e, opt.type)
                                        }
                                    />
                                </label>
                            ))}
                            <label className="flex items-center gap-3 border border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                    Formulário
                                </span>
                                <button
                                    className="text-sm text-gray-600 flex-1 text-left"
                                    onClick={() => {
                                        setShowImport(false);
                                        openCreate();
                                    }}
                                >
                                    Adicionar manualmente
                                </button>
                            </label>
                        </div>
                        {importError && (
                            <p className="text-xs text-red-500 mt-3">
                                {importError}
                            </p>
                        )}
                        <button
                            onClick={() => setShowImport(false)}
                            className="w-full mt-4 border border-gray-200 rounded-lg py-2 text-sm text-gray-500 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
