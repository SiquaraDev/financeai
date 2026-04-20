"use client";

const IMPORT_OPTIONS = [
    {
        label: "JSON",
        accept: ".json",
        type: "json" as const,
        color: "var(--color-warning-light)",
        bg: "var(--color-warning-bg)",
        border: "var(--color-warning-border)",
    },
    {
        label: "Excel (.xlsx)",
        accept: ".xlsx,.xls",
        type: "excel" as const,
        color: "var(--color-success-light)",
        bg: "var(--color-success-bg)",
        border: "var(--color-success-border)",
    },
    {
        label: "PDF",
        accept: ".pdf",
        type: "pdf" as const,
        color: "var(--color-danger-light)",
        bg: "var(--color-danger-bg)",
        border: "var(--color-danger-border)",
    },
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
                    maxWidth: "360px",
                    padding: "clamp(1.25rem, 4vw, 1.75rem)",
                    boxShadow: "var(--shadow-xl), 0 0 0 1px var(--border-glow)",
                }}
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
                                transition:
                                    "border-color var(--transition-base)",
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
                            <span
                                style={{
                                    fontSize: "var(--text-xs)",
                                    fontWeight: 600,
                                    padding: "2px 0",
                                    width: "80px",
                                    textAlign: "center",
                                    borderRadius: "var(--radius-full)",
                                    color: opt.color,
                                    background: opt.bg,
                                    border: `1px solid ${opt.border}`,
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                }}
                            >
                                {opt.label}
                            </span>
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

                <button
                    onClick={onClose}
                    className="btn-ghost"
                    style={{
                        width: "100%",
                        marginTop: "1rem",
                        padding: ".625rem",
                        fontSize: "var(--text-sm)",
                        borderRadius: "var(--radius-md)",
                    }}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}
