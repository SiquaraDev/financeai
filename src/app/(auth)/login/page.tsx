"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ─── Icons ──────────────────────────────────────────────── */
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
function IconArrow() {
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
        >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
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

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        if (res?.error) {
            setError("E-mail ou senha inválidos.");
            setLoading(false);
        } else {
            router.push("/dashboard");
        }
    }

    return (
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
            {/* Media queries — mesmo padrão do register */}
            <style>{`
                @media (max-width: 1023px) { .login-aside        { display: none !important; } }
                @media (min-width: 1024px) { .login-mobile-logo  { display: none !important; } }
            `}</style>

            {/* ── LEFT — brand / stats (desktop only) ── */}
            <div
                className="login-aside animate-fade-in"
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
                        Controle total das
                        <br />
                        <span
                            style={{
                                background: "var(--gradient-brand-h)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            suas finanças
                        </span>
                    </h2>
                    <p
                        style={{
                            fontSize: "var(--text-base)",
                            color: "var(--text-secondary)",
                            lineHeight: 1.7,
                        }}
                    >
                        Análise inteligente, relatórios em tempo real e insights
                        personalizados com Gemini AI.
                    </p>
                </div>

                {/* Stat cards */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.625rem",
                    }}
                >
                    {[
                        {
                            icon: "↗",
                            label: "Economia média mensal",
                            value: "+23%",
                            col: "var(--color-success-light)",
                            bg: "var(--color-success-bg)",
                            border: "var(--color-success-border)",
                            cls: "delay-75",
                        },
                        {
                            icon: "◈",
                            label: "Categorias monitoradas",
                            value: "10+",
                            col: "var(--accent-brand-light)",
                            bg: "var(--accent-brand-glow)",
                            border: "var(--border-glow)",
                            cls: "delay-150",
                        },
                        {
                            icon: "✦",
                            label: "Análises com IA / mês",
                            value: "Ilimitadas",
                            col: "var(--accent-teal-light)",
                            bg: "var(--accent-teal-glow)",
                            border: "rgba(20,184,166,0.22)",
                            cls: "delay-225",
                        },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className={`animate-fade-in ${s.cls} card-glass`}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                padding: "0.75rem 1rem",
                                background: s.bg,
                                borderColor: s.border,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "18px",
                                    color: s.col,
                                    minWidth: "20px",
                                    textAlign: "center",
                                }}
                            >
                                {s.icon}
                            </span>
                            <div>
                                <p
                                    style={{
                                        fontSize: "var(--text-xs)",
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.06em",
                                        marginBottom: "2px",
                                    }}
                                >
                                    {s.label}
                                </p>
                                <p
                                    className="font-display"
                                    style={{
                                        fontSize: "var(--text-lg)",
                                        fontWeight: 700,
                                        color: s.col,
                                    }}
                                >
                                    {s.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Security note */}
                <p
                    className="animate-fade-in delay-300"
                    style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--text-dim)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}
                >
                    <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                    >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Dados protegidos com criptografia ponta a ponta
                </p>
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
                    {/* Top accent */}
                    <div className="accent-bar-brand" />

                    <div style={{ padding: "2rem" }}>
                        {/* Mobile logo */}
                        <div
                            className="login-mobile-logo"
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
                                Bem-vindo de volta
                            </h1>
                            <p
                                style={{
                                    fontSize: "var(--text-sm)",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                Acesse sua conta para continuar
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
                            <span
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                    padding: "var(--space-2) 0",
                                    fontSize: "var(--text-sm)",
                                    fontWeight: 600,
                                    borderRadius: "var(--radius-md)",
                                    background: "var(--gradient-brand)",
                                    color: "var(--text-on-brand)",
                                    boxShadow: "var(--shadow-brand)",
                                    userSelect: "none",
                                    cursor: "default",
                                }}
                            >
                                Entrar
                            </span>
                            <Link
                                href="/register"
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
                                Criar conta
                            </Link>
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
                                    placeholder="••••••••"
                                    autoComplete="current-password"
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
                                <div
                                    style={{
                                        textAlign: "right",
                                        marginTop: "var(--space-2)",
                                    }}
                                >
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        style={{
                                            fontSize: "var(--text-xs)",
                                            color: "var(--accent-brand-light)",
                                            cursor: "pointer",
                                            transition:
                                                "opacity var(--transition-base)",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.opacity =
                                                "0.7")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.opacity =
                                                "1")
                                        }
                                    >
                                        Esqueci a senha
                                    </span>
                                </div>
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
                                    marginTop: "var(--space-1)",
                                }}
                            >
                                {loading ? (
                                    <>
                                        <IconSpinner /> Entrando…
                                    </>
                                ) : (
                                    <>
                                        Entrar na conta <IconArrow />
                                    </>
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
                            Não tem uma conta?{" "}
                            <Link
                                href="/register"
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
                                Criar conta grátis →
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
