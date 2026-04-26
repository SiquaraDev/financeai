"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    AuthAside,
    AuthCard,
    StatHighlight,
    AuthTabs,
    GoogleSignInButton,
} from "@/components/auth";
import type { StatHighlightProps } from "@/components/auth";
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

const STATS: StatHighlightProps[] = [
    {
        icon: "↗",
        label: "Economia média mensal",
        value: "+23%",
        color: "var(--color-success-light)",
        background: "var(--color-success-bg)",
        borderColor: "var(--color-success-border)",
        className: "delay-75",
    },
    {
        icon: "◈",
        label: "Categorias monitoradas",
        value: "10+",
        color: "var(--accent-brand-light)",
        background: "var(--accent-brand-glow)",
        borderColor: "var(--border-glow)",
        className: "delay-150",
    },
    {
        icon: "✦",
        label: "Análises com IA / mês",
        value: "Ilimitadas",
        color: "var(--accent-teal-light)",
        background: "var(--accent-teal-glow)",
        borderColor: "rgba(20,184,166,0.22)",
        className: "delay-225",
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

            <AuthAside
                className="login-aside"
                headline={
                    <>
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
                    </>
                }
                description="Análise inteligente, relatórios em tempo real e insights personalizados com Gemini AI."
                footer={
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
                        <IconShield /> Dados protegidos com criptografia ponta a
                        ponta
                    </p>
                }
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.625rem",
                    }}
                >
                    {STATS.map((stat) => (
                        <StatHighlight key={stat.label} {...stat} />
                    ))}
                </div>
            </AuthAside>

            <AuthCard
                accentGradient="var(--gradient-brand-h)"
                title="Bem-vindo de volta"
                subtitle="Acesse sua conta para continuar"
                mobileLogoClass="login-mobile-logo"
            >
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
                            onChange={(e) => setPassword(e.target.value)}
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
                                    }}
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
                                }}
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
                    >
                        Criar conta grátis →
                    </Link>
                </p>
            </AuthCard>
        </div>
    );
}
