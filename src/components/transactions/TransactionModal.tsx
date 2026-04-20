"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { TRANSACTION_CATEGORIES } from "@/types";

export interface TransactionFormData {
    title: string;
    amount: string;
    type: "INCOME" | "EXPENSE";
    category: string;
    date: string;
    description: string;
}

interface TransactionModalProps {
    form: TransactionFormData;
    editingId: string | null;
    saving: boolean;
    onFormChange: (updates: Partial<TransactionFormData>) => void;
    onSave: () => void;
    onClose: () => void;
}

function ModalLabel({ children }: { children: React.ReactNode }) {
    return (
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
            {children}
        </label>
    );
}

export default function TransactionModal({
    form,
    editingId,
    saving,
    onFormChange,
    onSave,
    onClose,
}: TransactionModalProps) {
    const categories =
        form.type === "INCOME"
            ? TRANSACTION_CATEGORIES.INCOME
            : TRANSACTION_CATEGORIES.EXPENSE;

    const canSave = !saving && !!form.title && !!form.amount && !!form.category;

    return (
        <Modal
            onClose={onClose}
            maxWidth={440}
            accentBar="brand"
            ariaLabel={editingId ? "Editar transação" : "Nova transação"}
        >
            <h2
                className="font-display"
                style={{
                    fontSize: "var(--text-lg)",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "1.25rem",
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
                <div
                    style={{
                        display: "flex",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-lg)",
                        padding: "4px",
                    }}
                >
                    {(["EXPENSE", "INCOME"] as const).map((t) => {
                        const isActive = form.type === t;
                        const isExpense = t === "EXPENSE";
                        return (
                            <button
                                key={t}
                                onClick={() =>
                                    onFormChange({ type: t, category: "" })
                                }
                                style={{
                                    flex: 1,
                                    padding: ".5rem",
                                    borderRadius: "var(--radius-md)",
                                    fontSize: "var(--text-sm)",
                                    fontWeight: 600,
                                    fontFamily: "var(--font-body)",
                                    cursor: "pointer",
                                    transition: "all var(--transition-base)",
                                    background: isActive
                                        ? isExpense
                                            ? "var(--color-danger-bg)"
                                            : "var(--color-success-bg)"
                                        : "transparent",
                                    color: isActive
                                        ? isExpense
                                            ? "var(--color-danger-light)"
                                            : "var(--color-success-light)"
                                        : "var(--text-muted)",
                                    border: isActive
                                        ? `1px solid ${isExpense ? "var(--color-danger-border)" : "var(--color-success-border)"}`
                                        : "1px solid transparent",
                                }}
                            >
                                {t === "EXPENSE" ? "Gasto" : "Receita"}
                            </button>
                        );
                    })}
                </div>

                <div>
                    <ModalLabel>Descrição</ModalLabel>
                    <input
                        value={form.title}
                        onChange={(e) =>
                            onFormChange({ title: e.target.value })
                        }
                        placeholder="Ex: Supermercado"
                        style={{ width: "100%", padding: ".625rem .875rem" }}
                    />
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: ".75rem",
                    }}
                >
                    <div>
                        <ModalLabel>Valor (R$)</ModalLabel>
                        <input
                            type="number"
                            step="0.01"
                            value={form.amount}
                            onChange={(e) =>
                                onFormChange({ amount: e.target.value })
                            }
                            placeholder="0,00"
                            style={{
                                width: "100%",
                                padding: ".625rem .875rem",
                            }}
                        />
                    </div>
                    <div>
                        <ModalLabel>Data</ModalLabel>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) =>
                                onFormChange({ date: e.target.value })
                            }
                            style={{
                                width: "100%",
                                padding: ".625rem .875rem",
                            }}
                        />
                    </div>
                </div>

                <div>
                    <ModalLabel>Categoria</ModalLabel>
                    <select
                        value={form.category}
                        onChange={(e) =>
                            onFormChange({ category: e.target.value })
                        }
                        style={{ width: "100%", padding: ".625rem .875rem" }}
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
                    <ModalLabel>Observação (opcional)</ModalLabel>
                    <textarea
                        value={form.description}
                        onChange={(e) =>
                            onFormChange({ description: e.target.value })
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
                style={{ display: "flex", gap: ".75rem", marginTop: "1.25rem" }}
            >
                <Button variant="ghost" fullWidth onClick={onClose}>
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    fullWidth
                    disabled={!canSave}
                    loading={saving}
                    onClick={onSave}
                    style={{ opacity: canSave ? 1 : 0.5 }}
                >
                    Salvar
                </Button>
            </div>
        </Modal>
    );
}
