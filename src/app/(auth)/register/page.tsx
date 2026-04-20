"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

import LogoMark from "@/components/auth/LogoMark";
import AuthTabs from "@/components/auth/AuthTabs";
import PasswordStrength from "@/components/auth/PasswordStrength";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import InputField from "@/components/ui/InputField";
import AlertBanner from "@/components/ui/AlertBanner";
import Divider from "@/components/ui/Divider";
import {
    IconUser,
    IconMail,
    IconLock,
    IconEye,
    IconSpinner,
} from "@/components/icons";

const FEATURES = [
    { label: "Dashboard com visão mensal completa", cls: "delay-75" },
    { label: "Importação via JSON, Excel e PDF", cls: "delay-150" },
    { label: "Análise e chat financeiro com Gemini AI", cls: "delay-225" },
    { label: "Relatórios interativos e gráficos", cls: "delay-300" },
];

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
        @media (max-width: 1023px) { .register-aside        { display: none !important; } }
        @media (min-width: 1024px) { .register-mobile-logo  { display: none !important; } }
      `}</style>

            <div
                className="register-aside animate-fade-in"
                style={{
                    flex: "0 0 360px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                }}
            >
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

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                    }}
                >
                    {FEATURES.map((f) => (
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
                    <div
                        style={{
                            height: "3px",
                            background: "var(--gradient-success)",
                        }}
                    />

                    <div style={{ padding: "2rem" }}>
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

                        <AuthTabs active="register" />

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

                            {error && <AlertBanner message={error} />}

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
                                    "Criar conta grátis"
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
