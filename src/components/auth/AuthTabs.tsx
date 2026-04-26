"use client";

import Link from "next/link";

interface AuthTabsProps {
    active: "login" | "register";
}

const ACTIVE_STYLES: Record<"login" | "register", React.CSSProperties> = {
    login: {
        background: "var(--gradient-brand)",
        boxShadow: "var(--shadow-brand)",
    },
    register: {
        background: "var(--gradient-success)",
        boxShadow: "var(--shadow-teal)",
    },
};

const BASE_ACTIVE: React.CSSProperties = {
    flex: 1,
    textAlign: "center",
    padding: "var(--space-2) 0",
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    borderRadius: "var(--radius-md)",
    color: "var(--text-on-brand)",
    userSelect: "none",
    cursor: "default",
};

const INACTIVE: React.CSSProperties = {
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
                <span style={{ ...BASE_ACTIVE, ...ACTIVE_STYLES.login }}>
                    Entrar
                </span>
            ) : (
                <Link
                    href="/login"
                    style={INACTIVE}
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
                <span style={{ ...BASE_ACTIVE, ...ACTIVE_STYLES.register }}>
                    Criar conta
                </span>
            ) : (
                <Link
                    href="/register"
                    style={INACTIVE}
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
