import { requireAdmin } from "@/lib/auth";

export default async function AdminPage() {
    const session = await requireAdmin();

    return (
        <div>
            <h1>Área Administrativa</h1>
            <p>Bem-vindo, admin {session.user.name}!</p>
        </div>
    );
}
