import { auth, signOut } from "@/lib/auth";
import NavLinks from "./NavLinks";

function getInitials(name?: string | null): string {
    if (!name) return "U";
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default async function Sidebar() {
    const session = await auth();
    const initials = getInitials(session?.user?.name);

    return (
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
                        aria-hidden
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
                <NavLinks />
            </nav>

            <div
                aria-hidden
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
                    <div className="user-info" style={{ overflow: "hidden" }}>
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
                            {session?.user?.name}
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
                            {session?.user?.email}
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
                            aria-hidden
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
    );
}
