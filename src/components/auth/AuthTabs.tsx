"use client";

import Link from "next/link";

interface AuthTabsProps {
    active: "login" | "register";
}

const activeStyle = (
    gradient: string,
    shadow: string,
): React.CSSProperties => ({
    flex: 1,
    textAlign: "center",
    padding: "var(--space-2) 0",
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    borderRadius: "var(--radius-md)",
    background: gradient,
    color: "var(--text-on-brand)",
    boxShadow: shadow,
    userSelect: "none",
    cursor: "default",
});

const inactiveStyle: React.CSSProperties = {
    flex: 1,
    textAlign: "center",
    padding: "var(--space-2) 0",
    fontSize: "var(--text-sm)",
    fontWeight: 500,
    color: "var(--text-muted)",
    borderRadius: "var(--radius-md)",
    textDecoration: "none",
    transition: "color var(--transition-base)",
};

export default function AuthTabs({ active }: AuthTabsProps) {
    return (
        <div
            style={{
                display: "flex",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-1)",
                marginBottom: "1.5rem",
            }}
        >
            {active === "login" ? (
                <span
                    style={activeStyle(
                        "var(--gradient-brand)",
                        "var(--shadow-brand)",
                    )}
                >
                    Entrar
                </span>
            ) : (
                <Link
                    href="/login"
                    style={inactiveStyle}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--text-secondary)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-muted)")
                    }
                >
                    Entrar
                </Link>
            )}

            {active === "register" ? (
                <span
                    style={activeStyle(
                        "var(--gradient-success)",
                        "var(--shadow-teal)",
                    )}
                >
                    Criar conta
                </span>
            ) : (
                <Link
                    href="/register"
                    style={inactiveStyle}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--text-secondary)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-muted)")
                    }
                >
                    Criar conta
                </Link>
            )}
        </div>
    );
}
