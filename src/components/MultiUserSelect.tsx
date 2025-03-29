// components/MultiUserSelect.tsx
'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface UserData {
    id: string;
    name?: string | null;
    email?: string | null;
}

interface MultiUserSelectProps {
    value?: string[];  // Make optional
    onChange: (value: string[]) => void;
    disabled?: boolean;
}

export function MultiUserSelect({
    value = [],  // Default empty array
    onChange,
    disabled = false
}: MultiUserSelectProps) {
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/admin/users');

            if (!response.ok) throw new Error('Failed to load users');

            const data = await response.json();
            setUsers(Array.isArray(data) ? data.filter(u => u?.id) : []);
        } catch (err) {
            console.error('Error loading users:', err);
            setError('Erro ao carregar usuários');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) loadUsers();
    }, [open]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled || loading}
                >
                    <div className="flex items-center gap-2">
                        {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                        {value?.length > 0 ? (
                            <span>{value.length} selecionados</span>
                        ) : (
                            <span>Selecione usuários...</span>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
                <Command shouldFilter={false}>
                    <CommandInput placeholder="Buscar usuários..." />

                    {loading && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Carregando usuários...
                        </div>
                    )}

                    {error && (
                        <div className="p-4 text-center text-sm text-destructive">
                            <p>{error}</p>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2"
                                onClick={loadUsers}
                            >
                                Tentar novamente
                            </Button>
                        </div>
                    )}

                    {!loading && !error && (
                        <CommandGroup>
                            {Array.isArray(users) && users.map((user) => (
                                <CommandItem
                                    key={user.id}
                                    value={user.id}
                                    onSelect={() => {
                                        const newValue = value.includes(user.id)
                                            ? value.filter(id => id !== user.id)
                                            : [...value, user.id];
                                        onChange(newValue);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value.includes(user.id) ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    <span className="truncate">
                                        {user.email}{user.name && ` (${user.name})`}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    <CommandEmpty className="p-2 text-sm">
                        {users.length === 0 && 'Nenhum usuário encontrado'}
                    </CommandEmpty>
                </Command>
            </PopoverContent>
        </Popover>
    );
}