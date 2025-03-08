// components/UserForm.tsx
'use client';

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const roles = [
    { value: 'user', label: 'Usuário' },
    { value: 'admin', label: 'Administrador' },
];

export function UserForm() {
    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            role: 'user',
            image: ''
        }
    });

    const handleSubmit = async (data: {
        name: string;
        email: string;
        role: string;
        image: string;
    }) => {
        try {
            const response = await fetch('/api/admin/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    image: data.image || null // Store null if empty
                }),
            });
            if (!response.ok) {
                const result = await response.json();
                toast.error(result.error || 'Erro ao criar usuário');
                return;
            }

            const result = await response.json();

            if (response.ok) {
                toast.success('Usuário criado com sucesso');
                form.reset();
            } else {
                toast.error(result.error || 'Erro ao criar usuário');
            }
        } catch (error) {
            toast.error('Erro de conexão');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Nome completo"
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="exemplo@email.com"
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Foto de Perfil (URL)</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="https://exemplo.com/foto.jpg"
                                    type="url"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cargo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um cargo" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.value} value={role.value}>
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    Criar Usuário
                </Button>
            </form>
        </Form>
    );
}