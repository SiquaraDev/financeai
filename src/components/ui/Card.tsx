import React from "react";

export type CardVariant = "glass" | "solid" | "elevated";

interface CardProps {
    children: React.ReactNode;
    variant?: CardVariant;
    accentBar?: "brand" | "success" | "teal" | "none";
    padding?: string | number;
    style?: React.CSSProperties;
    className?: string;
    onClick?: () => void;
}

const VARIANT_STYLES: Record<CardVariant, React.CSSProperties> = {
    glass: {
        background: "rgba(12, 21, 36, 0.72)",
        border: "1px solid rgba(26, 51, 82, 0.7)",
        borderRadius: "var(--radius-xl)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "var(--shadow-lg)",
    },
    solid: {
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl)",
    },
    elevated: {
        background: "rgba(12,21,36,.72)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl)",
        backdropFilter: "blur(20px)",
        boxShadow: "var(--shadow-xl), 0 0 0 1px var(--border-glow)",
    },
};

const ACCENT_GRADIENT: Record<string, string> = {
    brand: "var(--gradient-brand-h)",
    success: "var(--gradient-success)",
    teal: "linear-gradient(90deg, var(--teal-500), var(--teal-300))",
    none: "none",
};

export default function Card({
    children,
    variant = "glass",
    accentBar = "none",
    padding = "clamp(.875rem, 3vw, 1.5rem)",
    style,
    className,
    onClick,
}: CardProps) {
    return (
        <div
            className={className}
            onClick={onClick}
            style={{
                overflow: "hidden",
                ...VARIANT_STYLES[variant],
                ...style,
            }}
        >
            {accentBar !== "none" && (
                <div
                    aria-hidden
                    style={{
                        height: "3px",
                        background: ACCENT_GRADIENT[accentBar],
                    }}
                />
            )}
            <div style={{ padding }}>{children}</div>
        </div>
    );
}
