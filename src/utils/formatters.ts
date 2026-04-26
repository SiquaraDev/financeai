const BRL_FORMATTER = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

/**
 * Formata número para currency BRL.
 * @example formatCurrency(1234.56) // "R$ 1.234,56"
 */
export function formatCurrency(value: number): string {
    return BRL_FORMATTER.format(value);
}

/**
 * Formata valor em formato compacto para eixos de gráficos.
 * @example formatCurrencyCompact(12500) // "R$12k"
 * @example formatCurrencyCompact(1500000) // "R$1.5M"
 */
export function formatCurrencyCompact(value: number): string {
    if (Math.abs(value) >= 1_000_000) {
        return `R$${(value / 1_000_000).toFixed(1)}M`;
    }
    return `R$${(value / 1000).toFixed(0)}k`;
}

/**
 * Formata valor com sinal explícito de positivo ou negativo.
 * @example formatCurrencyWithSign(1234) // "+R$ 1.234,00"
 * @example formatCurrencyWithSign(-500) // "-R$ 500,00"
 */
export function formatCurrencyWithSign(value: number): string {
    const prefix = value >= 0 ? "+" : "-";
    return `${prefix}${formatCurrency(Math.abs(value))}`;
}

/**
 * Capitaliza a primeira letra de uma string.
 * @example capitalize("hello world") // "Hello world"
 */
export function capitalize(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Extrai o primeiro nome de um nome completo.
 * @example getFirstName("João Silva") // "João"
 * @example getFirstName(undefined) // "você"
 */
export function getFirstName(fullName: string | undefined | null): string {
    if (!fullName) return "você";
    return fullName.split(" ")[0];
}

/**
 * Extrai iniciais de um nome, máximo 2 letras maiúsculas.
 * @example getInitials("João Silva") // "JS"
 * @example getInitials(undefined) // "U"
 */
export function getInitials(name?: string | null): string {
    if (!name) return "U";
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

/**
 * Parse seguro de string de data para evitar bugs de fuso horário.
 * Fixa a hora em 12:00 para que a data nunca recue um dia em UTC.
 * @example parseSafeDate("2024-04-15") // Date(2024-04-15T12:00:00)
 */
export function parseSafeDate(dateStr: string): Date {
    const datePart = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    return new Date(`${datePart}T12:00:00`);
}

/**
 * Agrupa um array de objetos por uma chave string.
 * @example groupBy([{cat:"A",v:1},{cat:"B",v:2}], "cat") // {A:[...], B:[...]}
 */
export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
    return items.reduce<Record<string, T[]>>((acc, item) => {
        const k = String(item[key]);
        if (!acc[k]) acc[k] = [];
        acc[k].push(item);
        return acc;
    }, {});
}

/**
 * Soma os valores de uma chave numérica em um array de objetos.
 * @example sumBy([{amount:10},{amount:20}], "amount") // 30
 */
export function sumBy<T>(items: T[], key: keyof T): number {
    return items.reduce((sum, item) => sum + Number(item[key]), 0);
}

/**
 * Ordena um array de objetos por uma chave. Não muta o original.
 * @example sortBy([{v:3},{v:1}], "v", "asc") // [{v:1},{v:3}]
 */
export function sortBy<T>(
    items: T[],
    key: keyof T,
    direction: "asc" | "desc" = "asc",
): T[] {
    return [...items].sort((a, b) => {
        const va = a[key];
        const vb = b[key];
        if (va < vb) return direction === "asc" ? -1 : 1;
        if (va > vb) return direction === "asc" ? 1 : -1;
        return 0;
    });
}

/**
 * Verifica se uma string representa um número positivo válido.
 * @example isPositiveNumber("123.45") // true
 * @example isPositiveNumber("-1")     // false
 */
export function isPositiveNumber(value: string): boolean {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
}

/**
 * Verifica se uma string tem pelo menos N caracteres não-espaço.
 * @example hasMinLength("hello", 3) // true
 */
export function hasMinLength(value: string, min: number): boolean {
    return value.trim().length >= min;
}

/**
 * Trunca uma string ao comprimento máximo, adicionando reticências.
 * @example truncate("Hello World", 8) // "Hello Wo…"
 */
export function truncate(value: string, maxLength: number): string {
    if (value.length <= maxLength) return value;
    return `${value.slice(0, maxLength)}…`;
}

/**
 * Remove acentos e normaliza string para busca case-insensitive.
 * @example normalizeSearch("Ação") // "acao"
 */
export function normalizeSearch(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
