// src/app/api/reports/user-stats/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        // Basic counts
        const [totalUsers, newUsersLastWeek] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                }
            })
        ])

        // Active users
        const activeUsers = await prisma.user.count({
            where: {
                workoutSessions: {
                    some: {
                        completed: true
                    }
                }
            }
        })

        // Role distribution
        const roleDistribution = await prisma.user.groupBy({
            by: ['role'],
            _count: {
                role: true
            }
        })

        return NextResponse.json({
            totalUsers,
            newUsersLastWeek,
            activeUsers,
            roleDistribution: Object.fromEntries(
                roleDistribution.map(r => [r.role, r._count.role])
            )
        })

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch user stats' },
            { status: 500 }
        )
    }
}