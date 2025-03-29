// app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface NotificationRequest {
    userIds: string[];
    message: string;
}

export async function POST(req: Request) {
    try {
        // Authentication check
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'owner') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        // Request body validation
        const body: NotificationRequest = await req.json();
        const { userIds, message } = body;

        // Validate required fields
        if (!Array.isArray(userIds)) {
            return NextResponse.json(
                { error: 'Formato inválido para IDs de usuário' },
                { status: 400 }
            );
        }

        if (!message?.trim()) {
            return NextResponse.json(
                { error: 'Mensagem é obrigatória' },
                { status: 400 }
            );
        }

        // Validate user IDs format
        const isValidUserIds = userIds.every(id => typeof id === 'string');

        if (!isValidUserIds) {
            // Add this right after getting the request body
            console.log('Received notification request:', {
                userIds,
                message,
                userCount: userIds.length,
                sampleUserId: userIds[0]
            });
            return NextResponse.json(
                { error: 'IDs de usuário inválidos' },
                { status: 400 }
            );
        }

        // Database operation
        const { count } = await prisma.notification.createMany({
            data: userIds.map(userId => ({
                userId,
                title: 'Nova Notificação',
                message: message.trim(),
                type: 'info'
            })),
            skipDuplicates: true // Prevent duplicate entries
        });

        return NextResponse.json({
            success: true,
            count,
            message: `Notificação enviada para ${count} usuário(s)`
        });

    } catch (error) {
        console.error('Erro na criação de notificações:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}