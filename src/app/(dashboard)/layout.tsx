import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth";

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

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session) redirect("/login");

    const initials = session.user?.name
        ? session.user.name
              .split(" ")
              .map((n: string) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
        : "U";

    return (
        <div
            style={{
                minHeight: "100dvh",
                background: "var(--bg-base)",
            }}
        >
            {/* ── Sidebar ── */}
            <aside className="sidebar">
                <div
                    className="logo-area"
                    style={{
                        padding: "1.25rem 1rem",
                        borderBottom: "1px solid var(--border-subtle)",
                        display: "flex",
                        alignItems: "center",
                        gap: ".625rem",
                    }}
                >
                    <div
                        className="animate-pulse-glow"
                        style={{
                            width: "32px",
                            height: "32px",
                            flexShrink: 0,
                            borderRadius: "var(--radius-md)",
                            background: "var(--gradient-brand)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <span
                        className="logo-text font-display"
                        style={{
                            fontSize: "var(--text-base)",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            letterSpacing: "-0.03em",
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
                        flex: 1,
                        padding: ".75rem .5rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        overflowY: "auto",
                    }}
                >
                    <p
                        className="section-label"
                        style={{
                            fontSize: "var(--text-xs)",
                            fontWeight: 600,
                            color: "var(--text-dim)",
                            letterSpacing: ".08em",
                            textTransform: "uppercase",
                            padding: ".25rem .875rem",
                            marginBottom: ".25rem",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Menu
                    </p>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="nav-link"
                        >
                            <span
                                style={{
                                    color: "inherit",
                                    display: "flex",
                                    alignItems: "center",
                                    flexShrink: 0,
                                }}
                            >
                                {item.icon}
                            </span>
                            <span
                                className="nav-label"
                                style={{ whiteSpace: "nowrap" }}
                            >
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                <div
                    style={{
                        height: "1px",
                        background: "var(--border-subtle)",
                        margin: "0 .5rem",
                    }}
                />

                <div style={{ padding: ".75rem .5rem" }}>
                    <div
                        className="user-area"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".625rem",
                            padding: ".625rem .875rem",
                            borderRadius: "var(--radius-md)",
                            marginBottom: "2px",
                        }}
                    >
                        <div
                            style={{
                                width: "28px",
                                height: "28px",
                                flexShrink: 0,
                                borderRadius: "var(--radius-full)",
                                background: "var(--gradient-brand)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <span
                                className="font-display"
                                style={{
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    color: "white",
                                }}
                            >
                                {initials}
                            </span>
                        </div>
                        <div
                            className="user-info"
                            style={{ overflow: "hidden" }}
                        >
                            <p
                                style={{
                                    fontSize: "var(--text-xs)",
                                    fontWeight: 600,
                                    color: "var(--text-secondary)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {session.user?.name}
                            </p>
                            <p
                                style={{
                                    fontSize: "10px",
                                    color: "var(--text-muted)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {session.user?.email}
                            </p>
                        </div>
                    </div>
                    <form
                        action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/login" });
                        }}
                    >
                        <button className="signout-btn">
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ flexShrink: 0 }}
                            >
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            <span className="signout-label">Sair da conta</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* ── Topbar mobile ── */}
            <div className="topbar">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: ".625rem",
                    }}
                >
                    <div
                        style={{
                            width: "28px",
                            height: "28px",
                            flexShrink: 0,
                            borderRadius: "var(--radius-md)",
                            background: "var(--gradient-brand)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
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
                        gap: "4px",
                    }}
                >
                    {navItems.map((item) => (
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
                                color: "var(--text-muted)",
                                textDecoration: "none",
                                transition:
                                    "background var(--transition-base), color var(--transition-base)",
                            }}
                        >
                            {item.icon}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* ── Main ── */}
            <main className="main-content">
                <div
                    aria-hidden
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "1px",
                        background: "var(--gradient-brand-h)",
                        opacity: 0.4,
                        zIndex: 10,
                        pointerEvents: "none",
                    }}
                />
                {children}
            </main>
        </div>
    );
}
