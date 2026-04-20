import StatCard from "./StatCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { IconArrowUp, IconArrowDown, IconDollarSign } from "@/components/icons";
import { formatCurrency } from "@/lib/formatters";
import type { DashboardStats } from "@/hooks/useDashboardStats";

interface StatsGridProps {
    stats: DashboardStats | null;
    loading: boolean;
}

export default function StatsGrid({ stats, loading }: StatsGridProps) {
    if (loading) {
        return (
            <div
                className="stats-grid"
                style={{ marginBottom: "clamp(.75rem, 2vw, 1.5rem)" }}
            >
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="stat-card skeleton"
                        style={{ height: "110px", opacity: 0.5 }}
                    />
                ))}
            </div>
        );
    }

    if (!stats) return null;

    const isPositive = stats.balance >= 0;

    return (
        <div className="stats-grid">
            <StatCard
                label="Receitas"
                value={formatCurrency(stats.totalIncome)}
                description="Total recebido no período"
                icon={<IconArrowUp />}
                iconBg="var(--color-success-bg)"
                iconBorder="var(--color-success-border)"
                iconColor="var(--color-success-light)"
                valueColor="var(--color-success-light)"
                borderColor="var(--color-success-border)"
                delay="delay-75"
            />
            <StatCard
                label="Gastos"
                value={formatCurrency(stats.totalExpense)}
                description="Total gasto no período"
                icon={<IconArrowDown />}
                iconBg="var(--color-danger-bg)"
                iconBorder="var(--color-danger-border)"
                iconColor="var(--color-danger-light)"
                valueColor="var(--color-danger-light)"
                borderColor="var(--color-danger-border)"
                delay="delay-150"
            />
            <StatCard
                label="Saldo"
                value={formatCurrency(stats.balance)}
                description={
                    isPositive
                        ? "Você está no positivo 🎉"
                        : "Atenção: saldo negativo"
                }
                icon={<IconDollarSign />}
                iconBg={
                    isPositive
                        ? "var(--accent-brand-glow)"
                        : "var(--color-danger-bg)"
                }
                iconBorder={
                    isPositive
                        ? "var(--border-glow)"
                        : "var(--color-danger-border)"
                }
                iconColor={
                    isPositive
                        ? "var(--accent-brand-light)"
                        : "var(--color-danger-light)"
                }
                valueColor={
                    isPositive
                        ? "var(--accent-brand-light)"
                        : "var(--color-danger-light)"
                }
                borderColor={
                    isPositive
                        ? "var(--border-glow)"
                        : "var(--color-danger-border)"
                }
                delay="delay-225"
            />
        </div>
    );
}
