"use client";

import PageHeader from "@/components/ui/PageHeader";
import NewAnalysisCard from "@/components/ai/NewAnalysisCard";
import AnalysisResultCard from "@/components/ai/AnalysisResultCard";
import ChatArea from "@/components/ai/ChatArea";
import { GeminiIcon } from "@/components/icons";
import { useAiPage } from "@/hooks/useAiPage";

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
        .ai-left  { display: flex; flex-direction: column; gap: clamp(.5rem, 2vw, 1rem); overflow-y: auto; min-width: 0; }
        .ai-chat  { display: flex; flex-direction: column; min-height: 0; }
        @media (max-width: 900px) {
          .ai-layout { grid-template-columns: 1fr; height: auto; min-height: unset; }
          .ai-chat   { height: 520px; }
        }
        @media (max-width: 480px) { .ai-chat { height: 460px; } }
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
                            <GeminiIcon size={16} />
                        </div>
                        IA Gemini
                    </div>
                }
                subtitle="Análise financeira inteligente com Gemini 3 Flash"
            />

            <div className="ai-layout">
                {/* ── Left column: analysis controls ── */}
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

                {/* ── Right column: chat ── */}
                <ChatArea
                    messages={messages}
                    input={input}
                    loading={chatLoading}
                    analysisReady={!!analysis}
                    onInputChange={setInput}
                    onSubmit={handleChat}
                />
            </div>
        </div>
    );
}
