"use client";

import { useState, useCallback } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { analysisService } from "@/services";
import { applyAiShortcut } from "@/utils/dateRange";
import type { AnalysisResult, ChatMessage, AiShortcut } from "@/types";
interface UseAiPageReturn {
    startDate: string;
    endDate: string;
    activeShortcut: AiShortcut;
    analysis: AnalysisResult | null;
    analyzing: boolean;
    messages: ChatMessage[];
    input: string;
    chatLoading: boolean;
    setStartDate: (v: string) => void;
    setEndDate: (v: string) => void;
    handleShortcut: (s: AiShortcut) => void;
    handleAnalyze: () => Promise<void>;
    setInput: (v: string) => void;
    handleChat: () => Promise<void>;
}

export function useAiPage(): UseAiPageReturn {
    const [startDate, setStartDate] = useState(
        format(startOfMonth(new Date()), "yyyy-MM-dd"),
    );
    const [endDate, setEndDate] = useState(
        format(endOfMonth(new Date()), "yyyy-MM-dd"),
    );
    const [activeShortcut, setActiveShortcut] =
        useState<AiShortcut>("this_month");
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);

    const handleShortcut = useCallback((shortcut: AiShortcut) => {
        const { start, end } = applyAiShortcut(shortcut);
        setStartDate(start);
        setEndDate(end);
        setActiveShortcut(shortcut);
    }, []);

    const handleAnalyze = useCallback(async () => {
        setAnalyzing(true);
        setMessages([]);
        const result = await analysisService.analyze({ startDate, endDate });
        if (result.success && result.data) {
            setAnalysis(result.data);
            setMessages([
                {
                    role: "assistant",
                    content: `Análise concluída! ${result.data.summary.split(".")[0]}. Pode me fazer perguntas sobre seus dados financeiros.`,
                },
            ]);
        } else {
            setAnalysis(null);
        }
        setAnalyzing(false);
    }, [startDate, endDate]);

    const handleChat = useCallback(async () => {
        if (!input.trim() || !analysis) return;
        const userMsg = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setChatLoading(true);

        const result = await analysisService.chat(
            userMsg,
            analysis.summary,
            messages,
        );

        setMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                content:
                    result.success && result.data
                        ? result.data
                        : "Erro ao conectar com o Gemini. Tente novamente.",
            },
        ]);
        setChatLoading(false);
    }, [input, analysis, messages]);

    return {
        startDate,
        endDate,
        activeShortcut,
        analysis,
        analyzing,
        messages,
        input,
        chatLoading,
        setStartDate,
        setEndDate,
        handleShortcut,
        handleAnalyze,
        setInput,
        handleChat,
    };
}
