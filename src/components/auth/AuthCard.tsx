import React from "react";
import LogoMark from "./LogoMark";

interface AuthCardProps {
    accentGradient: string;
    title: string;
    subtitle: string;
    mobileLogoClass: string;
    children: React.ReactNode;
}

export default function AuthCard({
    accentGradient,
    title,
    subtitle,
    mobileLogoClass,
    children,
}: AuthCardProps) {
    return (
        <div
            className="animate-fade-in-scale"
            style={{ width: "100%", maxWidth: "420px" }}
        >
            <div
                className="card-glass"
                style={{
                    overflow: "hidden",
                    boxShadow: "var(--shadow-xl), 0 0 0 1px var(--border-glow)",
                }}
            >
                <div style={{ height: "3px", background: accentGradient }} />
                <div style={{ padding: "2rem" }}>
                    <div
                        className={mobileLogoClass}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            marginBottom: "1.75rem",
                        }}
                    >
                        <LogoMark size={34} />
                        <span
                            className="font-display"
                            style={{
                                fontSize: "var(--text-lg)",
                                fontWeight: 700,
                                color: "var(--text-primary)",
                            }}
                        >
                            Finance
                            <span style={{ color: "var(--accent-teal-light)" }}>
                                AI
                            </span>
                        </span>
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h1
                            className="font-display"
                            style={{
                                fontSize: "var(--text-2xl)",
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                letterSpacing: "-0.025em",
                                marginBottom: "var(--space-1)",
                            }}
                        >
                            {title}
                        </h1>
                        <p
                            style={{
                                fontSize: "var(--text-sm)",
                                color: "var(--text-secondary)",
                            }}
                        >
                            {subtitle}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
