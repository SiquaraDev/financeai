import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const safeSession = {
        user: {
            id: session.user?.id ?? undefined,
            name: session.user?.name ?? undefined,
            email: session.user?.email ?? undefined,
        },
    };

    return <DashboardClient session={safeSession} />;
}
