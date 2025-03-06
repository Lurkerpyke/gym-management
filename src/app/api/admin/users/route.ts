import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (session?.user?.role !== 'owner') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true // Add this line
            },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(users)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        )
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)
    const { userId, role } = await req.json()

    if (session?.user?.role !== 'owner') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role }
        })
        return NextResponse.json(updatedUser)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update user role' },
            { status: 500 }
        )
    }
}