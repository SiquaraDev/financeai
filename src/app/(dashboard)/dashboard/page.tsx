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

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-xl font-medium text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">
                    {format(new Date(), "MMMM yyyy", { locale: ptBR })}
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500 mb-1">Receitas</p>
                    <p className="text-2xl font-medium text-green-600">
                        {formatCurrency(stats.totalIncome)}
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500 mb-1">Gastos</p>
                    <p className="text-2xl font-medium text-red-500">
                        {formatCurrency(stats.totalExpense)}
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500 mb-1">Saldo</p>
                    <p
                        className={`text-2xl font-medium ${stats.balance >= 0 ? "text-blue-600" : "text-red-500"}`}
                    >
                        {formatCurrency(stats.balance)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h2 className="text-sm font-medium text-gray-900 mb-4">
                        Gastos por categoria
                    </h2>
                    {Object.keys(stats.byCategory).length === 0 ? (
                        <p className="text-sm text-gray-400">
                            Nenhum gasto registrado este mês.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {Object.entries(stats.byCategory)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 5)
                                .map(([cat, value]) => {
                                    const pct = Math.round(
                                        (value / stats.totalExpense) * 100,
                                    );
                                    return (
                                        <div key={cat}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-600">
                                                    {cat}
                                                </span>
                                                <span className="text-gray-900 font-medium">
                                                    {formatCurrency(value)}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full">
                                                <div
                                                    className="h-1.5 bg-blue-500 rounded-full"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h2 className="text-sm font-medium text-gray-900 mb-4">
                        Últimas transações
                    </h2>
                    {stats.recent.length === 0 ? (
                        <p className="text-sm text-gray-400">
                            Nenhuma transação ainda.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recent.map((t) => (
                                <div
                                    key={t.id}
                                    className="flex items-center justify-between"
                                >
                                    <div>
                                        <p className="text-sm text-gray-900">
                                            {t.title}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {t.category} ·{" "}
                                            {format(t.date, "dd/MM")}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-sm font-medium ${
                                            t.type === "INCOME"
                                                ? "text-green-600"
                                                : "text-red-500"
                                        }`}
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
