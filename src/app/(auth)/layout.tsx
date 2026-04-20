export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                minHeight: "100dvh",
                background: "var(--bg-base)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
            }}
            className="bg-grid"
        >
            <style>{`
                @keyframes orb-float {
                    0%, 100% { transform: translateY(0px)   scale(1);    }
                    50%       { transform: translateY(-20px) scale(1.04); }
                }
                @keyframes orb-float-alt {
                    0%, 100% { transform: translateY(0px)  scale(1);    }
                    50%       { transform: translateY(16px) scale(0.97); }
                }
            `}</style>

            <div
                aria-hidden
                style={{
                    position: "fixed",
                    top: "-10%",
                    left: "-6%",
                    width: "540px",
                    height: "540px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(26,111,240,0.15) 0%, transparent 68%)",
                    pointerEvents: "none",
                    animation: "orb-float 9s ease-in-out infinite",
                }}
            />

            <div
                aria-hidden
                style={{
                    position: "fixed",
                    bottom: "-14%",
                    right: "-8%",
                    width: "620px",
                    height: "620px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(20,184,166,0.10) 0%, transparent 68%)",
                    pointerEvents: "none",
                    animation: "orb-float-alt 12s ease-in-out infinite",
                }}
            />

            <div
                aria-hidden
                style={{
                    position: "fixed",
                    top: "40%",
                    left: "30%",
                    width: "320px",
                    height: "320px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
                    pointerEvents: "none",
                    animation: "orb-float 16s ease-in-out infinite 3s",
                }}
            />

            <div
                style={{
                    position: "relative",
                    zIndex: 10,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2.5rem 1rem",
                }}
            >
                {children}
            </div>
        </div>
    );
}
