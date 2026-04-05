import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth";

const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/transactions", label: "Transações" },
    { href: "/reports", label: "Relatórios" },
    { href: "/ai", label: "IA Gemini" },
];

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session) redirect("/login");

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-5 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                                F
                            </span>
                        </div>
                        <span className="font-medium text-sm text-gray-900">
                            FinanceAI
                        </span>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 px-3 py-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 text-xs font-medium">
                                {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                            </span>
                        </div>
                        <span className="text-xs text-gray-600 truncate">
                            {session.user?.name}
                        </span>
                    </div>
                    <form
                        action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/login" });
                        }}
                    >
                        <button className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors">
                            Sair
                        </button>
                    </form>
                </div>
            </aside>
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    );
}
