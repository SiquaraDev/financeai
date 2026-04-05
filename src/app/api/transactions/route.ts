import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const transactionSchema = z.object({
    title: z.string().min(1),
    amount: z.number().positive(),
    type: z.enum(["INCOME", "EXPENSE"]),
    category: z.string().min(1),
    date: z.string(),
    description: z.string().optional(),
    source: z.enum(["MANUAL", "JSON", "PDF", "EXCEL"]).default("MANUAL"),
});

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const where = {
        userId: session.user.id,
        ...(type ? { type: type as "INCOME" | "EXPENSE" } : {}),
        //Filtra por intervalo de datas quando informado
        ...(start || end
            ? {
                  date: {
                      ...(start ? { gte: new Date(start) } : {}),
                      ...(end ? { lte: new Date(end) } : {}),
                  },
              }
            : {}),
    };

    const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
            where,
            orderBy: { date: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({ transactions, total, page, limit });
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = transactionSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten() },
            { status: 400 },
        );
    }

    const transaction = await prisma.transaction.create({
        data: {
            ...parsed.data,
            date: new Date(parsed.data.date),
            userId: session.user.id,
        },
    });

    return NextResponse.json(transaction, { status: 201 });
}
