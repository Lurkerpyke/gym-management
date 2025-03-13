'use client';

import { useState, useEffect } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { LogInIcon, LockKeyholeIcon, UserPlusIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40 flex items-center justify-center p-4">
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

        {/* Right Side - Sign In Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md p-8 space-y-8 shadow-xl border-0">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Sign in to access your fitness dashboard
              </p>
            </div>

            <div className="space-y-4">
              {providers &&
                Object.values(providers).map((provider: any) => (
                  <Button
                    key={provider.name}
                    onClick={() => signIn(provider.id)}
                    className="w-full h-12 rounded-lg transition-all duration-300 hover:shadow-md"
                    variant="gradient"
                  >
                    <LogInIcon className="w-5 h-5 mr-2" />
                    Continue with {provider.name}
                  </Button>
                ))}
            </div>

            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>Don't have an account?</p>
              <Button
                variant="link"
                className="text-primary hover:text-primary/80 font-semibold"
                asChild
              >
                <a href="/register" className="flex items-center gap-1">
                  <UserPlusIcon className="h-4 w-4" />
                  Create Account
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}