"use client";

import { useTransactions } from "@/hooks/useTransactions";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import TransactionTable from "@/components/transactions/TransactionTable";
import TransactionCardList from "@/components/transactions/TransactionCardList";
import TransactionModal from "@/components/transactions/TransactionModal";
import ImportModal from "@/components/transactions/ImportModal";
import { IconUpload, IconPlus } from "@/components/icons";
import type {
    SortColumn,
    SortDirection,
} from "@/components/transactions/TransactionTable";
import { useState } from "react";

const FILTER_OPTIONS = [
    { value: "ALL" as const, label: "Todas" },
    { value: "INCOME" as const, label: "Receitas" },
    { value: "EXPENSE" as const, label: "Gastos" },
];

export default function TransactionsPage() {
    const tx = useTransactions();

    const [sortColumn, setSortColumn] = useState<SortColumn>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    const handleSort = (col: SortColumn) => {
        if (sortColumn === col)
            setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
        else {
            setSortColumn(col);
            setSortDirection("asc");
        }
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
            <PageHeader
                title="Transações"
                subtitle={`${tx.total} registro${tx.total !== 1 ? "s" : ""} no total`}
                actions={
                    <>
                        <Button
                            variant="ghost"
                            icon={<IconUpload />}
                            onClick={tx.openImport}
                        >
                            Importar
                        </Button>
                        <Button
                            variant="primary"
                            icon={<IconPlus />}
                            onClick={tx.openCreate}
                        >
                            Nova
                        </Button>
                    </>
                }
            />

            <FilterBar
                options={FILTER_OPTIONS}
                active={tx.filter}
                onChange={tx.setFilter}
            />

            <Card variant="glass" padding={0}>
                {tx.loading ? (
                    <LoadingSpinner height={200} label="Carregando..." />
                ) : tx.transactions.length === 0 ? (
                    <EmptyState title="Nenhuma transação encontrada." />
                ) : (
                    <>
                        <div className="tx-table-wrapper">
                            <TransactionTable
                                transactions={tx.transactions}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                                onSort={handleSort}
                                onEdit={tx.openEdit}
                                onDelete={tx.handleDelete}
                            />
                        </div>
                        <div className="tx-cards-wrapper">
                            <TransactionCardList
                                transactions={tx.transactions}
                                onEdit={tx.openEdit}
                                onDelete={tx.handleDelete}
                            />
                        </div>
                    </>
                )}
            </Card>

            <Pagination
                page={tx.page}
                total={tx.total}
                pageSize={15}
                onPageChange={tx.setPage}
            />

            {tx.showModal && (
                <TransactionModal
                    form={tx.form}
                    editingId={tx.editingId}
                    saving={tx.saving}
                    onFormChange={tx.updateForm}
                    onSave={tx.handleSave}
                    onClose={tx.closeModal}
                />
            )}

            {tx.showImport && (
                <ImportModal
                    error={tx.importError}
                    onImport={tx.handleFileImport}
                    onClose={tx.closeImport}
                />
            )}
        </div>
    );
}
