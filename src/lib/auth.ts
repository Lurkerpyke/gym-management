// lib/auth.ts
import { getServerSession, NextAuthOptions, User } from "next-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";

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
        async signIn({ user }: { user?: User }) {
            try {
                if (!user?.email) return false;

                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                if (existingUser) return true;

                // Get cookies synchronously
                const headersList = await headers();
                const cookieHeader = headersList.get('cookie') || '';
                const inviteCode = cookieHeader
                    .split(';')
                    .find((c: string) => c.trim().startsWith('inviteCode='))
                    ?.split('=')[1]
                    ?.toUpperCase()
                    .trim();

                if (!inviteCode) {
                    console.log('🚫 Código não fornecido para:', user.email);
                    return '/signin?error=Código obrigatório';
                }

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
        async createUser({ user }: { user: User }) {
            try {
                const headersList = await headers();
                const cookieHeader = headersList.get('cookie') || '';
                const inviteCode = cookieHeader
                    .split(';')
                    .find((c: string) => c.trim().startsWith('inviteCode='))
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
    }
};

// Helper functions
export async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return redirect("/signin");
    if (!["admin", "owner"].includes(session.user.role)) return redirect("/unauthorized");
    return session;
}

export async function requireOwner() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return redirect("/signin");
    if (session.user.role !== "owner") return redirect("/unauthorized");
    return session;
}

export async function requireLogin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return redirect("/signin");
    return session;
}