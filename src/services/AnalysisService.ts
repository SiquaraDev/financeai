import { ApiService } from "./ApiService";
import type { AnalysisResult, ChatMessage, MutationResult } from "@/types";

interface AnalyzeParams {
    startDate: string;
    endDate: string;
}

interface ChatParams {
    message: string;
    analysisContext: string;
    history: { role: "user" | "model"; parts: string }[];
}

interface ChatResponse {
    response: string;
}

export class AnalysisService extends ApiService {
    constructor() {
        super("/api");
    }

    async analyze(
        params: AnalyzeParams,
    ): Promise<MutationResult<AnalysisResult>> {
        try {
            const data = await this.post<AnalysisResult>("/ai", {
                action: "analyze",
                startDate: params.startDate,
                endDate: params.endDate,
            });
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error ? error.message : "Erro na análise",
            };
        }
    }

    async chat(
        message: string,
        analysisContext: string,
        messages: ChatMessage[],
    ): Promise<MutationResult<string>> {
        try {
            const history = this.toGeminiHistory(messages);

            const data = await this.post<ChatResponse>("/ai", {
                action: "chat",
                message,
                analysisContext,
                history,
            });

            return { success: true, data: data.response };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erro no chat",
            };
        }
    }

    private toGeminiHistory(
        messages: ChatMessage[],
    ): { role: "user" | "model"; parts: string }[] {
        return messages
            .slice(1)
            .map((m) => ({
                role:
                    m.role === "assistant"
                        ? ("model" as const)
                        : ("user" as const),
                parts: m.content,
            }))
            .filter((h) => h.parts.trim() !== "")
            .reduce(
                (acc, h) => {
                    const last = acc[acc.length - 1];
                    if (last?.role === h.role) return acc;
                    return [...acc, h];
                },
                [] as { role: "user" | "model"; parts: string }[],
            )
            .filter((_, i, arr) => !(i === 0 && arr[0].role !== "user"));
    }
}

export const analysisService = new AnalysisService();
