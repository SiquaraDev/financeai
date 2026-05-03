interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
}

function DefaultIcon() {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-dim)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
    );
}

export default function EmptyState({
    icon,
    title,
    description,
}: EmptyStateProps) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2.5rem 1rem",
                gap: "var(--space-2)",
                textAlign: "center",
            }}
        >
            <div style={{ marginBottom: "var(--space-1)" }}>
                {icon ?? <DefaultIcon />}
            </div>
            <p
                style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                }}
            >
                {title}
            </p>
            {description && (
                <p
                    style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--text-muted)",
                    }}
                >
                    {description}
                </p>
            )}
        </div>
    );
}
