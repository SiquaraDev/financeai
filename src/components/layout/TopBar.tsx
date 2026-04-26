import { NavMobileLinks } from "./NavLinks";

export default function TopBar() {
    return (
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
                    }}
                >
                    Finance
                    <span style={{ color: "var(--accent-teal-light)" }}>
                        AI
                    </span>
                </span>
            </div>
            <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <NavMobileLinks />
            </nav>
        </div>
    );
}
