interface PageHeaderProps {
    title: React.ReactNode;
    subtitle?: string;
    label?: string;
    actions?: React.ReactNode;
    animateClass?: string;
}

export default function PageHeader({
    title,
    subtitle,
    label,
    actions,
    animateClass = "animate-fade-in",
}: PageHeaderProps) {
    return (
        <div
            className={animateClass}
            style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: actions ? "space-between" : "flex-start",
                gap: "1rem",
                marginBottom: "clamp(1rem, 3vw, 1.5rem)",
                flexWrap: "wrap",
            }}
        >
            <div>
                {label && (
                    <p
                        style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--text-muted)",
                            marginBottom: ".25rem",
                        }}
                    >
                        {label}
                    </p>
                )}
                <h1
                    className="font-display"
                    style={{
                        fontSize: "clamp(18px, 5vw, 30px)",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.2,
                        marginBottom: ".25rem",
                    }}
                >
                    {title}
                </h1>
                {subtitle && (
                    <p
                        style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--text-secondary)",
                        }}
                    >
                        {subtitle}
                    </p>
                )}
            </div>
            {actions && (
                <div style={{ display: "flex", minWidth: 0, flexShrink: 1 }}>
                    {actions}
                </div>
            )}
        </div>
    );
}
