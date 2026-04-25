"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface ImportOption {
    label: string;
    accept: string;
    type: "json" | "excel" | "pdf";
    badgeVariant: "warning" | "success" | "danger";
}

const IMPORT_OPTIONS: ImportOption[] = [
    { label: "JSON", accept: ".json", type: "json", badgeVariant: "warning" },
    {
        label: "Excel (.xlsx)",
        accept: ".xlsx,.xls",
        type: "excel",
        badgeVariant: "success",
    },
    { label: "PDF", accept: ".pdf", type: "pdf", badgeVariant: "danger" },
];

interface ImportModalProps {
    error: string;
    onImport: (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "json" | "excel" | "pdf",
    ) => void;
    onClose: () => void;
}

export default function ImportModal({
    error,
    onImport,
    onClose,
}: ImportModalProps) {
    return (
        <Modal
            onClose={onClose}
            maxWidth={360}
            accentBar="teal"
            ariaLabel="Importar transações"
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
                {IMPORT_OPTIONS.map((opt) => (
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
                            transition: "border-color var(--transition-base)",
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
                        <Badge
                            variant={opt.badgeVariant}
                            style={{
                                minWidth: "80px",
                                justifyContent: "center",
                            }}
                        >
                            {opt.label}
                        </Badge>
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
                            onChange={(e) => onImport(e, opt.type)}
                        />
                    </label>
                ))}
            </div>

            {error && (
                <p
                    style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-danger-light)",
                        marginTop: ".75rem",
                    }}
                >
                    {error}
                </p>
            )}

            <Button
                variant="ghost"
                fullWidth
                onClick={onClose}
                style={{ marginTop: "1rem" }}
            >
                Cancelar
            </Button>
        </Modal>
    );
}
