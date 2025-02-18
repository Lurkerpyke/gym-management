import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    // Se não estiver logado ou não for admin, redireciona
    if (!session || session.user.role !== "admin") {
        return redirect("/unauthorized"); // Página de acesso negado
    }

    return (
        <div>
            <h1>Área Administrativa</h1>
            <p>Bem-vindo, {session.user.name}!</p>
        </div>
    );
}
