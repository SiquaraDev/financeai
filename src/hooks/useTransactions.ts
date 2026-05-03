"use client";

import { useState, useEffect, useCallback } from "react";
import { transactionService } from "@/services";
import type {
    Transaction,
    FilterType,
    TransactionFormData,
    PaginatedResponse,
} from "@/types";
import { EMPTY_TRANSACTION_FORM } from "@/types";
interface UseTransactionsReturn {
    transactions: Transaction[];
    total: number;
    page: number;
    filter: FilterType;
    loading: boolean;
    setPage: (p: number) => void;
    setFilter: (f: FilterType) => void;
    refetch: () => void;
    showModal: boolean;
    showImport: boolean;
    showExport: boolean;
    editingId: string | null;
    form: TransactionFormData;
    saving: boolean;
    importError: string;
    openCreate: () => void;
    openEdit: (t: Transaction) => void;
    closeModal: () => void;
    openImport: () => void;
    closeImport: () => void;
    openExport: () => void;
    closeExport: () => void;
    updateForm: (updates: Partial<TransactionFormData>) => void;
    handleSave: () => Promise<void>;
    handleDelete: (id: string) => Promise<void>;
    handleFileImport: (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "json" | "csv",
    ) => void;
    handleExport: (type: "json" | "csv") => Promise<void>;
}

