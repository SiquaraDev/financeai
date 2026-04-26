"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    IconDashboard,
    IconDollarSign,
    IconBarChart,
    GeminiIcon,
} from "@/components/icons";

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: <IconDashboard size={16} />,
    },
    {
        href: "/transactions",
        label: "Transações",
        icon: <IconDollarSign size={16} />,
    },
    { href: "/reports", label: "Relatórios", icon: <IconBarChart size={16} /> },
    { href: "/ai", label: "IA Gemini", icon: <GeminiIcon size={16} /> },
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <>
            {NAV_ITEMS.map((item) => {
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

export function NavMobileLinks() {
    const pathname = usePathname();

    return (
        <>
            {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-label={item.label}
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
