import type {
    Transaction,
    TransactionFormData,
    FilterType,
    DashboardStats,
    AnalysisResult,
    ChatMessage,
    DateFilterKey,
    PaginatedResponse,
    MutationResult,
} from "./base";

export interface ITransactionService {
    fetchTransactions(params?: {
        page?: number;
        limit?: number;
        filter?: FilterType;
        start?: string;
        end?: string;
    }): Promise<PaginatedResponse<Transaction>>;
    createTransaction(
        form: TransactionFormData,
    ): Promise<MutationResult<Transaction>>;
    updateTransaction(
        id: string,
        form: TransactionFormData,
    ): Promise<MutationResult<Transaction>>;
    deleteTransaction(id: string): Promise<MutationResult>;
    bulkCreate(
        items: Partial<TransactionFormData>[],
        source: "JSON" | "EXCEL" | "PDF",
    ): Promise<MutationResult<{ created: number; failed: number }>>;
}

export interface IDashboardService {
    fetchStats(
        filter: DateFilterKey,
        customStart?: string,
        customEnd?: string,
    ): Promise<DashboardStats>;
}

export interface IAnalysisService {
    analyze(params: {
        startDate: string;
        endDate: string;
    }): Promise<MutationResult<AnalysisResult>>;
    chat(
        message: string,
        analysisContext: string,
        messages: ChatMessage[],
    ): Promise<MutationResult<string>>;
}
