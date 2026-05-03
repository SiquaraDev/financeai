import LogoMark from "./LogoMark";

interface AuthAsideProps {
    headline: React.ReactNode;
    description: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export default function AuthAside({
    headline,
    description,
    children,
    footer,
    className = "",
}: AuthAsideProps) {
    return (
        <div
            className={`${className} animate-fade-in`}
            style={{
                flex: "0 0 360px",
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
            }}
        >
            <div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "1.5rem",
                    }}
                >
                    <LogoMark size={42} />
                    <span
                        className="font-display"
                        style={{
                            fontSize: "var(--text-xl)",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            letterSpacing: "-0.03em",
                        }}
                    >
                        Finance
                        <span style={{ color: "var(--accent-teal-light)" }}>
                            AI
                        </span>
                    </span>
                </div>
                <h2
                    className="font-display"
                    style={{
                        fontSize: "clamp(26px, 2.8vw, 36px)",
                        fontWeight: 800,
                        lineHeight: 1.18,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.03em",
                        marginBottom: "1rem",
                    }}
                >
                    {headline}
                </h2>
                <p
                    style={{
                        fontSize: "var(--text-base)",
                        color: "var(--text-secondary)",
                        lineHeight: 1.7,
                    }}
                >
                    {description}
                </p>
            </div>
            {children}
            {footer}
        </div>
    );
}
