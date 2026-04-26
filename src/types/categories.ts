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

export type ExpenseCategory = (typeof TRANSACTION_CATEGORIES.EXPENSE)[number];
export type IncomeCategory = (typeof TRANSACTION_CATEGORIES.INCOME)[number];
export type TransactionCategory = ExpenseCategory | IncomeCategory;
