import React from "react";

interface SectionHeaderProps {
    icon: React.ReactNode;
    iconBg?: string;
    iconBorder?: string;
    iconColor?: string;
    title: string;
}

export default function SectionHeader({
    icon,
    iconBg = "var(--accent-brand-glow)",
    iconBorder = "var(--border-glow)",
    iconColor = "var(--accent-brand-light)",
    title,
}: SectionHeaderProps) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: ".625rem",
                marginBottom: "1.125rem",
            }}
        >
            <span
                style={{
                    width: "26px",
                    height: "26px",
                    flexShrink: 0,
                    borderRadius: "var(--radius-md)",
                    background: iconBg,
                    border: `1px solid ${iconBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: iconColor,
                }}
            >
                {icon}
            </span>
            <h2
                className="font-display"
                style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                }}
            >
                {title}
            </h2>
        </div>
    );
}
