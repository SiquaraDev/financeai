"use client";

import PageHeader from "@/components/ui/PageHeader";
import { NewAnalysisCard, AnalysisResultCard, ChatArea } from "@/components/ai";
import { useAiPage } from "@/hooks";
import { useUser } from "@/context";
import { IconSpark } from "@/components/icons";

function AiPageTitle() {
    return (
        <div className="ai-page-title">
            <div className="ai-page-title__icon animate-pulse-teal">
                <IconSpark size={16} />
            </div>
            Análise IA
        </div>
    );
}

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
        <div className="ai-page">
            <div className="ai-page-header">
                <PageHeader
                    title={<AiPageTitle />}
                    subtitle="Análise financeira inteligente com Gemini 3 Flash"
                />
            </div>

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
