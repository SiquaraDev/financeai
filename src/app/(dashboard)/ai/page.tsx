"use client";

import PageHeader from "@/components/ui/PageHeader";
import { NewAnalysisCard, AnalysisResultCard, ChatArea } from "@/components/ai";
import { useAiPage } from "@/hooks";
import { useUser } from "@/context";
import { IconSpark } from "@/components/icons";

export default function AiPage() {
    const {
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        activeShortcut,
        handleShortcut,
        analysis,
        analyzing,
        handleAnalyze,
        messages,
        input,
        setInput,
        chatLoading,
        handleChat,
    } = useAiPage();

    const { initials } = useUser();

    return (
        <div
            style={{
                padding: "clamp(.75rem, 4vw, 2rem)",
                width: "100%",
                maxWidth: "1400px",
                margin: "0 auto",
                boxSizing: "border-box",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
            }}
        >
            <style>{`
                .ai-layout {
                    display: grid;
                    grid-template-columns: 340px 1fr;
                    gap: clamp(.5rem, 2vw, 1rem);
                    flex: 1;
                    height: 0;
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
                @media (max-width: 900px) {
                    .ai-layout {
                        grid-template-columns: 1fr;
                        flex: none;
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
            `}</style>

            <PageHeader
                title={
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".625rem",
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
                            <IconSpark size={16} />
                        </div>
                        Análise IA
                    </div>
                }
                subtitle="Análise financeira inteligente com Gemini 3 Flash"
            />

            <div className="ai-layout">
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
                <ChatArea
                    messages={messages}
                    input={input}
                    loading={chatLoading}
                    analysisReady={!!analysis}
                    onInputChange={setInput}
                    onSubmit={handleChat}
                    userInitials={initials}
                />
            </div>
        </div>
    );
}
