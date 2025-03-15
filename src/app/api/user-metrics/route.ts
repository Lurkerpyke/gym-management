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
    const {
        currentWeight,
        goalWeight,
        bodyFat,
        muscleMass,
        height,
        waistCircumference,
        hipCircumference,
        neckCircumference
    } = await req.json()

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate required field
    if (typeof currentWeight === 'undefined' || isNaN(Number(currentWeight))) {
        return NextResponse.json({ error: 'Current weight is required' }, { status: 400 })
    }

    // Prepare base metrics data
    const metricsData: any = {
        currentWeight: Number(currentWeight),
        lastMeasurement: new Date()
    }

    // Add optional fields with validation
    const optionalFields = {
        goalWeight,
        bodyFat,
        muscleMass,
        height,
        waistCircumference,
        hipCircumference,
        neckCircumference
    }

    for (const [field, value] of Object.entries(optionalFields)) {
        if (typeof value !== 'undefined' && !isNaN(Number(value))) {
            metricsData[field] = Number(value)
        }
    }

    // Calculate BMI if possible
    if (metricsData.height && metricsData.currentWeight) {
        metricsData.bmi = Number(
            (metricsData.currentWeight / Math.pow(metricsData.height, 2)).toFixed(1)
        )
    }

    try {
        const updatedMetrics = await prisma.userMetrics.upsert({
            where: { userId: session.user.id },
            update: metricsData,
            create: {
                userId: session.user.id,
                ...metricsData
            }
        })

        return NextResponse.json(updatedMetrics)
    } catch (error) {
        console.error('Error updating metrics:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}