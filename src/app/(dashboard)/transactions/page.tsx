"use client";

import { useState } from "react";
import { useTransactions } from "@/hooks";
import { useSort } from "@/hooks";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
    TransactionTable,
    TransactionCardList,
    TransactionModal,
    ImportModal,
} from "@/components/transactions";
import { IconUpload, IconPlus } from "@/components/icons";
import type { TransactionSortColumn, SelectOption, FilterType } from "@/types";

const FILTER_OPTIONS: SelectOption<FilterType>[] = [
    { value: "ALL", label: "Todas" },
    { value: "INCOME", label: "Receitas" },
    { value: "EXPENSE", label: "Gastos" },
];

export default function TransactionsPage() {
    const tx = useTransactions();
    const { sortColumn, sortDirection, handleSort } =
        useSort<TransactionSortColumn>();

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
