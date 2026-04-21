import OrbBackground from "@/components/ui/OrbBackground";

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
            <OrbBackground />

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
