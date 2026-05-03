"use client";

import { useDateRange, useDashboardStats } from "@/hooks";
import { getFirstName } from "@/utils";
import PageHeader from "@/components/ui/PageHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import PeriodFilter from "@/components/dashboard/PeriodFilter";
import DashboardBottomGrid from "@/components/dashboard/DashboardBottomGrid";

interface Session {
    user?: { id?: string; name?: string; email?: string };
}

export default function DashboardClient({ session }: { session: Session }) {
    const firstName = getFirstName(session?.user?.name);

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
                label={periodLabel}
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

            <DashboardBottomGrid stats={stats} loading={loading} />
        </div>
    );
}
