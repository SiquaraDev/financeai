"use client";

import { useDateRange } from "@/hooks/useDateRange";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { capitalize } from "@/lib/formatters";
import PageHeader from "@/components/ui/PageHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import PeriodFilter from "@/components/dashboard/PeriodFilter";
import DashboardBottomGrid from "@/components/dashboard/DashboardBottomGrid";

interface Session {
    user?: { id?: string; name?: string; email?: string };
}

export default function DashboardClient({ session }: { session: Session }) {
    const firstName = session?.user?.name?.split(" ")[0] ?? "você";

    const {
        activeFilter,
        customStart,
        customEnd,
        periodLabel,
        setActiveFilter,
        setCustomStart,
        setCustomEnd,
    } = useDateRange({ initialFilter: "this_month" });

    const { stats, loading } = useDashboardStats({
        activeFilter,
        customStart,
        customEnd,
    });

    return (
        <div
            style={{
                padding: "clamp(.75rem, 4vw, 2rem)",
                width: "100%",
                maxWidth: "1400px",
                margin: "0 auto",
                boxSizing: "border-box",
            }}
        >
            <PageHeader
                label={capitalize(periodLabel.toLowerCase())}
                title={
                    <>
                        Olá, {firstName}{" "}
                        <span
                            style={{
                                background: "var(--gradient-brand-h)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            👋
                        </span>
                    </>
                }
                subtitle="Aqui está o resumo financeiro do período selecionado."
            />

            <PeriodFilter
                activeFilter={activeFilter}
                customStart={customStart}
                customEnd={customEnd}
                periodLabel={periodLabel}
                onFilterChange={setActiveFilter}
                onCustomStartChange={setCustomStart}
                onCustomEndChange={setCustomEnd}
            />

            <StatsGrid stats={stats} loading={loading} />

            {stats && <DashboardBottomGrid stats={stats} />}
        </div>
    );
}
