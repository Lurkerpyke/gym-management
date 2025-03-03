import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const metrics = await prisma.userMetrics.findUnique({
        where: { userId: session.user.id },
    })

    return NextResponse.json(metrics)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    const { currentWeight, goalWeight, bodyFat, muscleMass } = await req.json()

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updatedMetrics = await prisma.userMetrics.upsert({
        where: { userId: session.user.id },
        update: {
            currentWeight: Number(currentWeight),
            goalWeight: Number(goalWeight),
            bodyFat: Number(bodyFat),
            muscleMass: Number(muscleMass),
            lastMeasurement: new Date()
        },
        create: {
            userId: session.user.id,
            currentWeight: Number(currentWeight),
            goalWeight: Number(goalWeight),
            bodyFat: Number(bodyFat),
            muscleMass: Number(muscleMass),
            lastMeasurement: new Date(),
        },
    })

    return NextResponse.json(updatedMetrics)
}