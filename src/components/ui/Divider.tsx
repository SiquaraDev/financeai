export default function Divider() {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                margin: "1.5rem 0",
            }}
        >
            <div
                style={{
                    flex: 1,
                    height: "1px",
                    background: "var(--border-subtle)",
                }}
            />
            <span
                style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-dim)",
                    letterSpacing: "0.05em",
                }}
            >
                ou continue com
            </span>
            <div
                style={{
                    flex: 1,
                    height: "1px",
                    background: "var(--border-subtle)",
                }}
            />
        </div>
    );
}
