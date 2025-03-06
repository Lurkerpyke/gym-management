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
