import type { TransactionType } from "@/types";

interface TypeToggleProps {
    value: TransactionType;
    onChange: (type: TransactionType) => void;
}

const TYPES: { value: TransactionType; label: string }[] = [
    { value: "EXPENSE", label: "Gasto" },
    { value: "INCOME", label: "Receita" },
];

const ACTIVE_STYLES: Record<TransactionType, React.CSSProperties> = {
    EXPENSE: {
        background: "var(--color-danger-bg)",
        color: "var(--color-danger-light)",
        border: "1px solid var(--color-danger-border)",
    },
    INCOME: {
        background: "var(--color-success-bg)",
        color: "var(--color-success-light)",
        border: "1px solid var(--color-success-border)",
    },
};

export default function TypeToggle({ value, onChange }: TypeToggleProps) {
    return (
        <div
            style={{
                display: "flex",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "4px",
            }}
        >
            {TYPES.map((t) => {
                const isActive = value === t.value;
                return (
                    <button
                        key={t.value}
                        type="button"
                        onClick={() => onChange(t.value)}
                        style={{
                            flex: 1,
                            padding: ".5rem",
                            borderRadius: "var(--radius-md)",
                            fontSize: "var(--text-sm)",
                            fontWeight: 600,
                            fontFamily: "var(--font-body)",
                            cursor: "pointer",
                            transition: "all var(--transition-base)",
                            ...(isActive
                                ? ACTIVE_STYLES[t.value]
                                : {
                                      background: "transparent",
                                      color: "var(--text-muted)",
                                      border: "1px solid transparent",
                                  }),
                        }}
                    >
                        {t.label}
                    </button>
                );
            })}
        </div>
    );
}
