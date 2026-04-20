export default function TypingDots() {
    return (
        <div
            style={{
                display: "flex",
                gap: "4px",
                alignItems: "center",
                padding: "2px 0",
            }}
        >
            {[0, 150, 300].map((delay) => (
                <span
                    key={delay}
                    style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--accent-teal-light)",
                        display: "inline-block",
                        animation: "bounce-dot 1.2s ease-in-out infinite",
                        animationDelay: `${delay}ms`,
                    }}
                />
            ))}
        </div>
    );
}
