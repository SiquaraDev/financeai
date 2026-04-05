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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setChatLoading(true);

        // Exclui a primeira mensagem (role: assistant) gerada após análise
        const historyToSend = messages
            .slice(1) // remove a mensagem inicial do assistente
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

    return (
        <div className="p-6 h-full">
            <div className="mb-6">
                <h1 className="text-xl font-medium text-gray-900">IA Gemini</h1>
                <p className="text-sm text-gray-500">
                    Análise financeira inteligente com Gemini 3 Flash
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 h-[calc(100vh-160px)]">
                {/* Painel esquerdo: configurar análise */}
                <div className="flex flex-col gap-4 overflow-auto">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-purple-600 text-xs font-medium">
                                    G
                                </span>
                            </div>
                            <h2 className="text-sm font-medium text-gray-900">
                                Nova análise
                            </h2>
                        </div>

                        <p className="text-xs text-gray-500 mb-2">Período</p>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">
                                    De
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">
                                    Até
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mb-2">Atalhos</p>
                        <div className="flex gap-2 flex-wrap mb-4">
                            {shortcuts.map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => handleShortcut(value)}
                                    className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                                        activeShortcut === value
                                            ? "bg-blue-50 text-blue-600 font-medium"
                                            : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {analyzing
                                ? "Analisando com Gemini..."
                                : "Analisar com Gemini"}
                        </button>
                    </div>

                    {/* Resultado da análise */}
                    {analysis && (
                        <div className="bg-white rounded-xl border border-gray-200 p-5 flex-1 overflow-auto">
                            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
                                <p className="text-xs font-medium text-purple-700 mb-2">
                                    Resumo do período
                                </p>
                                <p className="text-sm text-purple-900 leading-relaxed">
                                    {analysis.summary}
                                </p>
                            </div>

                            <p className="text-xs font-medium text-gray-500 mb-3">
                                Dicas personalizadas
                            </p>
                            <div className="space-y-2">
                                {analysis.tips.map((tip, i) => {
                                    const colors = [
                                        "bg-green-50 border-green-200 text-green-800",
                                        "bg-blue-50 border-blue-200 text-blue-800",
                                        "bg-amber-50 border-amber-200 text-amber-800",
                                        "bg-purple-50 border-purple-200 text-purple-800",
                                    ];
                                    return (
                                        <div
                                            key={i}
                                            className={`border rounded-lg px-3 py-2 text-sm ${colors[i % colors.length]}`}
                                        >
                                            {tip}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Painel direito: chat */}
                <div className="bg-white rounded-xl border border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="text-sm font-medium text-gray-900">
                            Tirar dúvidas
                        </h2>
                        <p className="text-xs text-gray-400">
                            {analysis
                                ? "Faça perguntas sobre sua análise"
                                : "Execute uma análise primeiro"}
                        </p>
                    </div>

                    <div className="flex-1 overflow-auto p-4 space-y-3">
                        {messages.length === 0 && !analysis && (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-3">
                                        <span className="text-purple-600 text-lg font-medium">
                                            G
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        Execute uma análise para começar o chat
                                    </p>
                                </div>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                        msg.role === "user"
                                            ? "bg-blue-600 text-white rounded-br-sm"
                                            : "bg-purple-50 text-purple-900 border border-purple-100 rounded-bl-sm"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="flex justify-start">
                                <div className="bg-purple-50 border border-purple-100 rounded-2xl rounded-bl-sm px-4 py-2.5">
                                    <div className="flex gap-1">
                                        <span
                                            className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0ms" }}
                                        />
                                        <span
                                            className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "150ms" }}
                                        />
                                        <span
                                            className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "300ms" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-gray-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    !e.shiftKey &&
                                    handleChat()
                                }
                                placeholder={
                                    analysis
                                        ? "Pergunte algo sobre seus dados..."
                                        : "Aguardando análise..."
                                }
                                disabled={!analysis || chatLoading}
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                            />
                            <button
                                onClick={handleChat}
                                disabled={
                                    !input.trim() || !analysis || chatLoading
                                }
                                className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
