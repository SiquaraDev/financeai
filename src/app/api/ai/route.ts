import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeFinances, chatWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, startDate, endDate, message, history, analysisContext } =
        await req.json();

    if (action === "analyze") {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: session.user.id,
                date: { gte: new Date(startDate), lte: new Date(endDate) },
            },
            orderBy: { date: "desc" },
        });

        const formatted = transactions.map((t) => ({
            title: t.title,
            amount: Number(t.amount),
            type: t.type,
            category: t.category,
            date: t.date.toISOString().split("T")[0],
        }));

        const result = await analyzeFinances(formatted, startDate, endDate);

        await prisma.aiAnalysis.create({
            data: {
                userId: session.user.id,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                summary: result.summary,
                tips: result.tips,
            },
        });

        return NextResponse.json(result);
    }

    if (action === "chat") {
        const response = await chatWithGemini(
            message,
            analysisContext,
            history ?? [],
        );
        return NextResponse.json({ response });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
