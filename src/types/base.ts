/**
 * Base Utility Types
 * Single source of truth — never redefine these elsewhere.
 */

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export interface MutationResult<T = void> {
    success: boolean;
    data?: T;
    error?: string;
}

// ─── Transaction types ────────────────────────────────────────────────────────

export type TransactionType = "INCOME" | "EXPENSE";
export type ImportSource = "MANUAL" | "JSON" | "PDF" | "EXCEL";

/** Canonical Transaction shape used across the entire app. */
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

/** Valid columns for transaction table sorting. Never includes null — null is handled by consumers. */
export type TransactionSortColumn = "title" | "category" | "date" | "amount";

// ─── Date range ───────────────────────────────────────────────────────────────

export interface DateRange {
    start: Date | null;
    end: Date | null;
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

export type AiShortcut =
    | "last_month"
    | "this_month"
    | "3_months"
    | "6_months"
    | "year";

// ─── Component prop utilities ─────────────────────────────────────────────────

export interface StylableProps {
    className?: string;
    style?: React.CSSProperties;
}

export interface ActionItem {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: "primary" | "ghost" | "danger";
}

export interface SelectOption<T extends string = string> {
    value: T;
    label: string;
}

// ─── Type guards ──────────────────────────────────────────────────────────────

export function isTransactionType(value: unknown): value is TransactionType {
    return value === "INCOME" || value === "EXPENSE";
}

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
