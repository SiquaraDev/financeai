"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import LogoMark from "@/components/auth/LogoMark";
import AuthTabs from "@/components/auth/AuthTabs";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import InputField from "@/components/ui/InputField";
import AlertBanner from "@/components/ui/AlertBanner";
import Divider from "@/components/ui/Divider";
import {
    IconMail,
    IconLock,
    IconEye,
    IconArrow,
    IconSpinner,
    IconShield,
} from "@/components/icons";

const STATS = [
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
];

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
            <style>{`
        @media (max-width: 1023px) { .login-aside       { display: none !important; } }
        @media (min-width: 1024px) { .login-mobile-logo { display: none !important; } }
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
                {/* Logo + tagline */}
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

                {/* Stats */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.625rem",
                    }}
                >
                    {STATS.map((s) => (
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

                {/* Segurança */}
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
                    <IconShield />
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

                        <AuthTabs active="login" />

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

                            {error && <AlertBanner message={error} />}

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

                        <Divider />
                        <GoogleSignInButton />

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