function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function useTransactions(): UseTransactionsReturn {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<FilterType>("ALL");
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [showExport, setShowExport] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<TransactionFormData>(
        EMPTY_TRANSACTION_FORM,
    );
    const [saving, setSaving] = useState(false);
    const [importError, setImportError] = useState("");

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const result: PaginatedResponse<Transaction> =
                await transactionService.fetchTransactions({
                    page,
                    limit: 15,
                    filter,
                });
            setTransactions(result.data);
            setTotal(result.total);
        } finally {
            setLoading(false);
        }
    }, [page, filter]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleSetFilter = useCallback((f: FilterType) => {
        setFilter(f);
        setPage(1);
    }, []);

    const openCreate = useCallback(() => {
        setForm(EMPTY_TRANSACTION_FORM);
        setEditingId(null);
        setShowModal(true);
    }, []);

    const openEdit = useCallback((t: Transaction) => {
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
    }, []);

    const closeModal = useCallback(() => setShowModal(false), []);

    const openImport = useCallback(() => {
        setImportError("");
        setShowImport(true);
    }, []);

    const closeImport = useCallback(() => setShowImport(false), []);

    const updateForm = useCallback((updates: Partial<TransactionFormData>) => {
        setForm((prev) => ({ ...prev, ...updates }));
    }, []);

    const handleSave = useCallback(async () => {
        setSaving(true);
        const result = editingId
            ? await transactionService.updateTransaction(editingId, form)
            : await transactionService.createTransaction(form);

        if (result.success) {
            setShowModal(false);
            fetchTransactions();
        }
        setSaving(false);
    }, [form, editingId, fetchTransactions]);

    const handleDelete = useCallback(
        async (id: string) => {
            if (!confirm("Excluir esta transação?")) return;
            const result = await transactionService.deleteTransaction(id);
            if (result.success) fetchTransactions();
        },
        [fetchTransactions],
    );

    const importJSON = useCallback(
        async (file: File) => {
            try {
                const text = await file.text();
                const items = JSON.parse(text);
                const list = Array.isArray(items) ? items : [items];
                const result = await transactionService.bulkCreate(
                    list,
                    "JSON",
                );
                if (result.success) {
                    setShowImport(false);
                    fetchTransactions();
                } else {
                    setImportError("Erro ao importar transações.");
                }
            } catch {
                setImportError(
                    "JSON inválido. Verifique o formato do arquivo.",
                );
            }
        },
        [fetchTransactions],
    );

    const importCsv = useCallback(
        async (file: File) => {
            try {
                const raw = await file.text();
                const text = raw.replace(/^\uFEFF/, "");

                const parseRow = (line: string): string[] => {
                    const fields: string[] = [];
                    let current = "";
                    let insideQuotes = false;

                    for (let i = 0; i < line.length; i++) {
                        const char = line[i];
                        if (char === '"') {
                            if (insideQuotes && line[i + 1] === '"') {
                                current += '"';
                                i++;
                            } else {
                                insideQuotes = !insideQuotes;
                            }
                        } else if (char === "," && !insideQuotes) {
                            fields.push(current.trim());
                            current = "";
                        } else {
                            current += char;
                        }
                    }
                    fields.push(current.trim());
                    return fields;
                };

                const [headerLine, ...lines] = text.trim().split("\n");
                const headers = parseRow(headerLine);

                const items = lines
                    .filter((line) => line.trim())
                    .map((line) => {
                        const values = parseRow(line);
                        const row = Object.fromEntries(
                            headers.map((h, i) => [h, values[i] ?? ""]),
                        );
                        const rawType = (
                            row["tipo"] ??
                            row["type"] ??
                            "EXPENSE"
                        ).toUpperCase();
                        return {
                            title: row["titulo"] ?? row["title"] ?? "Importado",
                            amount: String(
                                Number(row["valor"] ?? row["amount"] ?? 0),
                            ),
                            type: (rawType === "INCOME"
                                ? "INCOME"
                                : "EXPENSE") as "INCOME" | "EXPENSE",
                            category:
                                row["categoria"] ?? row["category"] ?? "Outros",
                            date:
                                row["data"] ??
                                row["date"] ??
                                new Date().toISOString().split("T")[0],
                            description:
                                row["descricao"] ?? row["description"] ?? "",
                        };
                    });

                const result = await transactionService.bulkCreate(
                    items,
                    "CSV",
                );
                if (result.success) {
                    setShowImport(false);
                    fetchTransactions();
                } else {
                    setImportError("Erro ao importar arquivo CSV.");
                }
            } catch {
                setImportError("Erro ao ler o arquivo CSV.");
            }
        },
        [fetchTransactions],
    );

    const handleFileImport = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, type: "json" | "csv") => {
            const file = e.target.files?.[0];
            if (!file) return;
            setImportError("");
            if (type === "json") importJSON(file);
            else importCsv(file);
        },
        [importJSON, importCsv],
    );

    const openExport = useCallback(() => setShowExport(true), []);
    const closeExport = useCallback(() => setShowExport(false), []);

    const handleExport = useCallback(
        async (type: "json" | "csv") => {
            const result = await transactionService.fetchTransactions({
                page: 1,
                limit: 10000,
                filter,
            });

            const data = result.data;

            if (type === "json") {
                const blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: "application/json",
                });
                triggerDownload(blob, "transacoes.json");
            } else {
                const headers = [
                    "titulo",
                    "valor",
                    "tipo",
                    "categoria",
                    "data",
                    "descricao",
                ];
                const rows = data.map((t) => [
                    t.title,
                    t.amount,
                    t.type,
                    t.category,
                    t.date.split("T")[0],
                    t.description ?? "",
                ]);
                const csv = [headers, ...rows]
                    .map((row) =>
                        row
                            .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                            .join(","),
                    )
                    .join("\n");
                const blob = new Blob(["\uFEFF" + csv], {
                    type: "text/csv;charset=utf-8;",
                });
                triggerDownload(blob, "transacoes.csv");
            }

            setShowExport(false);
        },
        [filter],
    );

    return {
        transactions,
        total,
        page,
        filter,
        loading,
        setPage,
        setFilter: handleSetFilter,
        refetch: fetchTransactions,
        showModal,
        showImport,
        showExport,
        editingId,
        form,
        saving,
        importError,
        openCreate,
        openEdit,
        closeModal,
        openImport,
        closeImport,
        openExport,
        closeExport,
        updateForm,
        handleSave,
        handleDelete,
        handleFileImport,
        handleExport,
    };
}
