// app/owner/users/create/page.tsx
import { Button } from '@/components/ui/button';
import { UserForm } from '@/components/UserForm';
import Link from 'next/link';

export default function UserCreatePage() {
    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Criar Novo Usuário</h1>
                <Button variant="outline" asChild>
                    <Link href="/owner">
                        Voltar
                    </Link>
                </Button>
            </div>

            <UserForm />
        </div>
    );
}