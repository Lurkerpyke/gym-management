'use client'

import React, { useState } from 'react';
import { ThemeToggle } from './ui/theme-toggle';
import SignInButton from './ui/signinbutton';
import { SessionProvider } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: "/schedule", text: "Calendário" },
    { href: "/billing", text: "Assinatura" },
    { href: "/about", text: "Sobre" },
    { href: "/contact", text: "Contatos" },
  ]

  return (
    <header className="sticky top-0 left-0 z-50 w-screen border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6 w-full">
        <div className="flex items-center space-x-4">

          {/* Mobile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden p-2 hover:bg-accent rounded-md">
              <Menu className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-screen rounded-none border-b bg-background/95">
              <nav className="flex flex-col space-y-1 p-2">
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <a
                      className="w-full px-2 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-accent focus:bg-accent"
                      href={link.href}
                    >
                      {link.text}
                    </a>
                  </DropdownMenuItem>
                ))}
              </nav>
            </DropdownMenuContent>
          </DropdownMenu>

          <a className="flex items-center space-x-2" href="/">
            <span className="font-bold sm:inline-block">GymPro</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href={link.href}
              >
                {link.text}
              </a>
            ))}
          </nav>
        </div>

        <div className='flex justify-between gap-3'>
          <SessionProvider>
            <SignInButton />
          </SessionProvider>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background/95 border-b">
          <nav className="flex flex-col space-y-2 p-4 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.text}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header