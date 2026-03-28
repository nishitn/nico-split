import { getActiveFormContext } from '@/components/layout/layout-route'
import type { NavItem } from '@/components/layout/app-layout'
import { MainLogo } from '@/components/layout/header'
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
import { useDatabaseTables } from '@/features/database/api'
import { authClient } from '@/lib/auth-client'
import { useCurrentUser } from '@/features/users/api'
import type { User } from '@/features/users/types'
import { Link, useLocation } from '@tanstack/react-router'
import { CircleUser, Database, LogOut, Settings } from 'lucide-react'
import { Suspense } from 'react'

export interface SidebarProps {
  navItems: Array<NavItem>
}

function ProfileSection({ currentUser }: { currentUser: User }) {
  const handleSignOut = async () => {
    await authClient.signOut()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-12 w-full cursor-pointer justify-start gap-2 p-2"
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
          <DropdownMenuItem className="flex w-full cursor-pointer items-center gap-4">
            <CircleUser className="h-4 w-4" /> Profile
          </DropdownMenuItem>
        </Link>
        <Link to=".">
          <DropdownMenuItem className="flex w-full cursor-pointer items-center gap-4">
            <Settings className="h-4 w-4" /> Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DatabaseSidebarSection({
  pathname,
  searchStr,
}: {
  pathname: string
  searchStr: string
}) {
  const isDatabaseRoute = pathname === '/database'
  const { data: tables = [] } = useDatabaseTables(isDatabaseRoute)

  if (!isDatabaseRoute || tables.length === 0) {
    return null
  }

  const activeTableName = new URLSearchParams(searchStr).get('table') ?? tables[0]?.name

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <Separator />
      <div className="flex items-center gap-2 px-2">
        <Database className="text-primary h-4 w-4" />
        <h2 className="text-sm font-semibold">Tables</h2>
      </div>
      <div className="flex min-h-0 flex-col gap-1 overflow-y-auto pr-1">
        {tables.map((table) => {
          const isActive = table.name === activeTableName

          return (
            <Link
              key={table.name}
              to="/database"
              search={{ table: table.name }}
              className={
                isActive
                  ? 'bg-primary/10 text-primary flex flex-col gap-1 rounded-lg px-3 py-2'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground flex flex-col gap-1 rounded-lg px-3 py-2 transition-colors'
              }
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">{table.name}</span>
                <span className="text-xs">{table.rowCount}</span>
              </div>
              <span className="text-xs opacity-80">
                {table.columns.length} columns
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function Sidebar({ navItems }: SidebarProps) {
  const { data: currentUser } = useCurrentUser()
  const location = useLocation()
  const activeForm = getActiveFormContext(location.pathname, location.searchStr)

  return (
    <aside className="border-sidebar-border bg-sidebar text-sidebar-foreground sticky top-0 hidden h-screen w-64 flex-col gap-4 border-r p-4 md:flex">
      <div className="flex flex-col">
        <MainLogo />
        <Separator />
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <div key={item.href} className="flex flex-col gap-1">
            <NavLink href={item.href}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
            {activeForm?.parentHref === item.href && (
              <div className="ml-5 flex items-stretch gap-3 pl-3">
                <div className="bg-border w-px self-stretch" />
                <div className="bg-primary/10 text-primary flex flex-1 items-center rounded-md px-3 py-2 text-sm font-medium">
                  <span>{activeForm.label}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      <DatabaseSidebarSection
        pathname={location.pathname}
        searchStr={location.searchStr}
      />

      <Separator />

      <Suspense fallback={<div>Loading...</div>}>
        <ProfileSection currentUser={currentUser} />
      </Suspense>
    </aside>
  )
}
