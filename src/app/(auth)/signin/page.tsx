'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { LogInIcon, LockKeyholeIcon, UserPlusIcon, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import Image from 'next/image';


export default function SignIn() {
  const [inviteCode, setInviteCode] = useState('');
  const params = useSearchParams();
  const error = params.get('error');

  const handleSignIn = (provider: string) => {
    // Armazena o código em cookie seguro
    document.cookie = `inviteCode=${encodeURIComponent(inviteCode.toUpperCase().trim())}; path=/; SameSite=Lax; max-age=300`;
    signIn(provider, {
      callbackUrl: '/',
    });
  };


  useEffect(() => {
    // Limpa o cookie após 5 minutos
    const timer = setTimeout(() => {
      document.cookie = 'inviteCode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }, 300000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40 flex items-center justify-center p-4">
      <Image src="/undraw_email-consent_j36b.svg" alt="Logo" width={200} height={200} className='absolute top-20 left-1/4' />
      <div className="grid lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex flex-col justify-center items-center space-y-6 text-center p-8">
          <div className="flex items-center gap-2 mb-8">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                <LockKeyholeIcon className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold text-primary">Gym Management</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Transform Your Fitness Journey</h2>
            <ul className="space-y-2 text-muted-foreground text-left">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                Professional Training Programs
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                Community Support & Motivation
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                Progress Tracking & Analytics
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Updated Sign In Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md p-8 space-y-8 shadow-xl border-0">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {error ? 'Access Required' : 'Welcome Back'}
              </h1>
              <p className="text-muted-foreground">
                {error ? 'Please provide a valid access code' : 'Sign in to access your fitness dashboard'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
                <AlertCircle className="h-5 w-5" />
                <span>
                  {error === 'AccessDenied'
                    ? 'Invalid or expired access code'
                    : 'Authentication error'}
                </span>
              </div>
            )}

            {/* Invite Code Input */}
            <div className="space-y-4">
              <Input
                placeholder="Código de acesso"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="mb-4"
              />

              
              <Button
                onClick={() => handleSignIn('google')}
                className="w-full h-12 rounded-lg transition-all duration-300 hover:shadow-md"
                variant="gradient"
              >
                <LogInIcon className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>

              {/* Tratamento de erros */}
              {error && (
                <div className="text-red-500 mt-2">
                  {error === 'AccessDenied' && 'Código inválido ou expirado'}
                  {error === 'OAuthAccountNotLinked' && 'Email já cadastrado'}
                </div>
              )}

            </div>

            {/* Registration Note */}
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>Não tem um código de acesso?</p>
              <Button
                variant="link"
                className="text-primary hover:text-primary/80 font-semibold"
                asChild
              >
                <a href="/contact" className="flex items-center gap-1">
                  <UserPlusIcon className="h-4 w-4" />
                  Entre em contato
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}