"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";

interface ExportOption {
    label: string;
    type: "json" | "csv";
    badgeVariant: BadgeVariant;
}

const EXPORT_OPTIONS: ExportOption[] = [
    { label: "JSON", type: "json", badgeVariant: "warning" },
    { label: "Excel (.csv)", type: "csv", badgeVariant: "success" },
];

interface ExportModalProps {
    onExport: (type: "json" | "csv") => void;
    onClose: () => void;
}

export default function ExportModal({ onExport, onClose }: ExportModalProps) {
    return (
        <Modal
            onClose={onClose}
            maxWidth={360}
            accentBar="teal"
            ariaLabel="Exportar transações"
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
                Exportar transações
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
                {EXPORT_OPTIONS.map((opt) => (
                    <button
                        key={opt.type}
                        onClick={() => onExport(opt.type)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".75rem",
                            padding: ".75rem 1rem",
                            borderRadius: "var(--radius-lg)",
                            border: "1px solid var(--border-subtle)",
                            cursor: "pointer",
                            background: "transparent",
                            transition: "border-color var(--transition-base)",
                            width: "100%",
                            textAlign: "left",
                            fontFamily: "var(--font-body)",
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
                            Baixar arquivo
                        </span>
                    </button>
                ))}
            </div>

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
