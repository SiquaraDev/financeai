"use client";

import { signOut } from "next-auth/react";
import { useDropdown } from "@/hooks";
import { IconSignOut } from "@/components/icons";

interface UserAvatarProps {
    initials: string;
    size?: number;
}

export default function UserAvatar({ initials, size = 28 }: UserAvatarProps) {
    const { isOpen, toggle, close, ref } = useDropdown();

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                onClick={toggle}
                className="user-avatar-btn"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: "var(--radius-full)",
                    background: "var(--gradient-brand)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "white",
                    fontFamily: "var(--font-display)",
                    lineHeight: 1,
                    flexShrink: 0,
                    cursor: "pointer",
                }}
                aria-label="Menu do usuário"
                aria-expanded={isOpen}
            >
                {initials}
            </button>

            {isOpen && (
                <div
                    className="animate-fade-in"
                    style={{
                        position: "fixed",
                        top: "52px",
                        right: ".75rem",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-lg)",
                        boxShadow: "var(--shadow-lg)",
                        overflow: "hidden",
                        minWidth: "160px",
                        zIndex: 100,
                    }}
                >
                    <button
                        onClick={() => {
                            close();
                            signOut({ callbackUrl: "/login" });
                        }}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: ".625rem",
                            padding: ".75rem 1rem",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--color-danger-light)",
                            fontSize: "var(--text-sm)",
                            fontFamily: "var(--font-body)",
                            fontWeight: 500,
                            textAlign: "left",
                            transition: "background var(--transition-base)",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                                "var(--color-danger-bg)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "none")
                        }
                    >
                        <IconSignOut size={14} />
                        Sair da conta
                    </button>
                </div>
            )}
        </div>
    );
}
