import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

async function getDashboardStats(userId: string) {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const transactions = await prisma.transaction.findMany({
        where: { userId, date: { gte: start, lte: end } },
    });

    const totalIncome = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const byCategory = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce(
            (acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
                return acc;
            },
            {} as Record<string, number>,
        );

    const recent = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 5,
    });

    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        byCategory,
        recent,
    };
}

export default async function DashboardPage() {
    const session = await auth();
    const stats = await getDashboardStats(session!.user!.id!);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);

    const monthLabel = format(new Date(), "MMMM 'de' yyyy", { locale: ptBR });
    const firstName = session?.user?.name?.split(" ")[0] ?? "você";

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
                .stat-card:hover {
                    border-color: var(--border);
                    background: rgba(16,29,48,.8);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: clamp(.5rem, 2vw, 1rem);
                    margin-bottom: clamp(.75rem, 2vw, 1.5rem);
                }
                @media (max-width: 780px) {
                    .stats-grid { grid-template-columns: 1fr; }
                }

                .bottom-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: clamp(.5rem, 2vw, 1rem);
                }
                @media (max-width: 780px) {
                    .bottom-grid { grid-template-columns: 1fr; }
                }

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

                /* Garante que em telas muito pequenas os valores não quebrem o layout */
                @media (max-width: 400px) {
                    .stat-value {
                        font-size: clamp(13px, 5vw, 22px) !important;
                    }
                }
            `}</style>

            {/* Header */}
            <div
                className="animate-fade-in"
                style={{ marginBottom: "clamp(1rem, 3vw, 2rem)" }}
            >
                <p
                    style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--text-muted)",
                        marginBottom: ".25rem",
                        textTransform: "capitalize",
                    }}
                >
                    {monthLabel}
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
                        marginTop: ".25rem",
                    }}
                >
                    Aqui está o resumo financeiro do mês atual.
                </p>
            </div>

            {/* Stats */}
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
                        Total recebido no mês
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
                        Total gasto no mês
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

            {/* Bottom grid */}
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
                                Nenhum gasto registrado
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
                                        <div key={cat} className="category-row">
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
                                                        whiteSpace: "nowrap",
                                                        flex: 1,
                                                    }}
                                                >
                                                    {cat}
                                                </span>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
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
                                                        {formatCurrency(value)}
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
                                Nenhuma transação ainda
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
                                                    fontSize: "var(--text-xs)",
                                                    fontWeight: 500,
                                                    color: "var(--text-primary)",
                                                    lineHeight: 1.3,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
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
                                                {format(t.date, "dd/MM")}
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
        </div>
    );
}
