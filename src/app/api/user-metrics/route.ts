import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

type MetricsData = {
    currentWeight: number;
    lastMeasurement: Date;
    goalWeight?: number;
    bodyFat?: number;
    muscleMass?: number;
    height?: number;
    waistCircumference?: number;
    hipCircumference?: number;
    neckCircumference?: number;
    bmi?: number;
};

type RequestBody = {
    currentWeight: string | number;
    goalWeight?: string | number;
    bodyFat?: string | number;
    muscleMass?: string | number;
    height?: string | number;
    waistCircumference?: string | number;
    hipCircumference?: string | number;
    neckCircumference?: string | number;
};

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
    const body = await req.json();

    // Type-safe parsing of request body
    const {
        currentWeight,
        goalWeight,
        bodyFat,
        muscleMass,
        height,
        waistCircumference,
        hipCircumference,
        neckCircumference
    }: RequestBody = body;

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate required field
    if (typeof currentWeight === 'undefined' || isNaN(Number(currentWeight))) {
        return NextResponse.json({ error: 'Current weight is required' }, { status: 400 })
    }

    // Prepare base metrics data
    const metricsData: MetricsData = {
        currentWeight: Number(currentWeight),
        lastMeasurement: new Date()
    };

    // Helper function to safely convert to number
    const toNumber = (value: string | number | undefined): number | undefined => {
        if (typeof value === 'undefined') return undefined;
        const num = Number(value);
        return isNaN(num) ? undefined : num;
    };

    // Add optional fields with proper type conversion
    if (typeof goalWeight !== 'undefined') {
        const num = toNumber(goalWeight);
        if (num !== undefined) metricsData.goalWeight = num;
    }
    if (typeof bodyFat !== 'undefined') {
        const num = toNumber(bodyFat);
        if (num !== undefined) metricsData.bodyFat = num;
    }
    if (typeof muscleMass !== 'undefined') {
        const num = toNumber(muscleMass);
        if (num !== undefined) metricsData.muscleMass = num;
    }
    if (typeof height !== 'undefined') {
        const num = toNumber(height);
        if (num !== undefined) metricsData.height = num;
    }
    if (typeof waistCircumference !== 'undefined') {
        const num = toNumber(waistCircumference);
        if (num !== undefined) metricsData.waistCircumference = num;
    }
    if (typeof hipCircumference !== 'undefined') {
        const num = toNumber(hipCircumference);
        if (num !== undefined) metricsData.hipCircumference = num;
    }
    if (typeof neckCircumference !== 'undefined') {
        const num = toNumber(neckCircumference);
        if (num !== undefined) metricsData.neckCircumference = num;
    }

    // Calculate BMI if possible
    if (metricsData.height && metricsData.currentWeight) {
        metricsData.bmi = Number(
            (metricsData.currentWeight / Math.pow(metricsData.height, 2)).toFixed(1))
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