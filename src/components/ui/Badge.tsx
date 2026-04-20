import React from "react";

export type BadgeVariant =
    | "success"
    | "danger"
    | "warning"
    | "brand"
    | "teal"
    | "neutral";

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    dot?: boolean;
    style?: React.CSSProperties;
}

const VARIANT_STYLES: Record<BadgeVariant, React.CSSProperties> = {
    success: {
        background: "var(--color-success-bg)",
        border: "1px solid var(--color-success-border)",
        color: "var(--color-success-light)",
    },
    danger: {
        background: "var(--color-danger-bg)",
        border: "1px solid var(--color-danger-border)",
        color: "var(--color-danger-light)",
    },
    warning: {
        background: "var(--color-warning-bg)",
        border: "1px solid var(--color-warning-border)",
        color: "var(--color-warning-light)",
    },
    brand: {
        background: "var(--accent-brand-glow)",
        border: "1px solid var(--border-glow)",
        color: "var(--accent-brand-light)",
    },
    teal: {
        background: "var(--accent-teal-glow)",
        border: "1px solid rgba(20,184,166,.25)",
        color: "var(--accent-teal-light)",
    },
    neutral: {
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        color: "var(--text-secondary)",
    },
};

export default function Badge({
    children,
    variant = "neutral",
    dot = false,
    style,
}: BadgeProps) {
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "2px 9px",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                whiteSpace: "nowrap",
                ...VARIANT_STYLES[variant],
                ...style,
            }}
        >
            {dot && (
                <span
                    aria-hidden
                    style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "currentColor",
                        flexShrink: 0,
                    }}
                />
            )}
            {children}
        </span>
    );
}
