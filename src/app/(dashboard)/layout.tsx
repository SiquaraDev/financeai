import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session) redirect("/login");

    return (
        <div style={{ minHeight: "100dvh", background: "var(--bg-base)" }}>
            <Sidebar />
            <TopBar />

            <main className="main-content">
                <div
                    aria-hidden
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "1px",
                        background: "var(--gradient-brand-h)",
                        opacity: 0.4,
                        zIndex: 10,
                        pointerEvents: "none",
                    }}
                />
                {children}
            </main>
        </div>
    );
}
