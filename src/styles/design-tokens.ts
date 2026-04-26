// ─── Colors ──────────────────────────────────────────────────────────────────

export const colors = {
    brand: {
        light: "var(--accent-brand-light)",
        base: "var(--accent-brand)",
        glow: "var(--accent-brand-glow)",
        glowLg: "var(--accent-brand-glow-lg)",
    },
    teal: {
        light: "var(--accent-teal-light)",
        base: "var(--accent-teal)",
        glow: "var(--accent-teal-glow)",
    },
    success: {
        light: "var(--color-success-light)",
        base: "var(--color-success)",
        bg: "var(--color-success-bg)",
        border: "var(--color-success-border)",
    },
    danger: {
        light: "var(--color-danger-light)",
        base: "var(--color-danger)",
        bg: "var(--color-danger-bg)",
        border: "var(--color-danger-border)",
    },
    warning: {
        light: "var(--color-warning-light)",
        base: "var(--color-warning)",
        bg: "var(--color-warning-bg)",
        border: "var(--color-warning-border)",
    },
    info: {
        light: "var(--color-info-light)",
        base: "var(--color-info)",
        bg: "var(--color-info-bg)",
        border: "var(--color-info-border)",
    },
    text: {
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        dim: "var(--text-dim)",
        onBrand: "var(--text-on-brand)",
    },
    bg: {
        base: "var(--bg-base)",
        surface: "var(--bg-surface)",
        card: "var(--bg-card)",
        cardHover: "var(--bg-card-hover)",
        elevated: "var(--bg-elevated)",
        overlay: "var(--bg-overlay)",
    },
    border: {
        default: "var(--border)",
        subtle: "var(--border-subtle)",
        strong: "var(--border-strong)",
        glow: "var(--border-glow)",
    },
} as const;

// ─── Gradients ────────────────────────────────────────────────────────────────

export const gradients = {
    brand: "var(--gradient-brand)",
    brandH: "var(--gradient-brand-h)",
    success: "var(--gradient-success)",
    danger: "var(--gradient-danger)",
    card: "var(--gradient-card)",
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const shadows = {
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)",
    xl: "var(--shadow-xl)",
    brand: "var(--shadow-brand)",
    teal: "var(--shadow-teal)",
    card: "var(--shadow-card)",
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const space = {
    1: "var(--space-1)",
    2: "var(--space-2)",
    3: "var(--space-3)",
    4: "var(--space-4)",
    5: "var(--space-5)",
    6: "var(--space-6)",
    8: "var(--space-8)",
    10: "var(--space-10)",
    12: "var(--space-12)",
} as const;

// ─── Radii ───────────────────────────────────────────────────────────────────

export const radii = {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    "2xl": "var(--radius-2xl)",
    full: "var(--radius-full)",
} as const;

// ─── Typography ──────────────────────────────────────────────────────────────

export const text = {
    xs: "var(--text-xs)",
    sm: "var(--text-sm)",
    base: "var(--text-base)",
    lg: "var(--text-lg)",
    xl: "var(--text-xl)",
    "2xl": "var(--text-2xl)",
    "3xl": "var(--text-3xl)",
    "4xl": "var(--text-4xl)",
} as const;

export const fonts = {
    display: "var(--font-display)",
    body: "var(--font-body)",
    mono: "var(--font-mono)",
} as const;

// ─── Transitions ─────────────────────────────────────────────────────────────

export const transitions = {
    fast: "var(--transition-fast)",
    base: "var(--transition-base)",
    slow: "var(--transition-slow)",
    spring: "var(--transition-spring)",
} as const;

// ─── Semantic token helpers ──────────────────────────────────────────────────

export function transactionColorTokens(type: "INCOME" | "EXPENSE") {
    const isIncome = type === "INCOME";
    return {
        color: isIncome ? colors.success.light : colors.danger.light,
        bg: isIncome ? colors.success.bg : colors.danger.bg,
        border: isIncome ? colors.success.border : colors.danger.border,
    } as const;
}

export interface IconTokens {
    bg: string;
    border: string;
    color: string;
}

export const iconTokens = {
    brand: {
        bg: colors.brand.glow,
        border: colors.border.glow,
        color: colors.brand.light,
    } satisfies IconTokens,
    teal: {
        bg: colors.teal.glow,
        border: "rgba(20,184,166,.25)",
        color: colors.teal.light,
    } satisfies IconTokens,
    success: {
        bg: colors.success.bg,
        border: colors.success.border,
        color: colors.success.light,
    } satisfies IconTokens,
    danger: {
        bg: colors.danger.bg,
        border: colors.danger.border,
        color: colors.danger.light,
    } satisfies IconTokens,
    warning: {
        bg: colors.warning.bg,
        border: colors.warning.border,
        color: colors.warning.light,
    } satisfies IconTokens,
} as const;
