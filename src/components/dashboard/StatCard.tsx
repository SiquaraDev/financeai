import React from "react";

interface StatCardProps {
    label: string;
    value: string;
    description: string;
    /** Ícone SVG — usa currentColor, herda a cor do container */
    icon: React.ReactNode;
    iconBg: string;
    iconBorder: string;
    iconColor: string;
    valueColor: string;
    borderColor: string;
    delay?: string;
}

export default function StatCard({
    label,
    value,
    description,
    icon,
    iconBg,
    iconBorder,
    iconColor,
    valueColor,
    borderColor,
    delay = "",
}: StatCardProps) {
    return (
        <div className={`stat-card ${delay}`} style={{ borderColor }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: ".5rem",
                }}
            >
                <p
                    style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                        fontWeight: 600,
                    }}
                >
                    {label}
                </p>
                <span
                    style={{
                        width: "26px",
                        height: "26px",
                        flexShrink: 0,
                        borderRadius: "var(--radius-full)",
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
            </div>
            <p
                className="font-display stat-value"
                style={{
                    fontSize: "clamp(14px, 3.5vw, 24px)",
                    fontWeight: 700,
                    color: valueColor,
                    letterSpacing: "-0.03em",
                    marginTop: ".25rem",
                    wordBreak: "break-all",
                }}
            >
                {value}
            </p>
            <p
                style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-muted)",
                }}
            >
                {description}
            </p>
        </div>
    );
}
