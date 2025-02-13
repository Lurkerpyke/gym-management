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
    <div className="flex items-center justify-center h-screen bg-muted">
      <div className="p-6 bg-background rounded-lg shadow-md flex flex-col lg:w-[600px] lg:h-[60vh] items-center">
        <h1 className="text-2xl text-primary text-center font-bold mb-4">Login</h1>
        <div className='h-full w-full flex flex-col gap-3 justify-center items-center'>
          {providers &&
            Object.values(providers).map((provider: any) => (
              <div key={provider.name}>
                <button
                  onClick={() => signIn(provider.id)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-700 flex gap-2"
                >
                  Entrar com {provider.name}
                  <LogInIcon />
                </button>
              </div>
            ))}
        </div>
        <div className='flex flex-col justify-center items-center gap-1'>
          <p>Não tem uma conta ainda?</p>
          <a href="register" className='italic'>crie sua conta</a>
        </div>
      </div>
    </div>
  );
}
