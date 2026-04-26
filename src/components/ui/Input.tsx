import React from "react";

export type InputSize = "sm" | "md" | "lg";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
    error?: string;
    size?: InputSize;
    fullWidth?: boolean;
}

const SIZE_PADDING: Record<InputSize, string> = {
    sm: "6px 10px",
    md: "10px 14px",
    lg: "13px 16px",
};

const SIZE_FONT: Record<InputSize, string> = {
    sm: "var(--text-xs)",
    md: "var(--text-sm)",
    lg: "var(--text-base)",
};

export default function Input({
    label,
    hint,
    error,
    size = "md",
    fullWidth = true,
    id,
    style,
    ...props
}: InputProps) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-1)",
            }}
        >
            {label && (
                <label
                    htmlFor={id}
                    style={{
                        display: "block",
                        fontSize: "var(--text-xs)",
                        fontWeight: 500,
                        color: error
                            ? "var(--color-danger-light)"
                            : "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                style={{
                    width: fullWidth ? "100%" : undefined,
                    padding: SIZE_PADDING[size],
                    fontSize: SIZE_FONT[size],
                    borderColor: error
                        ? "var(--color-danger-border) !important"
                        : undefined,
                    boxShadow: error
                        ? "0 0 0 3px var(--color-danger-bg) !important"
                        : undefined,
                    ...style,
                }}
                {...props}
            />
            {(hint || error) && (
                <p
                    style={{
                        fontSize: "var(--text-xs)",
                        color: error
                            ? "var(--color-danger-light)"
                            : "var(--text-muted)",
                    }}
                >
                    {error ?? hint}
                </p>
            )}
        </div>
    );
}
