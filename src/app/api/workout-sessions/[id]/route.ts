import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// app/api/workout-sessions/[id]/route.ts
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    const { completed, ...rest } = await req.json()

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!params?.id) {
        return NextResponse.json({ error: 'Missing session ID' }, { status: 400 })
    }

    try {
        const updatedSession = await prisma.workoutSession.update({
            where: { id: params.id },
            data: {
                ...rest,
                completed: typeof completed === 'boolean' ? completed : undefined
            }
        })

        return NextResponse.json(updatedSession)
    } catch (error) {
        console.error('Error updating session:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}