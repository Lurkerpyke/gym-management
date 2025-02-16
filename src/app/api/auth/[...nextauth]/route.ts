import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { JWT } from "next-auth/jwt";

const prisma = new PrismaClient();

// Database connection (keep your existing setup)
prisma.$connect().then(() => {
    console.log('Prisma connected successfully');
}).catch((err: any) => {
    console.error('Prisma connection error:', err);
});

// Define os tipos corretamente
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
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: any; trigger?: string }) {
            if (user) {
                try {
                    // Tentar obter o papel do banco de dados
                    const dbUser = await prisma.user.findUnique({
                        where: { email: user.email }, // Procurar pelo email
                        select: { role: true }
                    });
                    // Add this line to set the role in the token
                    token.role = dbUser?.role || 'user';
                } catch (err) {
                    console.error('Erro ao buscar o papel do usuário:', err);
                }
            }
            return token;
        }
,
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.role = token.role as string;
            }
            return session;
        }

    },
    events: {
        async signIn({ user }: { user: any }) {
            console.log(`Usuário ${user.email} fez login com o papel ${user.role || 'sem papel'}`);
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };