import React from "react";

export interface FeatureItem {
    label: string;
    delay?: string;
}

interface FeatureCheckListProps {
    items: FeatureItem[];
}

export default function FeatureCheckList({ items }: FeatureCheckListProps) {
    return (
        <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
            {items.map((f) => (
                <div
                    key={f.label}
                    className={`animate-fade-in ${f.delay ?? ""}`}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                    }}
                >
                    <span
                        style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "var(--radius-full)",
                            background: "var(--color-success-bg)",
                            border: "1px solid var(--color-success-border)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--color-success-light)",
                            flexShrink: 0,
                            fontSize: "11px",
                            fontWeight: 700,
                        }}
                    >
                        ✓
                    </span>
                    <span
                        style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--text-secondary)",
                        }}
                    >
                        {f.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
