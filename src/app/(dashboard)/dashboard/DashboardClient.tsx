// src/app/(dashboard)/dashboard/DashboardClient.tsx
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

/* ── Opções de filtro ── */
type FilterKey =
    | "this_month"
    | "last_month"
    | "3_months"
    | "6_months"
    | "this_year"
    | "last_year"
    | "custom";

interface FilterOption {
    key: FilterKey;
    label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
    { key: "this_month", label: "Este mês" },
    { key: "last_month", label: "Mês anterior" },
    { key: "3_months", label: "3 meses" },
    { key: "6_months", label: "6 meses" },
    { key: "this_year", label: "Este ano" },
    { key: "last_year", label: "Ano anterior" },
    { key: "custom", label: "Personalizado" },
];

// ✅ Retorna sempre start às 00:00:00 e end às 23:59:59 no horário local
function getDateRange(
    filter: FilterKey,
    customStart?: string,
    customEnd?: string,
) {
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
        case "this_month":
            return { start: startOf(now), end: endOf(now) };

        case "last_month": {
            const last = subMonths(now, 1);
            return { start: startOf(last), end: endOf(last) };
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
            const lastY = subYears(now, 1);
            const s = startOfYear(lastY);
            s.setHours(0, 0, 0, 0);
            const e = endOfYear(lastY);
            e.setHours(23, 59, 59, 999);
            return { start: s, end: e };
        }

        case "custom": {
            // ✅ Parse manual para evitar problemas de timezone com new Date("yyyy-MM-dd")
            const parseLocalDate = (str: string, endOfDay = false) => {
                const [year, month, day] = str.split("-").map(Number);
                const d = new Date(year, month - 1, day);
                if (endOfDay) d.setHours(23, 59, 59, 999);
                else d.setHours(0, 0, 0, 0);
                return d;
            };

            const s = customStart
                ? parseLocalDate(customStart, false)
                : startOf(now);
            const e = customEnd ? parseLocalDate(customEnd, true) : endOf(now);
            return { start: s, end: e };
        }
    }
}

/* ── Helpers ── */
const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(v);

