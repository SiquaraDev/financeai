import type {
    Transaction,
    TransactionFormData,
    FilterType,
    DashboardStats,
    AnalysisResult,
    ChatMessage,
    DateFilterKey,
    DateRange,
    SortDirection,
    AiShortcut,
    TransactionSortColumn,
    PaginatedResponse,
    MutationResult,
} from "./base";

// Re-export so consumers can import from "@/types" directly
export type {
    Transaction,
    TransactionFormData,
    FilterType,
    DashboardStats,
    AnalysisResult,
    ChatMessage,
    DateFilterKey,
    DateRange,
    SortDirection,
    AiShortcut,
    TransactionSortColumn,
    PaginatedResponse,
    MutationResult,
};

export interface UseDashboardStatsReturn {
    stats: DashboardStats | null;
    loading: boolean;
    refetch: () => void;
}

export interface UseDateRangeReturn {
    activeFilter: DateFilterKey;
    customStart: string;
    customEnd: string;
    range: DateRange;
    periodLabel: string;
    setActiveFilter: (key: DateFilterKey) => void;
    setCustomStart: (v: string) => void;
    setCustomEnd: (v: string) => void;
}

export interface UseTransactionsReturn {
    transactions: Transaction[];
    total: number;
    page: number;
    filter: FilterType;
    loading: boolean;
    setPage: (p: number) => void;
    setFilter: (f: FilterType) => void;
    refetch: () => void;
    showModal: boolean;
    showImport: boolean;
    editingId: string | null;
    form: TransactionFormData;
    saving: boolean;
    importError: string;
    openCreate: () => void;
    openEdit: (t: Transaction) => void;
    closeModal: () => void;
    openImport: () => void;
    closeImport: () => void;
    updateForm: (updates: Partial<TransactionFormData>) => void;
    handleSave: () => Promise<void>;
    handleDelete: (id: string) => Promise<void>;
    handleFileImport: (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "json" | "excel" | "pdf",
    ) => void;
}

export interface UseAiPageReturn {
    startDate: string;
    endDate: string;
    activeShortcut: AiShortcut;
    analysis: AnalysisResult | null;
    analyzing: boolean;
    messages: ChatMessage[];
    input: string;
    chatLoading: boolean;
    setStartDate: (v: string) => void;
    setEndDate: (v: string) => void;
    handleShortcut: (s: AiShortcut) => void;
    handleAnalyze: () => Promise<void>;
    setInput: (v: string) => void;
    handleChat: () => Promise<void>;
}

export interface UseSortReturn<T extends string> {
    sortColumn: T | null;
    sortDirection: SortDirection;
    handleSort: (col: T) => void;
}
