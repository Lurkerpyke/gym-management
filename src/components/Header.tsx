'use client'

import React from 'react'
import { ThemeToggle } from './ui/theme-toggle'
import SignInButton from './ui/signinbutton'
import { SessionProvider } from 'next-auth/react'

const Header = () => {
  return (
    <header className="sticky top-0 left-0 z-50 w-screen border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <a className="flex items-center space-x-2" href="/">
            <span className="font-bold sm:inline-block">GymPro</span>
          </a>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/schedule">
              Calendário
            </a>
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/billing">
              Assinatura
            </a>
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/about">
              Sobre
            </a>
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/contact">
              Contatos
            </a>
          </nav>
        </div>
        <div className='flex justify-between gap-3'>
          <SessionProvider>
            <SignInButton />
          </SessionProvider>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header