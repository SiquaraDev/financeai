import { IconCheck } from "@/components/icons";

interface PasswordStrengthProps {
    password: string;
}

const CHECKS = [
    { label: "Mín. 6 caracteres", test: (p: string) => p.length >= 6 },
    { label: "Maiúscula", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Número", test: (p: string) => /\d/.test(p) },
];

const STRENGTH_COLORS = [
    "var(--color-danger-light)",
    "var(--color-warning-light)",
    "var(--color-success-light)",
];

const STRENGTH_LABELS = ["Fraca", "Média", "Forte"];

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    if (!password) return null;

    const score = CHECKS.filter((c) => c.test(password)).length;

    return (
        <div
            className="animate-fade-in"
            style={{ marginTop: "var(--space-2)" }}
        >
            <div
                style={{
                    display: "flex",
                    gap: "4px",
                    marginBottom: "var(--space-2)",
                }}
            >
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: "3px",
                            borderRadius: "var(--radius-full)",
                            background:
                                i < score
                                    ? STRENGTH_COLORS[score - 1]
                                    : "var(--border)",
                            transition: "background 0.3s ease",
                        }}
                    />
                ))}
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "var(--space-2)",
                    flexWrap: "wrap",
                }}
            >
                <span
                    style={{
                        fontSize: "var(--text-xs)",
                        color:
                            score > 0
                                ? STRENGTH_COLORS[score - 1]
                                : "var(--text-muted)",
                        fontWeight: 500,
                    }}
                >
                    {STRENGTH_LABELS[score - 1] ?? "—"}
                </span>
                <div style={{ display: "flex", gap: "var(--space-3)" }}>
                    {CHECKS.map((c) => {
                        const ok = c.test(password);
                        return (
                            <span
                                key={c.label}
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: ok
                                        ? "var(--color-success-light)"
                                        : "var(--text-muted)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "3px",
                                    transition: "color 0.2s",
                                }}
                            >
                                {ok && <IconCheck />}
                                {c.label}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
