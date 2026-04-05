"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: (
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
            </svg>
        ),
    },
    {
        href: "/transactions",
        label: "Transações",
        icon: (
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
    },
    {
        href: "/reports",
        label: "Relatórios",
        icon: (
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
    },
    {
        href: "/ai",
        label: "IA Gemini",
        icon: (
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 2a10 10 0 1 0 10 10" />
                <path d="M12 8v4l3 3" />
                <circle cx="19" cy="5" r="3" />
            </svg>
        ),
    },
];

export function NavMobileLinks() {
    const pathname = usePathname();

    return (
        <>
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "36px",
                            height: "36px",
                            borderRadius: "var(--radius-md)",
                            color: isActive
                                ? "var(--accent-brand-light)"
                                : "var(--text-muted)",
                            background: isActive
                                ? "var(--accent-brand-glow)"
                                : "transparent",
                            textDecoration: "none",
                            transition:
                                "background var(--transition-base), color var(--transition-base)",
                        }}
                    >
                        {item.icon}
                    </Link>
                );
            })}
        </>
    );
}

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <>
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="nav-link"
                        style={{
                            background: isActive
                                ? "var(--accent-brand-glow)"
                                : undefined,
                            color: isActive
                                ? "var(--accent-brand-light)"
                                : undefined,
                            borderLeft: isActive
                                ? "2px solid var(--accent-brand-light)"
                                : "2px solid transparent",
                        }}
                    >
                        <span
                            style={{
                                color: "inherit",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                width: "16px",
                                height: "16px",
                            }}
                        >
                            {item.icon}
                        </span>
                        <span
                            className="nav-label"
                            style={{
                                whiteSpace: "nowrap",
                                lineHeight: 1,
                                fontWeight: isActive ? 600 : 500,
                            }}
                        >
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </>
    );
}
