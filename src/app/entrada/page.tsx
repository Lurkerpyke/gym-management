// app/entrada/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';

export default function EntryPage() {
    const [code, setCode] = useState('');
    const router = useRouter();
    const params = useSearchParams();
    const error = params.get('error');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        signIn('github', {
            callbackUrl: '/',
            inviteCode: code
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className=" p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl text-foreground font-bold mb-6 text-center">
                    Acesso Exclusivo para Clientes
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error === 'CredentialsSignin'
                            ? 'Código inválido ou expirado'
                            : error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Código de Acesso
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Insira o código recebido"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            type="submit"
                            className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark"
                        >
                            Acessar com GitHub
                        </button>

                        <button
                            type="button"
                            onClick={() => signIn('google', { inviteCode: code })}
                            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
                        >
                            Acessar com Google
                        </button>
                    </div>
                </form>

                <p className="mt-4 text-sm text-muted-foreground text-center">
                    Solicite seu código na recepção da academia
                </p>
            </div>
        </div>
    );
}