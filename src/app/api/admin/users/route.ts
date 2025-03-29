// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Add valid roles based on your Prisma schema
const VALID_ROLES = ['user', 'admin', 'owner'];

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (session?.user?.role !== 'owner') {
            return NextResponse.json(
                { error: 'Acesso não autorizado' },
                { status: 403 }
            );
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(users);

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Erro ao carregar usuários' },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (session?.user?.role !== 'owner') {
            return NextResponse.json(
                { error: 'Acesso não autorizado' },
                { status: 403 }
            );
        }

        const body = await req.json();

        // Validate request body
        if (!body.userId || !body.role) {
            return NextResponse.json(
                { error: 'Dados incompletos' },
                { status: 400 }
            );
        }

        // Validate role value
        if (!VALID_ROLES.includes(body.role)) {
            return NextResponse.json(
                { error: 'Função inválida' },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: body.userId }
        });

        if (!existingUser) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { id: body.userId },
            data: { role: body.role }
        });

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar usuário' },
            { status: 500 }
        );
    }
}

// app/api/admin/users/route.ts
export async function DELETE(req: Request) {
    try {
        console.log("🔍 Requisição DELETE recebida");

        const json = await req.json();
        console.log("🛠 Body recebido na API:", json);

        const { email } = json;

        if (!email) {
            return NextResponse.json(
                { error: "Email é obrigatório" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (!existingUser) {
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 }
            );
        }

        const session = await getServerSession(authOptions);
        if (email === session?.user?.email) {
            return NextResponse.json(
                { error: "Você não pode deletar sua própria conta" },
                { status: 400 }
            );
        }

        await prisma.user.delete({ where: { email } });

        return NextResponse.json({
            success: true,
            message: `Usuário ${email} deletado com sucesso`
        });

    } catch (error: unknown) {
        // Safely convert error to string for logging
        console.error("🚨 Erro ao deletar usuário:", String(error));

        let errorMessage = "Erro desconhecido";
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                errorMessage = "Existem registros vinculados ao usuário que impedem a exclusão.";
            } else {
                errorMessage = error.message;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        } else if (error === null || error === undefined) {
            errorMessage = "Erro nulo ou indefinido";
        } else if (typeof error === "object") {
            try {
                errorMessage = JSON.stringify(error);
            } catch (e) {
                errorMessage = "Erro ao stringificar o objeto de erro";
            }
        }

        return NextResponse.json(
            { error: "Erro ao deletar usuário", details: errorMessage },
            { status: 500 }
        );
    }
}
