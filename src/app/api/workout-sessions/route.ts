import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    const { title, description, date, duration, id } = await req.json()

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = {
        title,
        description,
        date: new Date(date),
        duration: Number(duration),
        userId: session.user.id,
    }

    const updatedSession = id ?
        await prisma.workoutSession.update({
            where: { id },
            data: sessionData
        }) :
        await prisma.workoutSession.create({
            data: sessionData
        })

    return NextResponse.json(updatedSession)
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)
    const { id } = await req.json()

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.workoutSession.delete({
        where: { id }
    })

    return NextResponse.json({ success: true })
}
