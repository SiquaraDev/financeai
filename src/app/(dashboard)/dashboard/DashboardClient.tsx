"use client";

import { useState, useEffect, useCallback } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    subMonths,
    startOfYear,
    endOfYear,
    subYears,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import StatCard from "@/components/dashboard/StatCard";
import PeriodFilter, {
    type FilterKey,
} from "@/components/dashboard/PeriodFilter";
import CategoryExpenseList from "@/components/dashboard/CategoryExpenseList";
import RecentTransactionsList from "@/components/dashboard/RecentTransactionsList";
import SectionHeader from "@/components/ui/SectionHeader";
import {
    IconArrowUp,
    IconArrowDown,
    IconDollarSign,
    IconPieChart,
    IconActivity,
} from "@/components/icons";

/* ── Tipos ── */
interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
    date: string;
}

interface DashboardStats {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    byCategory: Record<string, number>;
    recent: Transaction[];
}

interface Session {
    user?: { id?: string; name?: string; email?: string };
}

/* ── Lógica de período ── */
function getDateRange(
    filter: FilterKey,
    customStart?: string,
    customEnd?: string,
): { start: Date | null; end: Date | null } {
    const now = new Date();

    const startOf = (d: Date) => {
        const s = startOfMonth(d);
        s.setHours(0, 0, 0, 0);
        return s;
    };
    const endOf = (d: Date) => {
        const e = endOfMonth(d);
        e.setHours(23, 59, 59, 999);
        return e;
    };

    switch (filter) {
        case "all":
            return { start: null, end: null };
        case "this_month":
            return { start: startOf(now), end: endOf(now) };
        case "last_month": {
            const l = subMonths(now, 1);
            return { start: startOf(l), end: endOf(l) };
        }
        case "3_months":
            return { start: startOf(subMonths(now, 2)), end: endOf(now) };
        case "6_months":
            return { start: startOf(subMonths(now, 5)), end: endOf(now) };
        case "this_year": {
            const s = startOfYear(now);
            s.setHours(0, 0, 0, 0);
            const e = endOfYear(now);
            e.setHours(23, 59, 59, 999);
            return { start: s, end: e };
        }
        case "last_year": {
            const ly = subYears(now, 1);
            const s = startOfYear(ly);
            s.setHours(0, 0, 0, 0);
            const e = endOfYear(ly);
            e.setHours(23, 59, 59, 999);
            return { start: s, end: e };
        }
        case "custom": {
            const parse = (str: string, end = false) => {
                const [y, m, d] = str.split("-").map(Number);
                const dt = new Date(y, m - 1, d);
                end ? dt.setHours(23, 59, 59, 999) : dt.setHours(0, 0, 0, 0);
                return dt;
            };
            return {
                start: customStart ? parse(customStart) : startOf(now),
                end: customEnd ? parse(customEnd, true) : endOf(now),
            };
        }
        default:
            return { start: null, end: null };
    }
}

const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(v);

