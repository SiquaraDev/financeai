interface LoadingSpinnerProps {
    size?: number;
    label?: string;
    centered?: boolean;
    height?: number | string;
}

export default function LoadingSpinner({
    size = 16,
    label = "Carregando...",
    centered = true,
    height,
}: LoadingSpinnerProps) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: centered ? "center" : "flex-start",
                gap: "var(--space-2)",
                height,
                padding: centered && !height ? "2rem 0" : undefined,
            }}
        >
            <svg
                className="animate-spin"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="2.5"
                aria-hidden
            >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            {label && (
                <span
                    style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--text-muted)",
                    }}
                >
                    {label}
                </span>
            )}
        </div>
    );
}
