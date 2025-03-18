// app/owner/users/create/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { UserForm } from "@/components/UserForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function UserCreatePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'owner') {
        redirect("/unauthorized"); // No return needed
    }
    return (
        <div className="container mx-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Criar Novo Usuário</h1>
                <Button variant="outline" asChild>
                    <Link href="/owner">
                        Voltar para o Dashboard
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Informações do Usuário</CardTitle>
                </CardHeader>
                <CardContent>
                    <UserForm />
                </CardContent>
            </Card>
        </div>
    );
}