import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
    title: z.string().min(1).optional(),
    amount: z.number().positive().optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().min(1).optional(),
    date: z.string().optional(),
    description: z.string().optional(),
});

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await auth();
    if (!session?.user?.id)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.transaction.findFirst({
        where: { id, userId: session.user.id },
    });
    if (!existing)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten() },
            { status: 400 },
        );
    }

    let dateUpdate = {};
    if (parsed.data.date) {
        const dateStr = parsed.data.date.includes("T")
            ? parsed.data.date.split("T")[0]
            : parsed.data.date;
        const [year, month, day] = dateStr.split("-").map(Number);
        dateUpdate = { date: new Date(year, month - 1, day, 12, 0, 0) };
    }

    const updated = await prisma.transaction.update({
        where: { id },
        data: {
            ...parsed.data,
            ...dateUpdate,
        },
    });

    return NextResponse.json(updated);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await auth();
    if (!session?.user?.id)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.transaction.findFirst({
        where: { id, userId: session.user.id },
    });
    if (!existing)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.transaction.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
