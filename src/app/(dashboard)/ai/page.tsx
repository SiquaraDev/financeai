"use client";

import { useState, useRef, useEffect } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface AnalysisResult {
    summary: string;
    tips: string[];
}

type Shortcut = "last_month" | "3_months" | "6_months" | "year";

const shortcuts: { value: Shortcut; label: string }[] = [
    { value: "last_month", label: "Último mês" },
    { value: "3_months", label: "3 meses" },
    { value: "6_months", label: "6 meses" },
    { value: "year", label: "Ano" },
];

function applyShortcut(shortcut: Shortcut) {
    const now = new Date();
    switch (shortcut) {
        case "last_month":
            return {
                start: format(startOfMonth(subMonths(now, 1)), "yyyy-MM-dd"),
                end: format(endOfMonth(subMonths(now, 1)), "yyyy-MM-dd"),
            };
        case "3_months":
            return {
                start: format(startOfMonth(subMonths(now, 2)), "yyyy-MM-dd"),
                end: format(endOfMonth(now), "yyyy-MM-dd"),
            };
        case "6_months":
            return {
                start: format(startOfMonth(subMonths(now, 5)), "yyyy-MM-dd"),
                end: format(endOfMonth(now), "yyyy-MM-dd"),
            };
        case "year":
            return {
                start: format(startOfMonth(subMonths(now, 11)), "yyyy-MM-dd"),
                end: format(endOfMonth(now), "yyyy-MM-dd"),
            };
    }
}

/* ── Ícone Gemini/IA ── */
function GeminiIcon({ size = 18 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="M12 8v4l3 3" />
            <circle cx="19" cy="5" r="3" />
        </svg>
    );
}

/* ── Typing indicator ── */
function TypingDots() {
    return (
        <div
            style={{
                display: "flex",
                gap: "4px",
                alignItems: "center",
                padding: "2px 0",
            }}
        >
            {[0, 150, 300].map((delay) => (
                <span
                    key={delay}
                    style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--accent-teal-light)",
                        display: "inline-block",
                        animation: "bounce-dot 1.2s ease-in-out infinite",
                        animationDelay: `${delay}ms`,
                    }}
                />
            ))}
        </div>
    );
}

