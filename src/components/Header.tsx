import React from 'react'
import { ThemeToggle } from './ui/theme-toggle'
import Loginbtn from './ui/login-btn'
import { Button } from './ui/button'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <a className="flex items-center space-x-2" href="/">
            <span className="font-bold sm:inline-block">GymPro</span>
          </a>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/features">
              Features
            </a>
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/pricing">
              Pricing
            </a>
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/about">
              About
            </a>
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/contact">
              Contact
            </a>
          </nav>
        </div>
        <div className='flex justify-between gap-3'>
            <Button className='bg-secondary-foreground text-primary-foreground'>SignIn</Button>
            {/* <Loginbtn /> */}
            <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header