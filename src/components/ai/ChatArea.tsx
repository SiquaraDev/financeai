"use client";

import { useEffect, useRef } from "react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ChatMessage from "./ChatMessage";
import ChatInputBar from "./ChatInputBar";
import TypingDots from "./TypingDots";
import { GeminiIcon } from "@/components/icons";
import type { ChatMessage as ChatMessageData } from "@/types";

interface ChatAreaProps {
    messages: ChatMessageData[];
    input: string;
    loading: boolean;
    analysisReady: boolean;
    onInputChange: (value: string) => void;
    onSubmit: () => void;
    userInitials?: string;
}

export default function ChatArea({
    messages,
    input,
    loading,
    analysisReady,
    onInputChange,
    onSubmit,
    userInitials = "U",
}: ChatAreaProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div
            className="card-glass ai-chat animate-fade-in delay-150"
            style={{ overflow: "hidden" }}
        >
            <div
                style={{
                    padding: "clamp(.75rem,2vw,1rem) clamp(.75rem,2vw,1.25rem)",
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
                        {analysisReady
                            ? "Faça perguntas sobre sua análise"
                            : "Execute uma análise primeiro"}
                    </p>
                </div>

                <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                    <Badge variant={analysisReady ? "success" : "neutral"} dot>
                        {analysisReady ? "Ativo" : "Aguardando"}
                    </Badge>
                </div>
            </div>

            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "clamp(.75rem,2vw,1.25rem)",
                    display: "flex",
                    flexDirection: "column",
                    gap: ".75rem",
                    scrollBehavior: "smooth",
                }}
            >
                {messages.length === 0 && !analysisReady && (
                    <EmptyState
                        icon={
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
                        }
                        title="Execute uma análise para começar o chat"
                        description="O Gemini vai analisar suas finanças e responder suas dúvidas"
                    />
                )}

                {messages.map((msg, i) => (
                    <ChatMessage
                        key={i}
                        role={msg.role}
                        content={msg.content}
                        userInitials={userInitials}
                    />
                ))}

                {loading && (
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

            <ChatInputBar
                value={input}
                onChange={onInputChange}
                onSubmit={onSubmit}
                disabled={!analysisReady}
                loading={loading}
                placeholder={
                    analysisReady
                        ? "Pergunte algo sobre seus dados… (Enter para enviar)"
                        : "Aguardando análise..."
                }
            />
        </div>
    );
}
