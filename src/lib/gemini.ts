import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function getModel() {
    return genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    });
}

interface TransactionInput {
    title: string;
    amount: number;
    type: string;
    category: string;
    date: string;
}

export async function analyzeFinances(
    transactions: TransactionInput[],
    startDate: string,
    endDate: string,
): Promise<{ summary: string; tips: string[] }> {
    const model = getModel();

    const totalIncome = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((s, t) => s + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((s, t) => s + t.amount, 0);

    const byCategory = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce<Record<string, number>>((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    const prompt = `
Você é um consultor financeiro pessoal. Analise os dados financeiros abaixo e responda APENAS em JSON válido, sem markdown.

Período: ${startDate} a ${endDate}
Total de receitas: R$${totalIncome.toFixed(2)}
Total de gastos: R$${totalExpense.toFixed(2)}
Saldo: R$${(totalIncome - totalExpense).toFixed(2)}
Gastos por categoria: ${JSON.stringify(byCategory, null, 2)}
Transações: ${JSON.stringify(transactions.slice(0, 50), null, 2)}

Responda com este JSON exato:
{
  "summary": "resumo financeiro do período em 2-3 parágrafos, detalhado e personalizado",
  "tips": ["dica 1 específica", "dica 2 específica", "dica 3 específica", "dica 4 específica"]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response
        .text()
        .replace(/```json|```/g, "")
        .trim();

    try {
        return JSON.parse(text);
    } catch {
        return {
            summary: text,
            tips: [
                "Analise seus gastos por categoria para identificar onde economizar.",
            ],
        };
    }
}

export async function chatWithGemini(
    userMessage: string,
    analysisContext: string,
    history: { role: "user" | "model"; parts: string }[],
): Promise<string> {
    const model = getModel();

    const validHistory = history
        .filter((h) => h.parts?.trim() !== "")
        .reduce(
            (acc, h) => {
                const last = acc[acc.length - 1];
                if (last?.role === h.role) return acc;
                return [...acc, h];
            },
            [] as { role: "user" | "model"; parts: string }[],
        )
        .filter((_, i, arr) => !(i === 0 && arr[0].role !== "user"));

    const chat = model.startChat({
        history: validHistory.map((h) => ({
            role: h.role,
            parts: [{ text: h.parts }],
        })),
        systemInstruction: {
            role: "system",
            parts: [
                {
                    text: `Você é um consultor financeiro pessoal inteligente e empático.
Contexto da análise atual: ${analysisContext}
Responda sempre em português, de forma clara e objetiva.
Forneça conselhos práticos e personalizados baseados nos dados financeiros do usuário.`,
                },
            ],
        },
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
}
