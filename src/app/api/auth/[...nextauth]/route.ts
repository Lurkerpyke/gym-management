// src/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { JWT } from "next-auth/jwt";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/signin",
        error: "/signin?error=Erro de autenticação",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                    select: { role: true },
                });
                token.role = dbUser?.role || "user";
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
        async signIn({ user, account }) {
            try {
                // Verificar se é um usuário existente
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                });

                if (existingUser) return true;

                // Recuperar código do cookie
                const headersList = await headers();
                const cookieHeader = headersList.get('cookie');
                const inviteCode = cookieHeader?.split(';')
                    .find(c => c.includes('inviteCode='))
                    ?.split('=')[1]
                    ?.toUpperCase()
                    .trim();

                if (!inviteCode) {
                    console.log('🚫 Código não fornecido para:', user.email);
                    return '/signin?error=Código obrigatório';
                }

                // Validar código no banco de dados
                const validInvite = await prisma.gymInvite.findUnique({
                    where: { code: inviteCode },
                });

                const isCodeValid = validInvite &&
                    !validInvite.used &&
                    new Date(validInvite.expiresAt) > new Date();

                if (!isCodeValid) {
                    console.log('⛔ Código inválido:', inviteCode);
                    return '/signin?error=Código inválido ou expirado';
                }

                // Marcar código como usado
                await prisma.gymInvite.update({
                    where: { id: validInvite.id },
                    data: { used: true }
                });

                return true;

            } catch (error) {
                console.error('🔥 Erro crítico:', error);
                return '/signin?error=Erro interno';
            }
        },
    },
    events: {
        async createUser({ user }) {
            try {
                // Recuperar código do cookie após criação do usuário
                const headersList = await headers();
                const cookieHeader = headersList.get('cookie');
                const inviteCode = cookieHeader?.split(';')
                    .find(c => c.includes('inviteCode='))
                    ?.split('=')[1]
                    ?.toUpperCase()
                    .trim();

                if (inviteCode) {
                    await prisma.gymInvite.updateMany({
                        where: {
                            code: inviteCode,
                            userId: null
                        },
                        data: { userId: user.id }
                    });
                    console.log('✅ Código vinculado ao usuário:', user.email);
                }
            } catch (error) {
                console.error('❌ Falha ao vincular código:', error);
            }
        }
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };