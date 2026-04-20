import React from "react";
import { IconSpinner } from "@/components/icons";

export type ButtonVariant = "primary" | "ghost" | "danger" | "teal";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: React.ReactNode;
    iconRight?: React.ReactNode;
    fullWidth?: boolean;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
    primary: "btn-primary",
    ghost: "btn-ghost",
    danger: "btn-danger",
    teal: "btn-ghost",
};

const SIZE_STYLES: Record<ButtonSize, React.CSSProperties> = {
    sm: { padding: "5px 12px", fontSize: "var(--text-xs)" },
    md: { padding: "10px var(--space-5)", fontSize: "var(--text-sm)" },
    lg: { padding: "13px var(--space-6)", fontSize: "var(--text-base)" },
};

const TEAL_OVERRIDE: React.CSSProperties = {
    background: "var(--accent-teal-glow)",
    borderColor: "rgba(20,184,166,.25)",
    color: "var(--accent-teal-light)",
};

export default function Button({
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    iconRight,
    fullWidth = false,
    children,
    disabled,
    style,
    ...rest
}: ButtonProps) {
    const isTeal = variant === "teal";

    return (
        <button
            {...rest}
            disabled={disabled || loading}
            className={VARIANT_CLASS[variant]}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.375rem",
                borderRadius: "var(--radius-md)",
                width: fullWidth ? "100%" : undefined,
                ...(isTeal ? TEAL_OVERRIDE : {}),
                ...SIZE_STYLES[size],
                ...style,
            }}
        >
            {loading ? <IconSpinner size={14} /> : icon}
            {children}
            {!loading && iconRight}
        </button>
    );
}