export default function AiPage() {
    const [startDate, setStartDate] = useState(
        format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"),
    );
    const [endDate, setEndDate] = useState(
        format(endOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"),
    );
    const [activeShortcut, setActiveShortcut] =
        useState<Shortcut>("last_month");
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, chatLoading]);

    const handleShortcut = (shortcut: Shortcut) => {
        const { start, end } = applyShortcut(shortcut);
        setStartDate(start);
        setEndDate(end);
        setActiveShortcut(shortcut);
    };

    const handleAnalyze = async () => {
        setAnalyzing(true);
        setMessages([]);
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "analyze", startDate, endDate }),
            });
            const data = await res.json();
            setAnalysis(data);
            setMessages([
                {
                    role: "assistant",
                    content: `Análise concluída! ${data.summary.split(".")[0]}. Pode me fazer perguntas sobre seus dados financeiros.`,
                },
            ]);
        } catch {
            setAnalysis(null);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleChat = async () => {
        if (!input.trim() || !analysis) return;
        const userMsg = input.trim();
        setInput("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setChatLoading(true);

        const historyToSend = messages.slice(1).map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: m.content,
        }));

        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "chat",
                    message: userMsg,
                    analysisContext: analysis.summary,
                    history: historyToSend,
                }),
            });
            const data = await res.json();
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.response },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Erro ao conectar com o Gemini. Tente novamente.",
                },
            ]);
        } finally {
            setChatLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    };

    const handleTextareaChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setInput(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    };

    return (
        <div
            style={{
                padding: "clamp(.75rem, 4vw, 2rem)",
                width: "100%",
                maxWidth: "1400px",
                margin: "0 auto",
                boxSizing: "border-box",
                height: "100%",
            }}
        >
            <style>{`
        .ai-layout {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: clamp(.5rem, 2vw, 1rem);
          height: calc(100dvh - 120px);
          min-height: 500px;
        }
        .ai-left {
          display: flex;
          flex-direction: column;
          gap: clamp(.5rem, 2vw, 1rem);
          overflow-y: auto;
          min-width: 0;
        }
        .ai-chat {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .ai-messages {
          flex: 1;
          overflow-y: auto;
          padding: clamp(.75rem, 2vw, 1.25rem);
          display: flex;
          flex-direction: column;
          gap: .75rem;
          scroll-behavior: smooth;
        }
        .ai-input-row {
          display: flex;
          gap: var(--space-2);
          align-items: flex-end;
        }
        .ai-textarea {
          flex: 1;
          resize: none;
          min-height: 42px;
          max-height: 120px;
          line-height: 1.5;
          overflow-y: auto;
          padding: 10px 14px !important;
        }
        .tips-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        @media (max-width: 900px) {
          .ai-layout {
            grid-template-columns: 1fr;
            height: auto;
            min-height: unset;
          }
          .ai-chat {
            height: 520px;
          }
        }
        @media (max-width: 480px) {
          .ai-chat {
            height: 460px;
          }
        }
        @media (max-width: 360px) {
          .ai-chat {
            height: 400px;
          }
        }
      `}</style>

            {/* Header */}
            <div
                className="animate-fade-in"
                style={{ marginBottom: "clamp(.75rem, 3vw, 1.5rem)" }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: ".625rem",
                        marginBottom: "var(--space-1)",
                    }}
                >
                    <div
                        className="animate-pulse-teal"
                        style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "var(--radius-md)",
                            background: "var(--accent-teal-glow)",
                            border: "1px solid rgba(20,184,166,.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--accent-teal-light)",
                            flexShrink: 0,
                        }}
                    >
                        <GeminiIcon size={16} />
                    </div>
                    <h1
                        className="font-display"
                        style={{
                            fontSize: "clamp(18px, 5vw, 30px)",
                            fontWeight: 800,
                            color: "var(--text-primary)",
                            letterSpacing: "-0.03em",
                            lineHeight: 1.2,
                        }}
                    >
                        IA Gemini
                    </h1>
                </div>
                <p
                    style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--text-secondary)",
                    }}
                >
                    Análise financeira inteligente com Gemini 3 Flash
                </p>
            </div>

            <div className="ai-layout">
                {/* ── COLUNA ESQUERDA ── */}
                <div className="ai-left">
                    {/* Card: Nova análise */}
                    <div
                        className="card-glass animate-fade-in delay-75"
                        style={{
                            padding: "clamp(.875rem, 3vw, 1.25rem)",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                height: "3px",
                                background: "var(--gradient-brand-h)",
                                margin: "-clamp(.875rem, 3vw, 1.25rem) -clamp(.875rem, 3vw, 1.25rem) clamp(.875rem, 3vw, 1.25rem)",
                            }}
                        />

                        {/* Título */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: ".625rem",
                                marginBottom: "1.125rem",
                            }}
                        >
                            <span
                                style={{
                                    width: "26px",
                                    height: "26px",
                                    flexShrink: 0,
                                    borderRadius: "var(--radius-md)",
                                    background: "var(--accent-brand-glow)",
                                    border: "1px solid var(--border-glow)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "var(--accent-brand-light)",
                                }}
                            >
                                <GeminiIcon size={12} />
                            </span>
                            <h2
                                className="font-display"
                                style={{
                                    fontSize: "var(--text-sm)",
                                    fontWeight: 700,
                                    color: "var(--text-primary)",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                Nova análise
                            </h2>
                        </div>

                        {/* Período label */}
                        <p
                            style={{
                                fontSize: "var(--text-xs)",
                                fontWeight: 600,
                                color: "var(--text-muted)",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                marginBottom: "var(--space-2)",
                            }}
                        >
                            Período
                        </p>

                        {/* Datas */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "var(--space-2)",
                                marginBottom: "var(--space-3)",
                            }}
                        >
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: "var(--text-xs)",
                                        color: "var(--text-muted)",
                                        marginBottom: "var(--space-1)",
                                    }}
                                >
                                    De
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "8px 10px",
                                        fontSize: "var(--text-xs)",
                                    }}
                                />
                            </div>
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: "var(--text-xs)",
                                        color: "var(--text-muted)",
                                        marginBottom: "var(--space-1)",
                                    }}
                                >
                                    Até
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "8px 10px",
                                        fontSize: "var(--text-xs)",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Atalhos */}
                        <p
                            style={{
                                fontSize: "var(--text-xs)",
                                fontWeight: 600,
                                color: "var(--text-muted)",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                marginBottom: "var(--space-2)",
                            }}
                        >
                            Atalhos
                        </p>
                        <div
                            style={{
                                display: "flex",
                                gap: "var(--space-1)",
                                flexWrap: "wrap",
                                marginBottom: "1.125rem",
                            }}
                        >
                            {shortcuts.map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => handleShortcut(value)}
                                    style={{
                                        padding: "5px 10px",
                                        borderRadius: "var(--radius-full)",
                                        fontSize: "var(--text-xs)",
                                        fontWeight:
                                            activeShortcut === value
                                                ? 600
                                                : 500,
                                        fontFamily: "var(--font-body)",
                                        cursor: "pointer",
                                        transition:
                                            "all var(--transition-base)",
                                        border:
                                            activeShortcut === value
                                                ? "none"
                                                : "1px solid var(--border)",
                                        background:
                                            activeShortcut === value
                                                ? "var(--accent-teal-glow)"
                                                : "transparent",
                                        color:
                                            activeShortcut === value
                                                ? "var(--accent-teal-light)"
                                                : "var(--text-muted)",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Botão analisar */}
                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="btn-primary"
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "var(--space-2)",
                                padding: "11px var(--space-5)",
                                fontSize: "var(--text-sm)",
                                borderRadius: "var(--radius-md)",
                            }}
                        >
                            {analyzing ? (
                                <>
                                    <svg
                                        className="animate-spin"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                    >
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    Analisando…
                                </>
                            ) : (
                                <>
                                    <GeminiIcon size={14} />
                                    Analisar com Gemini
                                </>
                            )}
                        </button>
                    </div>

                    {/* Card: Resultado da análise */}
                    {analysis && (
                        <div
                            className="card-glass animate-fade-in"
                            style={{
                                padding: "clamp(.875rem, 3vw, 1.25rem)",
                                overflow: "hidden",
                            }}
                        >
                            {/* Accent verde */}
                            <div
                                style={{
                                    height: "3px",
                                    background: "var(--gradient-success)",
                                    margin: "-clamp(.875rem, 3vw, 1.25rem) -clamp(.875rem, 3vw, 1.25rem) clamp(.875rem, 3vw, 1.25rem)",
                                }}
                            />

                            {/* Título */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: ".5rem",
                                    marginBottom: ".875rem",
                                }}
                            >
                                <span
                                    style={{
                                        width: "26px",
                                        height: "26px",
                                        flexShrink: 0,
                                        borderRadius: "var(--radius-md)",
                                        background: "var(--color-success-bg)",
                                        border: "1px solid var(--color-success-border)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="var(--color-success-light)"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </span>
                                <h2
                                    className="font-display"
                                    style={{
                                        fontSize: "var(--text-sm)",
                                        fontWeight: 700,
                                        color: "var(--text-primary)",
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    Resumo do período
                                </h2>
                            </div>

                            {/* Resumo */}
                            <div
                                style={{
                                    background: "var(--accent-brand-glow)",
                                    border: "1px solid var(--border-glow)",
                                    borderRadius: "var(--radius-lg)",
                                    padding: "clamp(.625rem, 2vw, .875rem)",
                                    marginBottom: ".875rem",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "var(--text-xs)",
                                        color: "var(--text-secondary)",
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {analysis.summary}
                                </p>
                            </div>

                            {/* Dicas */}
                            <p
                                style={{
                                    fontSize: "var(--text-xs)",
                                    fontWeight: 600,
                                    color: "var(--text-muted)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    marginBottom: "var(--space-2)",
                                }}
                            >
                                Dicas personalizadas
                            </p>
                            <div className="tips-grid">
                                {analysis.tips.map((tip, i) => {
                                    const tipStyles = [
                                        {
                                            bg: "var(--color-success-bg)",
                                            border: "var(--color-success-border)",
                                            color: "var(--color-success-light)",
                                        },
                                        {
                                            bg: "var(--accent-brand-glow)",
                                            border: "var(--border-glow)",
                                            color: "var(--accent-brand-light)",
                                        },
                                        {
                                            bg: "var(--color-warning-bg)",
                                            border: "var(--color-warning-border)",
                                            color: "var(--color-warning-light)",
                                        },
                                        {
                                            bg: "var(--accent-teal-glow)",
                                            border: "rgba(20,184,166,.22)",
                                            color: "var(--accent-teal-light)",
                                        },
                                    ];
                                    const s = tipStyles[i % tipStyles.length];
                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                background: s.bg,
                                                border: `1px solid ${s.border}`,
                                                borderRadius:
                                                    "var(--radius-md)",
                                                padding: "8px 12px",
                                                display: "flex",
                                                gap: "var(--space-2)",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: s.color,
                                                    fontSize: "10px",
                                                    marginTop: "2px",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                ✦
                                            </span>
                                            <p
                                                style={{
                                                    fontSize: "var(--text-xs)",
                                                    color: "var(--text-secondary)",
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                {tip}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── COLUNA DIREITA — Chat ── */}
                <div
                    className="card-glass ai-chat animate-fade-in delay-150"
                    style={{ overflow: "hidden" }}
                >
                    {/* Header do chat */}
                    <div
                        style={{
                            padding:
                                "clamp(.75rem, 2vw, 1rem) clamp(.75rem, 2vw, 1.25rem)",
                            borderBottom: "1px solid var(--border-subtle)",
                            display: "flex",
                            alignItems: "center",
                            gap: ".625rem",
                            flexShrink: 0,
                        }}
                    >
                        <div
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "var(--radius-full)",
                                background: "var(--accent-teal-glow)",
                                border: "1px solid rgba(20,184,166,.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--accent-teal-light)",
                                flexShrink: 0,
                            }}
                        >
                            <GeminiIcon size={15} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <p
                                className="font-display"
                                style={{
                                    fontSize: "var(--text-sm)",
                                    fontWeight: 700,
                                    color: "var(--text-primary)",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                Tirar dúvidas
                            </p>
                            <p
                                style={{
                                    fontSize: "var(--text-xs)",
                                    color: "var(--text-muted)",
                                }}
                            >
                                {analysis
                                    ? "Faça perguntas sobre sua análise"
                                    : "Execute uma análise primeiro"}
                            </p>
                        </div>

                        {/* Status pill */}
                        <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    padding: "3px 10px",
                                    borderRadius: "var(--radius-full)",
                                    fontSize: "10px",
                                    fontWeight: 600,
                                    background: analysis
                                        ? "var(--color-success-bg)"
                                        : "var(--bg-elevated)",
                                    border: `1px solid ${analysis ? "var(--color-success-border)" : "var(--border-subtle)"}`,
                                    color: analysis
                                        ? "var(--color-success-light)"
                                        : "var(--text-muted)",
                                }}
                            >
                                <span
                                    style={{
                                        width: "5px",
                                        height: "5px",
                                        borderRadius: "50%",
                                        background: analysis
                                            ? "var(--color-success-light)"
                                            : "var(--text-dim)",
                                    }}
                                />
                                {analysis ? "Ativo" : "Aguardando"}
                            </span>
                        </div>
                    </div>

                    {/* Mensagens */}
                    <div className="ai-messages">
                        {messages.length === 0 && !analysis && (
                            <div
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "var(--space-3)",
                                    padding: "2rem",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    className="animate-pulse-teal"
                                    style={{
                                        width: "52px",
                                        height: "52px",
                                        borderRadius: "var(--radius-full)",
                                        background: "var(--accent-teal-glow)",
                                        border: "1px solid rgba(20,184,166,.25)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "var(--accent-teal-light)",
                                    }}
                                >
                                    <GeminiIcon size={22} />
                                </div>
                                <div>
                                    <p
                                        className="font-display"
                                        style={{
                                            fontSize: "var(--text-sm)",
                                            fontWeight: 600,
                                            color: "var(--text-secondary)",
                                            marginBottom: "var(--space-1)",
                                        }}
                                    >
                                        Execute uma análise para começar o chat
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "var(--text-xs)",
                                            color: "var(--text-muted)",
                                        }}
                                    >
                                        O Gemini vai analisar suas finanças e
                                        responder suas dúvidas
                                    </p>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className="animate-fade-in"
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        msg.role === "user"
                                            ? "flex-end"
                                            : "flex-start",
                                    gap: "var(--space-2)",
                                    alignItems: "flex-end",
                                }}
                            >
                                {/* Avatar IA */}
                                {msg.role === "assistant" && (
                                    <div
                                        style={{
                                            width: "26px",
                                            height: "26px",
                                            borderRadius: "var(--radius-full)",
                                            background:
                                                "var(--accent-teal-glow)",
                                            border: "1px solid rgba(20,184,166,.25)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "var(--accent-teal-light)",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <GeminiIcon size={12} />
                                    </div>
                                )}

                                {/* Balão */}
                                <div
                                    style={{
                                        maxWidth: "82%",
                                        padding: "10px 14px",
                                        borderRadius:
                                            msg.role === "user"
                                                ? "var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl)"
                                                : "var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)",
                                        background:
                                            msg.role === "user"
                                                ? "var(--gradient-brand)"
                                                : "var(--bg-elevated)",
                                        border:
                                            msg.role === "user"
                                                ? "none"
                                                : "1px solid var(--border-subtle)",
                                        boxShadow:
                                            msg.role === "user"
                                                ? "var(--shadow-brand)"
                                                : "var(--shadow-sm)",
                                        fontSize: "var(--text-sm)",
                                        color:
                                            msg.role === "user"
                                                ? "var(--text-on-brand)"
                                                : "var(--text-secondary)",
                                        lineHeight: 1.65,
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {msg.content}
                                </div>

                                {/* Avatar usuário */}
                                {msg.role === "user" && (
                                    <div
                                        style={{
                                            width: "26px",
                                            height: "26px",
                                            borderRadius: "var(--radius-full)",
                                            background: "var(--gradient-brand)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            fontSize: "10px",
                                            fontWeight: 700,
                                            color: "white",
                                            fontFamily: "var(--font-display)",
                                        }}
                                    >
                                        U
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {chatLoading && (
                            <div
                                className="animate-fade-in"
                                style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    gap: "var(--space-2)",
                                }}
                            >
                                <div
                                    style={{
                                        width: "26px",
                                        height: "26px",
                                        borderRadius: "var(--radius-full)",
                                        background: "var(--accent-teal-glow)",
                                        border: "1px solid rgba(20,184,166,.25)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "var(--accent-teal-light)",
                                        flexShrink: 0,
                                    }}
                                >
                                    <GeminiIcon size={12} />
                                </div>
                                <div
                                    style={{
                                        padding: "10px 14px",
                                        borderRadius:
                                            "var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)",
                                        background: "var(--bg-elevated)",
                                        border: "1px solid var(--border-subtle)",
                                    }}
                                >
                                    <TypingDots />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div
                        style={{
                            padding:
                                "clamp(.625rem, 2vw, 1rem) clamp(.75rem, 2vw, 1.25rem)",
                            borderTop: "1px solid var(--border-subtle)",
                            flexShrink: 0,
                        }}
                    >
                        <div className="ai-input-row">
                            <textarea
                                ref={textareaRef}
                                className="ai-textarea"
                                value={input}
                                onChange={handleTextareaChange}
                                onKeyDown={handleKeyDown}
                                placeholder={
                                    analysis
                                        ? "Pergunte algo sobre seus dados… (Enter para enviar)"
                                        : "Aguardando análise..."
                                }
                                disabled={!analysis || chatLoading}
                                rows={1}
                            />
                            <button
                                onClick={handleChat}
                                disabled={
                                    !input.trim() || !analysis || chatLoading
                                }
                                className="btn-primary"
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: "var(--radius-md)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    opacity:
                                        !input.trim() ||
                                        !analysis ||
                                        chatLoading
                                            ? 0.45
                                            : 1,
                                    minWidth: "44px",
                                }}
                            >
                                {chatLoading ? (
                                    <svg
                                        className="animate-spin"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                    >
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                ) : (
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
                                        <line x1="22" y1="2" x2="11" y2="13" />
                                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p
                            style={{
                                fontSize: "10px",
                                color: "var(--text-dim)",
                                marginTop: "var(--space-1)",
                                textAlign: "center",
                            }}
                        >
                            Enter para enviar · Shift+Enter para nova linha
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
