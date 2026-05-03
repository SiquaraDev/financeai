import { transactionColorTokens } from "@/styles/design-tokens";

interface TransactionIconProps {
    type: "INCOME" | "EXPENSE";
    size?: number;
    borderRadius?: string;
}

export function TransactionIcon({
    type,
    size = 30,
    borderRadius = "var(--radius-md)",
}: TransactionIconProps) {
    const { color, bg, border } = transactionColorTokens(type);
    const isIncome = type === "INCOME";

    return (
        <div
            style={{
                width: `${size}px`,
                height: `${size}px`,
                flexShrink: 0,
                borderRadius,
                background: bg,
                border: `1px solid ${border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color,
            }}
        >
            <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
            >
                {isIncome ? (
                    <>
                        <line x1="12" y1="19" x2="12" y2="5" />
                        <polyline points="5 12 12 5 19 12" />
                    </>
                ) : (
                    <>
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <polyline points="19 12 12 19 5 12" />
                    </>
                )}
            </svg>
        </div>
    );
}
