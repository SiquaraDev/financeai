"use client";

interface PageSizeSelectProps {
    value: number;
    onChange: (size: number) => void;
}

const OPTIONS: { value: number; label: string }[] = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
    { value: 0, label: "Todas" },
];

export default function PageSizeSelect({
    value,
    onChange,
}: PageSizeSelectProps) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                flexShrink: 0,
            }}
        >
            <span
                style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                }}
            >
                transações por página:
            </span>
            <select
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                aria-label="Itens por página"
                style={{
                    padding: "5px 10px",
                    fontSize: "var(--text-xs)",
                    borderRadius: "var(--radius-md)",
                    fontFamily: "var(--font-body)",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    minWidth: "clamp(52px, 10vw, 72px)",
                    flexShrink: 0,
                }}
            >
                {OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