/* ── Componente ── */
export default function DashboardClient({ session }: { session: Session }) {
    const [activeFilter, setActiveFilter] = useState<FilterKey>("this_month");
    const [customStart, setCustomStart] = useState(
        format(startOfMonth(new Date()), "yyyy-MM-dd"),
    );
    const [customEnd, setCustomEnd] = useState(
        format(endOfMonth(new Date()), "yyyy-MM-dd"),
    );
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const firstName = session?.user?.name?.split(" ")[0] ?? "você";

    const fetchStats = useCallback(async () => {
        setLoading(true);
        const { start, end } = getDateRange(
            activeFilter,
            customStart,
            customEnd,
        );

        try {
            const toLocalISO = (d: Date) => {
                const p = (n: number) => String(n).padStart(2, "0");
                return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
            };
            const startParam = start ? `&start=${toLocalISO(start)}` : "";
            const endParam = end ? `&end=${toLocalISO(end)}` : "";

            const res = await fetch(
                `/api/transactions?limit=200${startParam}${endParam}`,
            );
            const data = await res.json();
            const txs: Transaction[] = data.transactions ?? [];

            const totalIncome = txs
                .filter((t) => t.type === "INCOME")
                .reduce((s, t) => s + Number(t.amount), 0);
            const totalExpense = txs
                .filter((t) => t.type === "EXPENSE")
                .reduce((s, t) => s + Number(t.amount), 0);
            const byCategory = txs
                .filter((t) => t.type === "EXPENSE")
                .reduce(
                    (acc, t) => {
                        acc[t.category] =
                            (acc[t.category] || 0) + Number(t.amount);
                        return acc;
                    },
                    {} as Record<string, number>,
                );
            const recent = [...txs]
                .sort(
                    (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                .slice(0, 5);

            setStats({
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                byCategory,
                recent,
            });
        } catch {
            setStats(null);
        } finally {
            setLoading(false);
        }
    }, [activeFilter, customStart, customEnd]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const { start, end } = getDateRange(activeFilter, customStart, customEnd);
    const periodLabel =
        activeFilter === "all"
            ? "Todos os períodos"
            : activeFilter === "this_month"
              ? format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })
              : start && end
                ? `${format(start, "dd/MM/yyyy")} – ${format(end, "dd/MM/yyyy")}`
                : "Todos os períodos";

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
            <style>{`
        @keyframes count-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stat-card {
          background: rgba(12,21,36,.72);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          backdrop-filter: blur(20px);
          padding: clamp(.875rem, 3vw, 1.5rem);
          display: flex; flex-direction: column; gap: .5rem;
          transition: border-color var(--transition-base), background var(--transition-base);
          animation: count-up .4s ease forwards;
          min-width: 0;
        }
        .stat-card:hover { border-color: var(--border); background: rgba(16,29,48,.8); }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(.5rem, 2vw, 1rem);
          margin-bottom: clamp(.75rem, 2vw, 1.5rem);
        }
        @media (max-width: 780px) { .stats-grid { grid-template-columns: 1fr; } }
        .bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(.5rem, 2vw, 1rem);
        }
        @media (max-width: 780px) { .bottom-grid { grid-template-columns: 1fr; } }
        .tx-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: .625rem .375rem;
          border-bottom: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          transition: background var(--transition-base);
          min-width: 0;
        }
        .tx-row:last-child { border-bottom: none; }
        .tx-row:hover { background: var(--bg-elevated); }
        .category-row {
          padding: .25rem .375rem;
          border-radius: var(--radius-md);
          transition: background var(--transition-base);
          min-width: 0;
        }
        .category-row:hover { background: var(--bg-elevated); }
        .filter-bar { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; }
        .filter-btn { padding: 5px 12px; border-radius: var(--radius-full); font-size: var(--text-xs); font-family: var(--font-body); cursor: pointer; transition: all var(--transition-base); white-space: nowrap; font-weight: 500; }
        .filter-btn.active   { background: var(--gradient-brand); border: none; color: var(--text-on-brand); box-shadow: var(--shadow-brand); font-weight: 600; }
        .filter-btn.inactive { background: transparent; border: 1px solid var(--border); color: var(--text-muted); }
        .filter-btn.inactive:hover { border-color: var(--border-strong); color: var(--text-secondary); background: var(--bg-elevated); }
        .custom-dates { display: flex; gap: var(--space-2); align-items: center; flex-wrap: wrap; margin-top: var(--space-2); }
        .custom-date-field { display: flex; align-items: center; gap: var(--space-1); }
        @media (max-width: 360px) { .stat-value { font-size: clamp(13px, 5vw, 22px) !important; } }
      `}</style>

            {/* Header */}
            <div
                className="animate-fade-in"
                style={{ marginBottom: "clamp(1rem, 3vw, 1.5rem)" }}
            >
                <p
                    style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--text-muted)",
                        marginBottom: ".25rem",
                    }}
                >
                    {periodLabel.charAt(0).toUpperCase() +
                        periodLabel.slice(1).toLowerCase()}
                </p>
                <h1
                    className="font-display"
                    style={{
                        fontSize: "clamp(16px, 5vw, 30px)",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.2,
                        marginBottom: ".25rem",
                    }}
                >
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
                </h1>
                <p
                    style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--text-secondary)",
                    }}
                >
                    Aqui está o resumo financeiro do período selecionado.
                </p>
            </div>

            {/* Filtro de período */}
            <PeriodFilter
                activeFilter={activeFilter}
                customStart={customStart}
                customEnd={customEnd}
                periodLabel={periodLabel}
                onFilterChange={setActiveFilter}
                onCustomStartChange={setCustomStart}
                onCustomEndChange={setCustomEnd}
            />

            {/* Stats */}
            {loading ? (
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
            ) : stats ? (
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
                            stats.balance >= 0
                                ? "Você está no positivo 🎉"
                                : "Atenção: saldo negativo"
                        }
                        icon={<IconDollarSign />}
                        iconBg={
                            stats.balance >= 0
                                ? "var(--accent-brand-glow)"
                                : "var(--color-danger-bg)"
                        }
                        iconBorder={
                            stats.balance >= 0
                                ? "var(--border-glow)"
                                : "var(--color-danger-border)"
                        }
                        iconColor={
                            stats.balance >= 0
                                ? "var(--accent-brand-light)"
                                : "var(--color-danger-light)"
                        }
                        valueColor={
                            stats.balance >= 0
                                ? "var(--accent-brand-light)"
                                : "var(--color-danger-light)"
                        }
                        borderColor={
                            stats.balance >= 0
                                ? "var(--border-glow)"
                                : "var(--color-danger-border)"
                        }
                        delay="delay-225"
                    />
                </div>
            ) : null}

            {/* Bottom grid */}
            {stats && (
                <div className="bottom-grid">
                    {/* Gastos por categoria */}
                    <div
                        className="animate-fade-in delay-225 card-glass"
                        style={{
                            padding: "clamp(.875rem, 3vw, 1.5rem)",
                            minWidth: 0,
                        }}
                    >
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
                    </div>

                    {/* Últimas transações */}
                    <div
                        className="animate-fade-in delay-300 card-glass"
                        style={{
                            padding: "clamp(.875rem, 3vw, 1.5rem)",
                            minWidth: 0,
                        }}
                    >
                        <SectionHeader
                            title="Últimas transações"
                            icon={<IconActivity />}
                            iconBg="var(--accent-teal-glow)"
                            iconBorder="rgba(20,184,166,.25)"
                            iconColor="var(--accent-teal-light)"
                        />
                        <RecentTransactionsList transactions={stats.recent} />
                    </div>
                </div>
            )}
        </div>
    );
}
