import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout";
import { TopBar } from "@/components/layout";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session) redirect("/login");

    return (
        <div className="dashboard-root">
            <Sidebar />
            <TopBar />
            <main className="main-content">
                <div className="main-content__accent-line" aria-hidden />
                {children}
            </main>
        </div>
    );
}
