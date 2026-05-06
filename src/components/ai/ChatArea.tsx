"use client";

import { useEffect, useRef } from "react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ChatMessage from "./ChatMessage";
import ChatInputBar from "./ChatInputBar";
import TypingDots from "./TypingDots";
import { IconChat, IAIcon } from "@/components/icons";
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
    userInitials,
}: ChatAreaProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div className="ai-chat card-glass animate-fade-in delay-150">
            <div className="ai-chat__header">
                <div className="ai-chat__avatar">
                    <IAIcon size={15} />
                </div>

                <div className="ai-chat__info">
                    <p className="ai-chat__title font-display">Tirar dúvidas</p>
                    <p className="ai-chat__subtitle">
                        {analysisReady
                            ? "Faça perguntas sobre sua análise"
                            : "Execute uma análise primeiro"}
                    </p>
                </div>

                <div className="ai-chat__badge">
                    <Badge variant={analysisReady ? "success" : "neutral"} dot>
                        {analysisReady ? "Ativo" : "Aguardando"}
                    </Badge>
                </div>
            </div>

            <div className="ai-chat-messages">
                {messages.length === 0 && !analysisReady && (
                    <EmptyState
                        icon={
                            <div className="ai-chat__empty-icon animate-pulse-teal">
                                <IconChat size={22} />
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
                    <div className="ai-chat__typing animate-fade-in">
                        <div className="ai-chat__typing-avatar">
                            <IAIcon size={12} />
                        </div>
                        <div className="ai-chat__typing-bubble">
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
