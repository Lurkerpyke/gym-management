// app/owner/notifications/new/page.tsx
import { NotificationForm } from '@/components/NotificationForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotificationCreatePage() {
    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Nova Notificação</h1>
                <Button variant="outline" asChild>
                    <Link href="/owner">
                        Voltar
                    </Link>
                </Button>
            </div>

            <NotificationForm />
        </div>
    );
}