/**
 * Base Utility Types
 */

// ─── API Response wrappers ────────────────────────────────────────────────────

/** Resposta paginada genérica da API */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

/** Estado de carregamento assíncrono genérico */
export interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

/** Resultado de uma operação de mutação (create/update/delete) */
export interface MutationResult<T = void> {
    success: boolean;
    data?: T;
    error?: string;
}

// ─── Transaction types ────────────────────────────────────────────────────────

export type TransactionType = "INCOME" | "EXPENSE";
export type ImportSource = "MANUAL" | "JSON" | "PDF" | "EXCEL";

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: TransactionType;
    category: string;
    date: string;
    description?: string;
    source?: ImportSource;
}

/** Form data para criar/editar transações */
export interface TransactionFormData {
    title: string;
    amount: string;
    type: TransactionType;
    category: string;
    date: string;
    description: string;
}

export const EMPTY_TRANSACTION_FORM: TransactionFormData = {
    title: "",
    amount: "",
    type: "EXPENSE",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
};

// ─── Filter & Sort types ──────────────────────────────────────────────────────

export type FilterType = "ALL" | TransactionType;

/** Chaves de período de datas para o dashboard e relatórios */
export type DateFilterKey =
    | "all"
    | "this_month"
    | "last_month"
    | "3_months"
    | "6_months"
    | "this_year"
    | "last_year"
    | "custom";

export type SortDirection = "asc" | "desc";

export interface SortState<T extends string> {
    column: T | null;
    direction: SortDirection;
}

// ─── Dashboard types ──────────────────────────────────────────────────────────

export interface DashboardStats {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    byCategory: Record<string, number>;
    recent: Transaction[];
}

// ─── AI / Analysis types ─────────────────────────────────────────────────────

export interface AnalysisResult {
    summary: string;
    tips: string[];
}

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export type AiShortcut = "last_month" | "3_months" | "6_months" | "year";

// ─── Component prop utilities ─────────────────────────────────────────────────

/** Componente com suporte a className e style opcionais */
export interface StylableProps {
    className?: string;
    style?: React.CSSProperties;
}

/** Ação com label e handler — usada em botões e menus */
export interface ActionItem {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: "primary" | "ghost" | "danger";
}

/** Option genérica para selects e filter bars */
export interface SelectOption<T extends string = string> {
    value: T;
    label: string;
}

// ─── Type guards ──────────────────────────────────────────────────────────────

/** Type guard para verificar se uma string é TransactionType */
export function isTransactionType(value: unknown): value is TransactionType {
    return value === "INCOME" || value === "EXPENSE";
}

/** Type guard para verificar se um objeto tem a forma Transaction */
export function isTransaction(value: unknown): value is Transaction {
    if (typeof value !== "object" || value === null) return false;
    const t = value as Record<string, unknown>;
    return (
        typeof t.id === "string" &&
        typeof t.title === "string" &&
        typeof t.amount === "number" &&
        isTransactionType(t.type)
    );
}

/** Type guard para verificar resposta paginada */
export function isPaginatedResponse<T>(
    value: unknown,
    itemGuard: (item: unknown) => item is T,
): value is PaginatedResponse<T> {
    if (typeof value !== "object" || value === null) return false;
    const r = value as Record<string, unknown>;
    return (
        Array.isArray(r.data) &&
        typeof r.total === "number" &&
        r.data.every(itemGuard)
    );
}