export default function DashboardClient({ session }: { session: Session }) {
    const [activeFilter, setActiveFilter] = useState<FilterKey>("this_month");
    const [customStart, setCustomStart] = useState(
        format(startOfMonth(new Date()), "yyyy-MM-dd"),
    );
    const [customEnd, setCustomEnd] = useState(
        format(endOfMonth(new Date()), "yyyy-MM-dd"),
    );
    const [showCustom, setShowCustom] = useState(false);
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
            // ✅ Passa start e end como ISO string para a API filtrar no banco
            const res = await fetch(
                `/api/transactions?limit=200&start=${start.toISOString()}&end=${end.toISOString()}`,
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

    /* Label do período ativo */
    const { start, end } = getDateRange(activeFilter, customStart, customEnd);
    const periodLabel =
        activeFilter === "this_month"
            ? format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })
            : `${format(start, "dd/MM/yyyy")} – ${format(end, "dd/MM/yyyy")}`;

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

        /* Filter bar */
        .filter-bar {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-wrap: wrap;
        }
        .filter-btn {
          padding: 5px 12px;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-family: var(--font-body);
          cursor: pointer;
          transition: all var(--transition-base);
          white-space: nowrap;
          font-weight: 500;
        }
        .filter-btn.active {
          background: var(--gradient-brand);
          border: none;
          color: var(--text-on-brand);
          box-shadow: var(--shadow-brand);
          font-weight: 600;
        }
        .filter-btn.inactive {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-muted);
        }
        .filter-btn.inactive:hover {
          border-color: var(--border-strong);
          color: var(--text-secondary);
          background: var(--bg-elevated);
        }
        .custom-dates {
          display: flex;
          gap: var(--space-2);
          align-items: center;
          flex-wrap: wrap;
          margin-top: var(--space-2);
        }
        .custom-date-field {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }
        @media (max-width: 480px) {
          .filter-bar { gap: var(--space-1); }
          .filter-btn { padding: 4px 9px; }
        }
        @media (max-width: 360px) {
          .stat-value { font-size: clamp(13px, 5vw, 22px) !important; }
        }
      `}</style>

            {/* ── Header ── */}
            <div
                className="animate-fade-in"
                style={{ marginBottom: "clamp(1rem, 3vw, 1.5rem)" }}
            >
                <p
                    style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--text-muted)",
                        marginBottom: ".25rem",
                        textTransform: "capitalize",
                    }}
                >
                    {periodLabel}
                </p>
                <h1
                    className="font-display"
                    style={{
                        fontSize: "clamp(16px, 5vw, 30px)",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.2,
                        wordBreak: "break-word",
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

            {/* ── Filtro de período ── */}
            <div
                className="card-glass animate-fade-in delay-75"
                style={{
                    padding:
                        "clamp(.75rem, 2vw, 1rem) clamp(.875rem, 3vw, 1.25rem)",
                    marginBottom: "clamp(.75rem, 2vw, 1.5rem)",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                        marginBottom: "var(--space-3)",
                    }}
                >
                    {/* Ícone calendário */}
                    <span
                        style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "var(--radius-sm)",
                            background: "var(--accent-brand-glow)",
                            border: "1px solid var(--border-glow)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--accent-brand-light)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </span>
                    <p
                        style={{
                            fontSize: "var(--text-xs)",
                            fontWeight: 600,
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                        }}
                    >
                        Período
                    </p>

                    {/* Label do período ativo — right side */}
                    <span
                        style={{
                            marginLeft: "auto",
                            fontSize: "var(--text-xs)",
                            color: "var(--accent-brand-light)",
                            fontWeight: 500,
                            background: "var(--accent-brand-glow)",
                            border: "1px solid var(--border-glow)",
                            borderRadius: "var(--radius-full)",
                            padding: "2px 10px",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {periodLabel}
                    </span>
                </div>

                {/* Botões de filtro */}
                <div className="filter-bar">
                    {FILTER_OPTIONS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => {
                                setActiveFilter(key);
                                setShowCustom(key === "custom");
                            }}
                            className={`filter-btn ${activeFilter === key ? "active" : "inactive"}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Datas customizadas */}
                {showCustom && (
                    <div className="custom-dates animate-fade-in">
                        <div className="custom-date-field">
                            <label
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: "var(--text-muted)",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                De
                            </label>
                            <input
                                type="date"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                                style={{
                                    padding: "6px 10px",
                                    fontSize: "var(--text-xs)",
                                }}
                            />
                        </div>
                        <div className="custom-date-field">
                            <label
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: "var(--text-muted)",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Até
                            </label>
                            <input
                                type="date"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                                style={{
                                    padding: "6px 10px",
                                    fontSize: "var(--text-xs)",
                                }}
                            />
                        </div>
                        <button
                            onClick={fetchStats}
                            className="btn-primary"
                            style={{
                                padding: "6px 16px",
                                fontSize: "var(--text-xs)",
                                borderRadius: "var(--radius-md)",
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-1)",
                            }}
                        >
                            <svg
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Aplicar
                        </button>
                    </div>
                )}
            </div>

            {/* ── Stats ── */}
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
                    {/* Receitas */}
                    <div
                        className="stat-card delay-75"
                        style={{ borderColor: "var(--color-success-border)" }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: ".5rem",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: "var(--text-muted)",
                                    textTransform: "uppercase",
                                    letterSpacing: ".06em",
                                    fontWeight: 600,
                                }}
                            >
                                Receitas
                            </p>
                            <span
                                style={{
                                    width: "26px",
                                    height: "26px",
                                    flexShrink: 0,
                                    borderRadius: "var(--radius-full)",
                                    background: "var(--color-success-bg)",
                                    border: "1px solid var(--color-success-border)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--color-success-light)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="12" y1="19" x2="12" y2="5" />
                                    <polyline points="5 12 12 5 19 12" />
                                </svg>
                            </span>
                        </div>
                        <p
                            className="font-display stat-value"
                            style={{
                                fontSize: "clamp(14px, 3.5vw, 24px)",
                                fontWeight: 700,
                                color: "var(--color-success-light)",
                                letterSpacing: "-0.03em",
                                marginTop: ".25rem",
                                wordBreak: "break-all",
                            }}
                        >
                            {formatCurrency(stats.totalIncome)}
                        </p>
                        <p
                            style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--text-muted)",
                            }}
                        >
                            Total recebido no período
                        </p>
                    </div>

                    {/* Gastos */}
                    <div
                        className="stat-card delay-150"
                        style={{ borderColor: "var(--color-danger-border)" }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: ".5rem",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: "var(--text-muted)",
                                    textTransform: "uppercase",
                                    letterSpacing: ".06em",
                                    fontWeight: 600,
                                }}
                            >
                                Gastos
                            </p>
                            <span
                                style={{
                                    width: "26px",
                                    height: "26px",
                                    flexShrink: 0,
                                    borderRadius: "var(--radius-full)",
                                    background: "var(--color-danger-bg)",
                                    border: "1px solid var(--color-danger-border)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--color-danger-light)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <polyline points="19 12 12 19 5 12" />
                                </svg>
                            </span>
                        </div>
                        <p
                            className="font-display stat-value"
                            style={{
                                fontSize: "clamp(14px, 3.5vw, 24px)",
                                fontWeight: 700,
                                color: "var(--color-danger-light)",
                                letterSpacing: "-0.03em",
                                marginTop: ".25rem",
                                wordBreak: "break-all",
                            }}
                        >
                            {formatCurrency(stats.totalExpense)}
                        </p>
                        <p
                            style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--text-muted)",
                            }}
                        >
                            Total gasto no período
                        </p>
                    </div>

                    {/* Saldo */}
                    <div
                        className="stat-card delay-225"
                        style={{
                            borderColor:
                                stats.balance >= 0
                                    ? "var(--border-glow)"
                                    : "var(--color-danger-border)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: ".5rem",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: "var(--text-muted)",
                                    textTransform: "uppercase",
                                    letterSpacing: ".06em",
                                    fontWeight: 600,
                                }}
                            >
                                Saldo
                            </p>
                            <span
                                style={{
                                    width: "26px",
                                    height: "26px",
                                    flexShrink: 0,
                                    borderRadius: "var(--radius-full)",
                                    background:
                                        stats.balance >= 0
                                            ? "var(--accent-brand-glow)"
                                            : "var(--color-danger-bg)",
                                    border: `1px solid ${stats.balance >= 0 ? "var(--border-glow)" : "var(--color-danger-border)"}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={
                                        stats.balance >= 0
                                            ? "var(--accent-brand-light)"
                                            : "var(--color-danger-light)"
                                    }
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="12" y1="1" x2="12" y2="23" />
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </span>
                        </div>
                        <p
                            className="font-display stat-value"
                            style={{
                                fontSize: "clamp(14px, 3.5vw, 24px)",
                                fontWeight: 700,
                                color:
                                    stats.balance >= 0
                                        ? "var(--accent-brand-light)"
                                        : "var(--color-danger-light)",
                                letterSpacing: "-0.03em",
                                marginTop: ".25rem",
                                wordBreak: "break-all",
                            }}
                        >
                            {formatCurrency(stats.balance)}
                        </p>
                        <p
                            style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--text-muted)",
                            }}
                        >
                            {stats.balance >= 0
                                ? "Você está no positivo 🎉"
                                : "Atenção: saldo negativo"}
                        </p>
                    </div>
                </div>
            ) : null}

            {/* ── Bottom grid ── */}
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
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: ".625rem",
                                marginBottom: "1.125rem",
                            }}
                        >
                            <span
                                style={{
                                    width: "26px",
                                    height: "26px",
                                    flexShrink: 0,
                                    borderRadius: "var(--radius-md)",
                                    background: "var(--accent-brand-glow)",
                                    border: "1px solid var(--border-glow)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--accent-brand-light)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                                    <path d="M22 12A10 10 0 0 0 12 2v10z" />
                                </svg>
                            </span>
                            <h2
                                className="font-display"
                                style={{
                                    fontSize: "var(--text-sm)",
                                    fontWeight: 700,
                                    color: "var(--text-primary)",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                Gastos por categoria
                            </h2>
                        </div>

                        {Object.keys(stats.byCategory).length === 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    padding: "1.5rem 0",
                                    gap: ".5rem",
                                }}
                            >
                                <svg
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--text-dim)"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <p
                                    style={{
                                        fontSize: "var(--text-sm)",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    Nenhum gasto no período
                                </p>
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: ".75rem",
                                }}
                            >
                                {Object.entries(stats.byCategory)
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 5)
                                    .map(([cat, value], i) => {
                                        const pct = Math.round(
                                            (value / stats.totalExpense) * 100,
                                        );
                                        const colors = [
                                            "var(--accent-brand-light)",
                                            "var(--accent-teal-light)",
                                            "var(--color-warning-light)",
                                            "var(--color-success-light)",
                                            "var(--color-info-light)",
                                        ];
                                        const color = colors[i % colors.length];
                                        return (
                                            <div
                                                key={cat}
                                                className="category-row"
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems: "center",
                                                        marginBottom: ".3rem",
                                                        gap: ".375rem",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize:
                                                                "var(--text-xs)",
                                                            color: "var(--text-secondary)",
                                                            fontWeight: 500,
                                                            minWidth: 0,
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap",
                                                            flex: 1,
                                                        }}
                                                    >
                                                        {cat}
                                                    </span>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: ".375rem",
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    "var(--text-xs)",
                                                                color: "var(--text-muted)",
                                                            }}
                                                        >
                                                            {pct}%
                                                        </span>
                                                        <span
                                                            className="font-mono"
                                                            style={{
                                                                fontSize:
                                                                    "var(--text-xs)",
                                                                color,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {formatCurrency(
                                                                value,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        height: "3px",
                                                        background:
                                                            "var(--bg-elevated)",
                                                        borderRadius:
                                                            "var(--radius-full)",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            height: "100%",
                                                            width: `${pct}%`,
                                                            background: color,
                                                            borderRadius:
                                                                "var(--radius-full)",
                                                            transition:
                                                                "width .6s cubic-bezier(0.16,1,0.3,1)",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>

                    {/* Últimas transações */}
                    <div
                        className="animate-fade-in delay-300 card-glass"
                        style={{
                            padding: "clamp(.875rem, 3vw, 1.5rem)",
                            minWidth: 0,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: ".625rem",
                                marginBottom: "1.125rem",
                            }}
                        >
                            <span
                                style={{
                                    width: "26px",
                                    height: "26px",
                                    flexShrink: 0,
                                    borderRadius: "var(--radius-md)",
                                    background: "var(--accent-teal-glow)",
                                    border: "1px solid rgba(20,184,166,.25)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--accent-teal-light)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                            </span>
                            <h2
                                className="font-display"
                                style={{
                                    fontSize: "var(--text-sm)",
                                    fontWeight: 700,
                                    color: "var(--text-primary)",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                Últimas transações
                            </h2>
                        </div>

                        {stats.recent.length === 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    padding: "1.5rem 0",
                                    gap: ".5rem",
                                }}
                            >
                                <svg
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--text-dim)"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect
                                        x="2"
                                        y="3"
                                        width="20"
                                        height="14"
                                        rx="2"
                                    />
                                    <line x1="8" y1="21" x2="16" y2="21" />
                                    <line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                                <p
                                    style={{
                                        fontSize: "var(--text-sm)",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    Nenhuma transação no período
                                </p>
                            </div>
                        ) : (
                            <div>
                                {stats.recent.map((t) => (
                                    <div key={t.id} className="tx-row">
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: ".625rem",
                                                minWidth: 0,
                                                flex: 1,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    flexShrink: 0,
                                                    borderRadius:
                                                        "var(--radius-md)",
                                                    background:
                                                        t.type === "INCOME"
                                                            ? "var(--color-success-bg)"
                                                            : "var(--color-danger-bg)",
                                                    border: `1px solid ${t.type === "INCOME" ? "var(--color-success-border)" : "var(--color-danger-border)"}`,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <svg
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke={
                                                        t.type === "INCOME"
                                                            ? "var(--color-success-light)"
                                                            : "var(--color-danger-light)"
                                                    }
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    {t.type === "INCOME" ? (
                                                        <>
                                                            <line
                                                                x1="12"
                                                                y1="19"
                                                                x2="12"
                                                                y2="5"
                                                            />
                                                            <polyline points="5 12 12 5 19 12" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <line
                                                                x1="12"
                                                                y1="5"
                                                                x2="12"
                                                                y2="19"
                                                            />
                                                            <polyline points="19 12 12 19 5 12" />
                                                        </>
                                                    )}
                                                </svg>
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <p
                                                    style={{
                                                        fontSize:
                                                            "var(--text-xs)",
                                                        fontWeight: 500,
                                                        color: "var(--text-primary)",
                                                        lineHeight: 1.3,
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {t.title}
                                                </p>
                                                <p
                                                    style={{
                                                        fontSize: "10px",
                                                        color: "var(--text-muted)",
                                                    }}
                                                >
                                                    {t.category} ·{" "}
                                                    {format(
                                                        new Date(t.date),
                                                        "dd/MM",
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className="font-mono"
                                            style={{
                                                fontSize: "var(--text-xs)",
                                                fontWeight: 600,
                                                flexShrink: 0,
                                                marginLeft: ".5rem",
                                                color:
                                                    t.type === "INCOME"
                                                        ? "var(--color-success-light)"
                                                        : "var(--color-danger-light)",
                                            }}
                                        >
                                            {t.type === "INCOME" ? "+" : "-"}
                                            {formatCurrency(Number(t.amount))}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
