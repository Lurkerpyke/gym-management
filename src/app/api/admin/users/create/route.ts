import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const VALID_ROLES = ['user', 'admin'];

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (session?.user?.role !== 'owner') {
            return NextResponse.json(
                { error: 'Acesso não autorizado' },
                { status: 403 }
            );
        }

        const { email, role, name } = await req.json();

        // Validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: 'Formato de email inválido' },
                { status: 400 }
            );
        }

        if (!VALID_ROLES.includes(role)) {
            return NextResponse.json(
                { error: 'Cargo inválido' },
                { status: 400 }
            );
        }

        // Check for existing user
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email já cadastrado' },
                { status: 409 }
            );
        }

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                email,
                role,
                name,
                // Add other default fields from your schema
            }
        });

        return NextResponse.json({
            success: true,
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role,
                name: newUser.name
            }
        });

    } catch (error) {
        console.error('Erro na criação de usuário:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}