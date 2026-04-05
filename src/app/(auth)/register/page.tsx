"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

/* ─── Icons ──────────────────────────────────────────────── */
function IconUser() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}
function IconMail() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    );
}
function IconLock() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}
function IconEye({ open }: { open: boolean }) {
    return open ? (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    ) : (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}
function IconCheck() {
    return (
        <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
function IconAlert() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
}
function IconSpinner() {
    return (
        <svg
            className="animate-spin"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}
function GoogleLogo() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
        </svg>
    );
}
function LogoMark({ size = 40 }: { size?: number }) {
    return (
        <div
            className="animate-pulse-glow"
            style={{
                width: size,
                height: size,
                borderRadius: "var(--radius-lg)",
                background: "var(--gradient-brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}
        >
            <svg
                width={size * 0.45}
                height={size * 0.45}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        </div>
    );
}

/* ─── Input wrapper ─────────────────────────────────────── */
function InputField({
    label,
    id,
    icon,
    right,
    ...props
}: {
    label: string;
    id: string;
    icon: React.ReactNode;
    right?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            <label
                htmlFor={id}
                style={{
                    display: "block",
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    marginBottom: "var(--space-2)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                }}
            >
                {label}
            </label>
            <div style={{ position: "relative" }}>
                <span
                    aria-hidden
                    style={{
                        position: "absolute",
                        left: "13px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        pointerEvents: "none",
                    }}
                >
                    {icon}
                </span>
                <input
                    id={id}
                    style={{
                        paddingLeft: "40px",
                        paddingRight: right ? "42px" : "14px",
                        paddingTop: "11px",
                        paddingBottom: "11px",
                        width: "100%",
                    }}
                    {...props}
                />
                {right && (
                    <span
                        style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {right}
                    </span>
                )}
            </div>
        </div>
    );
}

/* ─── Password strength ─────────────────────────────────── */
function PasswordStrength({ password }: { password: string }) {
    const checks = [
        { label: "Mín. 6 caracteres", ok: password.length >= 6 },
        { label: "Maiúscula", ok: /[A-Z]/.test(password) },
        { label: "Número", ok: /\d/.test(password) },
    ];
    const score = checks.filter((c) => c.ok).length;
    const colors = [
        "var(--color-danger-light)",
        "var(--color-warning-light)",
        "var(--color-success-light)",
    ];
    const labels = ["Fraca", "Média", "Forte"];

    if (!password) return null;

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
                                i < score ? colors[score - 1] : "var(--border)",
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
                            score > 0 ? colors[score - 1] : "var(--text-muted)",
                        fontWeight: 500,
                    }}
                >
                    {labels[score - 1] ?? "—"}
                </span>
                <div style={{ display: "flex", gap: "var(--space-3)" }}>
                    {checks.map((c) => (
                        <span
                            key={c.label}
                            style={{
                                fontSize: "var(--text-xs)",
                                color: c.ok
                                    ? "var(--color-success-light)"
                                    : "var(--text-muted)",
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                                transition: "color 0.2s",
                            }}
                        >
                            {c.ok && <IconCheck />}
                            {c.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Erro ao criar conta.");
            setLoading(false);
            return;
        }

        await signIn("credentials", { email, password, redirect: false });
        router.push("/dashboard");
    }

    return (
        /* Mesmo padrão do login: dois painéis, centralizados, max-width */
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "3.5rem",
                width: "100%",
                maxWidth: "960px",
                margin: "0 auto",
            }}
        >
            {/* Media query para ocultar aside em mobile */}
            <style>{`
                @media (max-width: 1023px) { .register-aside { display: none !important; } }
                @media (min-width: 1024px) { .register-mobile-logo { display: none !important; } }
            `}</style>

            {/* ── LEFT — brand / features (desktop only) ── */}
            <div
                className="register-aside animate-fade-in"
                style={{
                    flex: "0 0 360px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                }}
            >
                {/* Brand */}
                <div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <LogoMark size={42} />
                        <span
                            className="font-display"
                            style={{
                                fontSize: "var(--text-xl)",
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                letterSpacing: "-0.03em",
                            }}
                        >
                            Finance
                            <span style={{ color: "var(--accent-teal-light)" }}>
                                AI
                            </span>
                        </span>
                    </div>
                    <h2
                        className="font-display"
                        style={{
                            fontSize: "clamp(26px, 2.8vw, 36px)",
                            fontWeight: 800,
                            lineHeight: 1.18,
                            color: "var(--text-primary)",
                            letterSpacing: "-0.03em",
                            marginBottom: "1rem",
                        }}
                    >
                        Comece a cuidar
                        <br />
                        <span
                            style={{
                                background: "var(--gradient-brand-h)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            do seu dinheiro
                        </span>
                    </h2>
                    <p
                        style={{
                            fontSize: "var(--text-base)",
                            color: "var(--text-secondary)",
                            lineHeight: 1.7,
                        }}
                    >
                        Crie sua conta gratuita e tenha acesso imediato a todos
                        os recursos de análise financeira com IA.
                    </p>
                </div>

                {/* Feature list */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                    }}
                >
                    {[
                        {
                            label: "Dashboard com visão mensal completa",
                            cls: "delay-75",
                        },
                        {
                            label: "Importação via JSON, Excel e PDF",
                            cls: "delay-150",
                        },
                        {
                            label: "Análise e chat financeiro com Gemini AI",
                            cls: "delay-225",
                        },
                        {
                            label: "Relatórios interativos e gráficos",
                            cls: "delay-300",
                        },
                    ].map((f) => (
                        <div
                            key={f.label}
                            className={`animate-fade-in ${f.cls}`}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                            }}
                        >
                            <span
                                style={{
                                    width: "22px",
                                    height: "22px",
                                    borderRadius: "var(--radius-full)",
                                    background: "var(--color-success-bg)",
                                    border: "1px solid var(--color-success-border)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "var(--color-success-light)",
                                    flexShrink: 0,
                                    fontSize: "11px",
                                    fontWeight: 700,
                                }}
                            >
                                ✓
                            </span>
                            <span
                                style={{
                                    fontSize: "var(--text-sm)",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                {f.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Free badge */}
                <div
                    className="animate-fade-in delay-300 card-glass"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 1rem",
                        borderColor: "var(--color-success-border)",
                        background: "var(--color-success-bg)",
                    }}
                >
                    <span style={{ fontSize: "20px" }}>🎉</span>
                    <div>
                        <p
                            className="font-display"
                            style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: 700,
                                color: "var(--color-success-light)",
                            }}
                        >
                            100% Gratuito
                        </p>
                        <p
                            style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--text-muted)",
                            }}
                        >
                            Sem cartão de crédito. Sem compromisso.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── RIGHT — card ── */}
            <div
                className="animate-fade-in-scale"
                style={{ width: "100%", maxWidth: "420px" }}
            >
                <div
                    className="card-glass"
                    style={{
                        overflow: "hidden",
                        boxShadow:
                            "var(--shadow-xl), 0 0 0 1px var(--border-glow)",
                    }}
                >
                    {/* Top accent — verde para diferenciar do login */}
                    <div
                        style={{
                            height: "3px",
                            background: "var(--gradient-success)",
                        }}
                    />

                    <div style={{ padding: "2rem" }}>
                        {/* Mobile logo */}
                        <div
                            className="register-mobile-logo"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                marginBottom: "1.75rem",
                            }}
                        >
                            <LogoMark size={34} />
                            <span
                                className="font-display"
                                style={{
                                    fontSize: "var(--text-lg)",
                                    fontWeight: 700,
                                    color: "var(--text-primary)",
                                }}
                            >
                                Finance
                                <span
                                    style={{
                                        color: "var(--accent-teal-light)",
                                    }}
                                >
                                    AI
                                </span>
                            </span>
                        </div>

                        {/* Heading */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <h1
                                className="font-display"
                                style={{
                                    fontSize: "var(--text-2xl)",
                                    fontWeight: 700,
                                    color: "var(--text-primary)",
                                    letterSpacing: "-0.025em",
                                    marginBottom: "var(--space-1)",
                                }}
                            >
                                Criar conta grátis
                            </h1>
                            <p
                                style={{
                                    fontSize: "var(--text-sm)",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                Leva menos de 1 minuto
                            </p>
                        </div>

                        {/* Tabs */}
                        <div
                            style={{
                                display: "flex",
                                background: "var(--bg-surface)",
                                border: "1px solid var(--border-subtle)",
                                borderRadius: "var(--radius-lg)",
                                padding: "var(--space-1)",
                                marginBottom: "1.5rem",
                            }}
                        >
                            <Link
                                href="/login"
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                    padding: "var(--space-2) 0",
                                    fontSize: "var(--text-sm)",
                                    fontWeight: 500,
                                    color: "var(--text-muted)",
                                    borderRadius: "var(--radius-md)",
                                    textDecoration: "none",
                                    transition: "color var(--transition-base)",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--text-secondary)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--text-muted)")
                                }
                            >
                                Entrar
                            </Link>
                            <span
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                    padding: "var(--space-2) 0",
                                    fontSize: "var(--text-sm)",
                                    fontWeight: 600,
                                    borderRadius: "var(--radius-md)",
                                    background: "var(--gradient-success)",
                                    color: "var(--text-on-brand)",
                                    boxShadow: "var(--shadow-teal)",
                                    userSelect: "none",
                                    cursor: "default",
                                }}
                            >
                                Criar conta
                            </span>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1.125rem",
                            }}
                        >
                            <InputField
                                label="Nome completo"
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Seu nome"
                                autoComplete="name"
                                required
                                icon={<IconUser />}
                            />

                            <InputField
                                label="E-mail"
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                autoComplete="email"
                                required
                                icon={<IconMail />}
                            />

                            <div>
                                <InputField
                                    label="Senha"
                                    id="password"
                                    type={showPw ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Mínimo 6 caracteres"
                                    autoComplete="new-password"
                                    minLength={6}
                                    required
                                    icon={<IconLock />}
                                    right={
                                        <button
                                            type="button"
                                            onClick={() => setShowPw((v) => !v)}
                                            aria-label={
                                                showPw
                                                    ? "Ocultar senha"
                                                    : "Mostrar senha"
                                            }
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                color: "var(--text-muted)",
                                                display: "flex",
                                                alignItems: "center",
                                                padding: 0,
                                                transition:
                                                    "color var(--transition-base)",
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.color =
                                                    "var(--text-secondary)")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.color =
                                                    "var(--text-muted)")
                                            }
                                        >
                                            <IconEye open={showPw} />
                                        </button>
                                    }
                                />
                                <PasswordStrength password={password} />
                            </div>

                            {/* Error */}
                            {error && (
                                <div
                                    className="animate-fade-in"
                                    style={{
                                        background: "var(--color-danger-bg)",
                                        border: "1px solid var(--color-danger-border)",
                                        borderRadius: "var(--radius-md)",
                                        padding: "10px 13px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--space-2)",
                                        color: "var(--color-danger-light)",
                                        fontSize: "var(--text-sm)",
                                    }}
                                >
                                    <IconAlert />
                                    {error}
                                </div>
                            )}

                            {/* Terms */}
                            <p
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: "var(--text-muted)",
                                    lineHeight: 1.6,
                                }}
                            >
                                Ao criar sua conta você concorda com os{" "}
                                <span
                                    style={{
                                        color: "var(--accent-brand-light)",
                                        cursor: "pointer",
                                    }}
                                >
                                    Termos de Uso
                                </span>{" "}
                                e a{" "}
                                <span
                                    style={{
                                        color: "var(--accent-brand-light)",
                                        cursor: "pointer",
                                    }}
                                >
                                    Política de Privacidade
                                </span>
                                .
                            </p>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                    padding: "12px var(--space-5)",
                                    fontSize: "var(--text-sm)",
                                    borderRadius: "var(--radius-md)",
                                    background: loading
                                        ? undefined
                                        : "var(--gradient-success)",
                                    boxShadow: loading
                                        ? "none"
                                        : "var(--shadow-teal)",
                                    marginTop: "var(--space-1)",
                                }}
                            >
                                {loading ? (
                                    <>
                                        <IconSpinner /> Criando conta…
                                    </>
                                ) : (
                                    <>Criar conta grátis</>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-3)",
                                margin: "1.5rem 0",
                            }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    height: "1px",
                                    background: "var(--border-subtle)",
                                }}
                            />
                            <span
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: "var(--text-dim)",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                ou continue com
                            </span>
                            <div
                                style={{
                                    flex: 1,
                                    height: "1px",
                                    background: "var(--border-subtle)",
                                }}
                            />
                        </div>

                        {/* Google */}
                        <button
                            type="button"
                            onClick={() =>
                                signIn("google", { callbackUrl: "/dashboard" })
                            }
                            className="btn-ghost"
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.75rem",
                                padding: "11px var(--space-5)",
                                fontSize: "var(--text-sm)",
                                borderRadius: "var(--radius-md)",
                            }}
                        >
                            <GoogleLogo />
                            Continuar com Google
                        </button>

                        {/* Footer */}
                        <p
                            style={{
                                textAlign: "center",
                                marginTop: "1.5rem",
                                fontSize: "var(--text-xs)",
                                color: "var(--text-muted)",
                            }}
                        >
                            Já tem uma conta?{" "}
                            <Link
                                href="/login"
                                style={{
                                    color: "var(--accent-brand-light)",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.opacity = "0.75")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.opacity = "1")
                                }
                            >
                                Entrar →
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
