import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function getModel() {
    return genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    });
}

function extractJSON(raw: string): string {
    const trimmed = raw.trim();

    const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenceMatch) return fenceMatch[1].trim();

    const braceStart = trimmed.indexOf("{");
    const braceEnd = trimmed.lastIndexOf("}");
    if (braceStart !== -1 && braceEnd !== -1 && braceEnd > braceStart) {
        return trimmed.slice(braceStart, braceEnd + 1);
    }

    return trimmed;
}

function unescapeNewlines(str: string): string {
    return str.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
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
Você é um consultor financeiro pessoal altamente especializado e restrito EXCLUSIVAMENTE a análises financeiras.

Analise os dados financeiros abaixo e responda APENAS com um JSON válido.

Período: ${startDate} a ${endDate}
Total de receitas: R$${totalIncome.toFixed(2)}
Total de gastos: R$${totalExpense.toFixed(2)}
Saldo: R$${(totalIncome - totalExpense).toFixed(2)}
Gastos por categoria: ${JSON.stringify(byCategory, null, 2)}
Transações: ${JSON.stringify(transactions.slice(0, 50), null, 2)}

REGRAS OBRIGATÓRIAS:
- Você DEVE responder SOMENTE com JSON válido.
- NÃO inclua nenhum texto antes ou depois do JSON.
- NÃO utilize crases (backticks) ou blocos de código.
- NÃO explique o que está fazendo.
- NÃO inclua campos extras além dos especificados.
- O conteúdo DEVE ser 100% relacionado a finanças.
- É PROIBIDO mencionar qualquer assunto fora do contexto financeiro.
- Sempre utilize linguagem profissional, objetiva e analítica.

FORMATAÇÃO (OBRIGATÓRIA DENTRO DOS VALORES):
- Utilize Markdown dentro das strings JSON.
- Destaque pontos importantes com **negrito**.
- Use listas com "-" quando aplicável.
- Use quebras de linha reais (barra invertida + n) para organizar o texto.

Responda EXATAMENTE com este formato JSON:
{
  "summary": "resumo financeiro do período em 2-3 parágrafos, detalhado, analítico e personalizado utilizando markdown",
  "tips": [
    "dica 1 específica utilizando markdown",
    "dica 2 específica utilizando markdown",
    "dica 3 específica utilizando markdown",
    "dica 4 específica utilizando markdown"
  ]
}
`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    try {
        const cleaned = extractJSON(raw);
        const parsed = JSON.parse(cleaned);

        return {
            summary: unescapeNewlines(parsed.summary ?? ""),
            tips: Array.isArray(parsed.tips)
                ? parsed.tips.map((t: string) => unescapeNewlines(t))
                : [],
        };
    } catch {
        return {
            summary: raw,
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
Forneça conselhos práticos e personalizados baseados nos dados financeiros do usuário.
Utilize Markdown para formatar suas respostas quando aplicável.`,
                },
            ],
        },
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
}
