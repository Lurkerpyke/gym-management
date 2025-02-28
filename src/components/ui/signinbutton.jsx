'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  GearIcon,
  ExitIcon,
} from '@radix-ui/react-icons'

const SignInButton = () => {
  const { data: session } = useSession()

  return (
    <>
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-secondary/80"
            >
              {session?.user?.image ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={session.user.image}
                    alt={session.user.name || 'User avatar'}
                  />
                  <AvatarFallback>
                    {session.user.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {session.user.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-full p-2 flex flex-col justify-center items-start">
            <div className="flex items-center gap-4 p-2">
              <Avatar className="h-10 w-10">
                {session?.user?.image ? (
                  <AvatarImage
                    src={session.user.image}
                    alt={session.user.name || 'User avatar'}
                  />
                ) : (
                  <AvatarFallback>
                    {session.user.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {session.user.name || 'User name'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </div>

            <DropdownMenuItem asChild>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer w-full"
              >
                <GearIcon className="h-4 w-4" />
                <span>Manage Account</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => signOut()}
              className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer w-full"
            >
              <ExitIcon className="h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="outline"
          className="rounded-md"
          onClick={() => signIn()}
        >
          Sign In
        </Button>
      )}
    </>
  )
}

export default SignInButton