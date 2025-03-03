import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { JWT } from "next-auth/jwt";

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
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: any; trigger?: string }) {
            if (user) {
                try {
                    // Add the user ID to the token
                    token.id = user.id;
                    // Fetch the user's role from the database
                    const dbUser = await prisma.user.findUnique({
                        where: { email: user.email },
                        select: { role: true },
                    });
                    // Add the role to the token
                    token.role = dbUser?.role || "user";
                } catch (err) {
                    console.error("Error fetching user role:", err);
                }
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                // Add the user ID and role to the session
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    events: {
        async signIn({ user }: { user: any }) {
            console.log(`User ${user.email} logged in with role ${user.role || "no role"}`);
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };