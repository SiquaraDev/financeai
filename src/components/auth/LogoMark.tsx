export default function LogoMark({ size = 40 }: { size?: number }) {
    return (
        <div
            className="animate-pulse-glow"
            style={{
                width: size,
                height: size,
                borderRadius: "var(--radius-lg)",
                background: "var(--gradient-brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}
        >
            <svg
                width={size * 0.45}
                height={size * 0.45}
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
    );
}
