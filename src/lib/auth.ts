//lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function requireAdmin() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) return redirect("/signin");
    if (!["admin", "owner"].includes(session.user.role)) {
        return redirect("/unauthorized");
    }


    return session; // Retorna a sessão caso seja admin
}

export async function requireOwner() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) return redirect("/signin");
    if (session.user.role !== "owner") {
        return redirect("/unauthorized");
    }


    return session; // Retorna a sessão caso seja admin
}

export async function requireLogin() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) return redirect("/signin");


    return session; // Retorna a sessão caso seja admin
}


export { authOptions };
