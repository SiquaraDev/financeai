import { TransactionType, ImportSource } from "@prisma/client";

export type { TransactionType, ImportSource };

export interface TransactionWithUser {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  description: string | null;
  source: ImportSource;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionFormData {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description?: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface CategoryExpense {
  category: string;
  total: number;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiAnalysisResult {
  summary: string;
  tips: string[];
}

export const TRANSACTION_CATEGORIES = {
  EXPENSE: [
    "Alimentação",
    "Transporte",
    "Moradia",
    "Saúde",
    "Lazer",
    "Educação",
    "Vestuário",
    "Tecnologia",
    "Viagens",
    "Outros",
  ],
  INCOME: [
    "Salário",
    "Freelance",
    "Investimentos",
    "Aluguel",
    "Presente",
    "Outros",
  ],
} as const;
