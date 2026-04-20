export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

export function formatCurrencyCompact(value: number): string {
    return `R$${(value / 1000).toFixed(0)}k`;
}

export function capitalize(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function parseSafeDate(dateStr: string): Date {
    const datePart = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    return new Date(`${datePart}T12:00:00`);
}
