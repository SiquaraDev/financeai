import { ApiService } from "./ApiService";
import type { Transaction, DashboardStats, DateFilterKey } from "@/types";
import { getDateRange, toLocalISO } from "@/utils/dateRange";

interface ApiTransactionsResponse {
    transactions: Transaction[];
}

export class DashboardService extends ApiService {
    constructor() {
        super("/api");
    }

    async fetchStats(
        activeFilter: DateFilterKey,
        customStart?: string,
        customEnd?: string,
    ): Promise<DashboardStats> {
        const { start, end } = getDateRange(
            activeFilter,
            customStart,
            customEnd,
        );

        const raw = await this.get<ApiTransactionsResponse>("/transactions", {
            limit: 200,
            ...(start ? { start: toLocalISO(start) } : {}),
            ...(end ? { end: toLocalISO(end) } : {}),
        });

        const txs = raw.transactions ?? [];

        return {
            totalIncome: this.sumByType(txs, "INCOME"),
            totalExpense: this.sumByType(txs, "EXPENSE"),
            balance:
                this.sumByType(txs, "INCOME") - this.sumByType(txs, "EXPENSE"),
            byCategory: this.groupByCategory(txs),
            recent: this.getRecent(txs, 5),
        };
    }

    private sumByType(txs: Transaction[], type: "INCOME" | "EXPENSE"): number {
        return txs
            .filter((t) => t.type === type)
            .reduce((sum, t) => sum + Number(t.amount), 0);
    }

    private groupByCategory(txs: Transaction[]): Record<string, number> {
        return txs
            .filter((t) => t.type === "EXPENSE")
            .reduce<Record<string, number>>((acc, t) => {
                acc[t.category] = (acc[t.category] ?? 0) + Number(t.amount);
                return acc;
            }, {});
    }

    private getRecent(txs: Transaction[], count: number): Transaction[] {
        return [...txs]
            .sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .slice(0, count);
    }
}

export const dashboardService = new DashboardService();
