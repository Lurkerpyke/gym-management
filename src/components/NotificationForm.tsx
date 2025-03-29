// components/NotificationForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { MultiUserSelect } from '@/components/MultiUserSelect';
import { toast } from 'sonner';

interface NotificationFormData {
    userIds: string[];
    message: string;
}

export function NotificationForm() {
    const form = useForm<NotificationFormData>({
        defaultValues: {
            userIds: [],
            message: ''
        }
    });

    const handleSubmit = async (data: NotificationFormData) => {
        try {
            const response = await fetch('/api/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userIds: data.userIds.filter(id => typeof id === 'string'),
                    message: data.message
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(`Notificação enviada para ${result.count} usuários`);
                form.reset();
            } else {
                toast.error(result.error || 'Erro ao enviar notificação');
            }
        } catch (error) {
            console.error('Erro ao enviar notificação:', error);
            toast.error('Erro de conexão');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="userIds"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Destinatários</FormLabel>
                            <FormControl>
                                <MultiUserSelect
                                    value={field.value || []}
                                    onChange={(values) => field.onChange(Array.isArray(values) ? values : [])}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mensagem</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    rows={4}
                                    placeholder="Digite sua mensagem..."
                                    className="resize-none"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    Enviar Notificação
                </Button>
            </form>
        </Form>
    );
}