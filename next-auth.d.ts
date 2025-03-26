// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
    interface User {
        role?: string;
    }

    interface Session {
        user: {
            role?: string;
        } & DefaultSession["user"];
    }

    interface SignInOptions {
        inviteCode?: string;
    }

    interface Account {
        inviteCode?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string;
    }
}