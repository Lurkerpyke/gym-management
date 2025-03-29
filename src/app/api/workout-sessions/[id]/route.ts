// app/api/workout-sessions/[id]/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { completed, ...rest } = await req.json();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params; // Ensure `params` is awaited

    if (!id) {
        return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }

    try {
        const updatedSession = await prisma.workoutSession.update({
            where: { id },
            data: {
                ...rest,
                completed: typeof completed === 'boolean' ? completed : undefined
            }
        });

        return NextResponse.json(updatedSession);
    } catch (error) {
        console.error('Error updating session:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
