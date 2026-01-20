import type { NavItem } from '@/components/layout/app-layout'
import { MainLogo } from '@/components/layout/header'
import { ModeToggle } from '@/components/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NavLink } from '@/components/ui/nav-link'
import { Separator } from '@/components/ui/separator'
import { useCurrentUser } from '@/features/users/api'
import { User } from '@/features/users/types'
import { Link } from '@tanstack/react-router'
import { CircleUser, LogOut, Settings } from 'lucide-react'
import { Suspense } from 'react'

export interface SidebarProps {
  navItems: Array<NavItem>
}

function ProfileSection({ currentUser }: { currentUser: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-12 w-full justify-start gap-2 p-2 cursor-pointer"
        >
          <Avatar className="h-8 w-8 items-center justify-center">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {currentUser.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-xs">
            <span className="font-medium">{currentUser.name}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to=".">
          <DropdownMenuItem className="flex items-center gap-4 w-full cursor-pointer">
            <CircleUser className="h-4 w-4" /> Profile
          </DropdownMenuItem>
        </Link>
        <Link to=".">
          <DropdownMenuItem className="flex items-center gap-4 w-full cursor-pointer">
            <Settings className="h-4 w-4" /> Settings
          </DropdownMenuItem>
        </Link>
        <ModeToggle />
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Sidebar({ navItems }: SidebarProps) {
  const { data: currentUser } = useCurrentUser()

  return (
    <aside className="border-sidebar-border bg-sidebar text-sidebar-foreground sticky top-0 hidden h-screen w-64 flex-col gap-4 border-r p-4 md:flex">
      <div className="flex flex-col">
        <MainLogo />
        <Separator />
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <NavLink key={item.href} href={item.href}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Separator />

      <Suspense fallback={<div>Loading...</div>}>
        <ProfileSection currentUser={currentUser} />
      </Suspense>
    </aside>
  )
}
