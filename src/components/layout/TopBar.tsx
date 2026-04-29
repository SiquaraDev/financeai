"use client";

import { NavMobileLinks } from "./NavLinks";
import { useUser } from "@/context";
import { UserAvatar } from "@/components/ui";

export default function TopBar() {
    const { initials } = useUser();

    return (
        <div className="topbar">
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".5rem",
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        width: "26px",
                        height: "26px",
                        flexShrink: 0,
                        borderRadius: "var(--radius-md)",
                        background: "var(--gradient-brand)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                    >
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                </div>
                <span
                    className="font-display"
                    style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                    }}
                >
                    Finance
                    <span style={{ color: "var(--accent-teal-light)" }}>
                        AI
                    </span>
                </span>
            </div>

            <nav
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    flexShrink: 0,
                }}
            >
                <NavMobileLinks />
                <div
                    style={{
                        width: "1px",
                        height: "20px",
                        background: "var(--border-subtle)",
                        margin: "0 4px",
                        flexShrink: 0,
                    }}
                />
                <UserAvatar initials={initials} />
            </nav>
        </div>
    );
}
