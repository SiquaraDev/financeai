/**
 * useAiPage
 *
 * Encapsulates all state management and API calls for the AI analysis page.
 * The page component becomes a thin orchestrator — no business logic in JSX.
 */

"use client";

import { useState } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import type { Shortcut } from "@/components/ai/NewAnalysisCard";
import type { ChatMessageData } from "@/components/ai/ChatArea";

export interface AnalysisResult {
  summary: string;
  tips: string[];
}

function applyShortcut(shortcut: Shortcut): { start: string; end: string } {
  const now = new Date();
  const fmt = (d: Date) => format(d, "yyyy-MM-dd");
  switch (shortcut) {
    case "last_month":
      return { start: fmt(startOfMonth(subMonths(now, 1))), end: fmt(endOfMonth(subMonths(now, 1))) };
    case "3_months":
      return { start: fmt(startOfMonth(subMonths(now, 2))), end: fmt(endOfMonth(now)) };
    case "6_months":
      return { start: fmt(startOfMonth(subMonths(now, 5))), end: fmt(endOfMonth(now)) };
    case "year":
      return { start: fmt(startOfMonth(subMonths(now, 11))), end: fmt(endOfMonth(now)) };
  }
}

export function useAiPage() {
  const [startDate, setStartDate] = useState(
    format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"),
  );
  const [endDate, setEndDate] = useState(
    format(endOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"),
  );
  const [activeShortcut, setActiveShortcut] = useState<Shortcut>("last_month");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

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
      const data: AnalysisResult = await res.json();
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
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro ao conectar com o Gemini. Tente novamente." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return {
    // Date range
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    activeShortcut,
    handleShortcut,
    // Analysis
    analysis,
    analyzing,
    handleAnalyze,
    // Chat
    messages,
    input,
    setInput,
    chatLoading,
    handleChat,
  };
}
