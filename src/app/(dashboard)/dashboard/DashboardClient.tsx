"use client";

import { useDateRange } from "@/hooks/useDateRange";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { capitalize } from "@/lib/formatters";
import PageHeader from "@/components/ui/PageHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import PeriodFilter from "@/components/dashboard/PeriodFilter";
import CategoryExpenseList from "@/components/dashboard/CategoryExpenseList";
import RecentTransactionsList from "@/components/dashboard/RecentTransactionsList";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import { IconPieChart, IconActivity } from "@/components/icons";

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

            {stats && (
                <div className="bottom-grid">
                    <Card variant="glass" className="animate-fade-in delay-225">
                        <SectionHeader
                            title="Gastos por categoria"
                            icon={<IconPieChart />}
                            iconBg="var(--accent-brand-glow)"
                            iconBorder="var(--border-glow)"
                            iconColor="var(--accent-brand-light)"
                        />
                        <CategoryExpenseList
                            byCategory={stats.byCategory}
                            totalExpense={stats.totalExpense}
                        />
                    </Card>

                    <Card variant="glass" className="animate-fade-in delay-300">
                        <SectionHeader
                            title="Últimas transações"
                            icon={<IconActivity />}
                            iconBg="var(--accent-teal-glow)"
                            iconBorder="rgba(20,184,166,.25)"
                            iconColor="var(--accent-teal-light)"
                        />
                        <RecentTransactionsList transactions={stats.recent} />
                    </Card>
                </div>
            )}
        </div>
    );
}
