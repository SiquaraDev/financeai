"use client";

import { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import { transactionService } from "@/services";
import type {
    Transaction,
    FilterType,
    TransactionFormData,
    PaginatedResponse,
} from "@/types";
import { EMPTY_TRANSACTION_FORM } from "@/types";

export type { Transaction, FilterType, TransactionFormData };

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
    editingId: string | null;
    form: TransactionFormData;
    saving: boolean;
    importError: string;
    openCreate: () => void;
    openEdit: (t: Transaction) => void;
    closeModal: () => void;
    openImport: () => void;
    closeImport: () => void;
    updateForm: (updates: Partial<TransactionFormData>) => void;
    handleSave: () => Promise<void>;
    handleDelete: (id: string) => Promise<void>;
    handleFileImport: (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "json" | "excel" | "pdf",
    ) => void;
}

export function useTransactions(): UseTransactionsReturn {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<FilterType>("ALL");
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [showImport, setShowImport] = useState(false);
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

    const importExcel = useCallback(
        async (file: File) => {
            try {
                const wb = XLSX.read(await file.arrayBuffer());
                const rows = XLSX.utils.sheet_to_json(
                    wb.Sheets[wb.SheetNames[0]],
                ) as Record<string, unknown>[];

                const items = rows.map((row) => ({
                    title: String(row["titulo"] ?? row["title"] ?? "Importado"),
                    amount: String(Number(row["valor"] ?? row["amount"] ?? 0)),
                    type: String(row["tipo"] ?? row["type"] ?? "EXPENSE") as
                        | "INCOME"
                        | "EXPENSE",
                    category: String(
                        row["categoria"] ?? row["category"] ?? "Outros",
                    ),
                    date: String(
                        row["data"] ?? row["date"] ?? new Date().toISOString(),
                    ),
                    description: "",
                }));

                const result = await transactionService.bulkCreate(
                    items,
                    "EXCEL",
                );
                if (result.success) {
                    setShowImport(false);
                    fetchTransactions();
                } else {
                    setImportError("Erro ao importar arquivo Excel.");
                }
            } catch {
                setImportError("Erro ao ler o arquivo Excel.");
            }
        },
        [fetchTransactions],
    );

    const handleFileImport = useCallback(
        (
            e: React.ChangeEvent<HTMLInputElement>,
            type: "json" | "excel" | "pdf",
        ) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setImportError("");
            if (type === "json") importJSON(file);
            else if (type === "excel") importExcel(file);
            else
                setImportError(
                    "Importação de PDF: implemente extração no backend com pdf-parse.",
                );
        },
        [importJSON, importExcel],
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
        editingId,
        form,
        saving,
        importError,
        openCreate,
        openEdit,
        closeModal,
        openImport,
        closeImport,
        updateForm,
        handleSave,
        handleDelete,
        handleFileImport,
    };
}
