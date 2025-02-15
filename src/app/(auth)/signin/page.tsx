'use client';

import { useState, useEffect } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { LogInIcon } from 'lucide-react';

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    async function fetchProviders() {
      const res = await getProviders();
      setProviders(res);
    }
    fetchProviders();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="p-8 bg-background rounded-xl shadow-lg flex flex-col lg:w-[400px] items-center border border-foreground">
        <h1 className="text-3xl text-primary text-center font-bold mb-8">Welcome Back</h1>
        <div className='h-full w-full flex flex-col gap-4 justify-center items-center mb-8'>
          {providers &&
            Object.values(providers).map((provider: any) => (
              <div key={provider.name} className="w-full">
                <button
                  onClick={() => signIn(provider.id)}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-blue-700 flex items-center justify-center gap-3 transition-all duration-200 ease-in-out"
                >
                  Entrar com {provider.name}
                  <LogInIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
        </div>
        <div className='flex flex-col justify-center items-center gap-2 text-gray-500'>
          <p className="text-sm">Não tem uma conta ainda?</p>
          <a href="register" className='text-xs text-primary hover:text-blue-700 transition-colors duration-200 hover:underline'>
            crie sua conta
          </a>
        </div>
      </div>
    </div>
  );
}
