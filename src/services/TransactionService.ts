import { ApiService } from "./ApiService";
import type {
    Transaction,
    TransactionFormData,
    FilterType,
    PaginatedResponse,
    MutationResult,
} from "@/types";

export interface FetchTransactionsParams {
    page?: number;
    limit?: number;
    filter?: FilterType;
    start?: string;
    end?: string;
}

interface ApiTransactionsResponse {
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
}

export class TransactionService extends ApiService {
    constructor() {
        super("/api");
    }

    async fetchTransactions(
        params: FetchTransactionsParams = {},
    ): Promise<PaginatedResponse<Transaction>> {
        const { page = 1, limit = 15, filter, start, end } = params;

        const raw = await this.get<ApiTransactionsResponse>("/transactions", {
            page,
            limit,
            ...(filter && filter !== "ALL" ? { type: filter } : {}),
            ...(start ? { start } : {}),
            ...(end ? { end } : {}),
        });

        return {
            data: raw.transactions ?? [],
            total: raw.total ?? 0,
            page: raw.page ?? 1,
            limit: raw.limit ?? limit,
        };
    }

    async createTransaction(
        form: TransactionFormData,
    ): Promise<MutationResult<Transaction>> {
        try {
            const data = await this.post<Transaction>("/transactions", {
                ...form,
                amount: parseFloat(form.amount),
            });
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Erro ao criar transação",
            };
        }
    }

    async updateTransaction(
        id: string,
        form: TransactionFormData,
    ): Promise<MutationResult<Transaction>> {
        try {
            const data = await this.put<Transaction>(`/transactions/${id}`, {
                ...form,
                amount: parseFloat(form.amount),
            });
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Erro ao atualizar transação",
            };
        }
    }

    async deleteTransaction(id: string): Promise<MutationResult> {
        try {
            await this.delete(`/transactions/${id}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Erro ao excluir transação",
            };
        }
    }

    async bulkCreate(
        items: Partial<TransactionFormData>[],
        source: "JSON" | "EXCEL" | "PDF",
    ): Promise<MutationResult<{ created: number; failed: number }>> {
        let created = 0;
        let failed = 0;

        for (const item of items) {
            try {
                await this.post("/transactions", { ...item, source });
                created++;
            } catch {
                failed++;
            }
        }

        return { success: created > 0, data: { created, failed } };
    }
}

export const transactionService = new TransactionService();
