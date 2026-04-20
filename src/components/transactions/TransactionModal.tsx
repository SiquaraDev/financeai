"use client";

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
                    boxShadow: "var(--shadow-xl), 0 0 0 1px var(--border-glow)",
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
                        {(["EXPENSE", "INCOME"] as const).map((t) => {
                            const active = form.type === t;
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
                                        cursor: "pointer",
                                        transition:
                                            "all var(--transition-base)",
                                        background: active
                                            ? t === "EXPENSE"
                                                ? "var(--color-danger-bg)"
                                                : "var(--color-success-bg)"
                                            : "transparent",
                                        color: active
                                            ? t === "EXPENSE"
                                                ? "var(--color-danger-light)"
                                                : "var(--color-success-light)"
                                            : "var(--text-muted)",
                                        border: active
                                            ? `1px solid ${t === "EXPENSE" ? "var(--color-danger-border)" : "var(--color-success-border)"}`
                                            : "1px solid transparent",
                                    }}
                                >
                                    {t === "EXPENSE" ? "Gasto" : "Receita"}
                                </button>
                            );
                        })}
                    </div>

                    {/* Descrição */}
                    <div>
                        <ModalLabel>Descrição</ModalLabel>
                        <input
                            value={form.title}
                            onChange={(e) =>
                                onFormChange({ title: e.target.value })
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

                    {/* Categoria */}
                    <div>
                        <ModalLabel>Categoria</ModalLabel>
                        <select
                            value={form.category}
                            onChange={(e) =>
                                onFormChange({ category: e.target.value })
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
                    style={{
                        display: "flex",
                        gap: ".75rem",
                        marginTop: "1.25rem",
                    }}
                >
                    <button
                        onClick={onClose}
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
                        onClick={onSave}
                        disabled={!canSave}
                        className="btn-primary"
                        style={{
                            flex: 1,
                            padding: ".625rem",
                            fontSize: "var(--text-sm)",
                            borderRadius: "var(--radius-md)",
                            opacity: canSave ? 1 : 0.5,
                        }}
                    >
                        {saving ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
