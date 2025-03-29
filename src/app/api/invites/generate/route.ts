// app/api/invites/generate/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generateRandomCode } from "@/lib/utils"; // You'll need to create this utility

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'owner') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quantity = 1, expiresInHours = 168 } = await req.json(); // Default 7 days

    try {
        const codes = Array.from({ length: quantity }, () => ({
            code: generateRandomCode(8),
            expiresAt: new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
        }));

        const created = await prisma.gymInvite.createMany({
            data: codes,
            skipDuplicates: true,
        });

        return NextResponse.json({
            count: created.count,
            codes: codes.map(c => c.code)
        });
    } catch (error) {
        console.error("Error generating codes:", error);
        return NextResponse.json(
            { error: "Failed to generate codes" },
            { status: 500 }
        );
    }
}