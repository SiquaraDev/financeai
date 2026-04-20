"use client";

import { useState, useRef, useEffect } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

import NewAnalysisCard, {
    type Shortcut,
} from "@/components/ai/NewAnalysisCard";
import AnalysisResultCard from "@/components/ai/AnalysisResultCard";
import ChatMessage from "@/components/ai/ChatMessage";
import TypingDots from "@/components/ai/TypingDots";
import { GeminiIcon, IconSend, IconSpinner } from "@/components/icons";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface AnalysisResult {
    summary: string;
    tips: string[];
}

function applyShortcut(shortcut: Shortcut): { start: string; end: string } {
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

        const historyToSend = messages
            .slice(1)
            .map((m) => ({
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
          display: grid; grid-template-columns: 340px 1fr;
          gap: clamp(.5rem, 2vw, 1rem);
          height: calc(100dvh - 120px); min-height: 500px;
        }
        .ai-left { display: flex; flex-direction: column; gap: clamp(.5rem, 2vw, 1rem); overflow-y: auto; min-width: 0; }
        .ai-chat { display: flex; flex-direction: column; min-height: 0; }
        .ai-messages { flex: 1; overflow-y: auto; padding: clamp(.75rem,2vw,1.25rem); display: flex; flex-direction: column; gap: .75rem; scroll-behavior: smooth; }
        .ai-textarea { flex: 1; resize: none; min-height: 42px; max-height: 120px; line-height: 1.5; overflow-y: auto; padding: 10px 14px 0px !important; border: none !important; box-shadow: none !important; background: transparent !important; border-radius: var(--radius-md) !important; width: 100%; }
        .ai-textarea:focus { border: none !important; box-shadow: none !important; outline: none !important; }
        .ai-textarea::-webkit-scrollbar { width: 5px; }
        .ai-textarea::-webkit-scrollbar-thumb { background: var(--border); border-radius: var(--radius-full); }
        @media (max-width: 900px) { .ai-layout { grid-template-columns: 1fr; height: auto; min-height: unset; } .ai-chat { height: 520px; } }
        @media (max-width: 480px) { .ai-chat { height: 460px; } }
        @media (max-width: 360px) { .ai-chat { height: 400px; } }
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
                {/* ── Coluna esquerda ── */}
                <div className="ai-left">
                    <NewAnalysisCard
                        startDate={startDate}
                        endDate={endDate}
                        activeShortcut={activeShortcut}
                        analyzing={analyzing}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                        onShortcut={handleShortcut}
                        onAnalyze={handleAnalyze}
                    />
                    {analysis && <AnalysisResultCard analysis={analysis} />}
                </div>

                {/* ── Chat ── */}
                <div
                    className="card-glass ai-chat animate-fade-in delay-150"
                    style={{ overflow: "hidden" }}
                >
                    {/* Header do chat */}
                    <div
                        style={{
                            padding:
                                "clamp(.75rem,2vw,1rem) clamp(.75rem,2vw,1.25rem)",
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
                            <ChatMessage
                                key={i}
                                role={msg.role}
                                content={msg.content}
                            />
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
                            paddingTop: "clamp(.625rem,2vw,1rem)",
                            paddingLeft: "clamp(.75rem,2vw,1.25rem)",
                            paddingRight: "clamp(.75rem,2vw,1.25rem)",
                            paddingBottom: 0,
                            borderTop: "1px solid var(--border-subtle)",
                            flexShrink: 0,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                gap: "var(--space-2)",
                                alignItems: "flex-end",
                            }}
                        >
                            {/* Wrapper com focus ring */}
                            <div
                                style={{
                                    flex: 1,
                                    borderRadius: "var(--radius-md)",
                                    overflow: "hidden",
                                    border: "1px solid var(--border)",
                                    background: "var(--bg-elevated)",
                                    transition:
                                        "border-color var(--transition-base), box-shadow var(--transition-base)",
                                }}
                                onFocusCapture={(e) => {
                                    e.currentTarget.style.borderColor =
                                        "var(--brand-500)";
                                    e.currentTarget.style.boxShadow =
                                        "0 0 0 3px var(--accent-brand-glow)";
                                }}
                                onBlurCapture={(e) => {
                                    e.currentTarget.style.borderColor =
                                        "var(--border)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
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
                            </div>
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
                                    <IconSpinner size={14} />
                                ) : (
                                    <IconSend size={14} />
                                )}
                            </button>
                        </div>
                        <p
                            style={{
                                fontSize: "10px",
                                color: "var(--text-dim)",
                                marginTop: "var(--space-1)",
                                textAlign: "center",
                                paddingBottom: "clamp(.625rem,2vw,1rem)",
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
