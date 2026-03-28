import { getActiveFormContext } from '@/components/layout/layout-route'
import type { NavItem } from '@/components/layout/app-layout'
import { NavLink } from '@/components/ui/nav-link'
import { useLocation } from '@tanstack/react-router'
import { MoreHorizontal } from 'lucide-react'

export interface BottomNavProps {
  navItems: Array<NavItem>
}

export function BottomNav({ navItems }: BottomNavProps) {
  const location = useLocation()
  const activeForm = getActiveFormContext(location.pathname, location.searchStr)

  if (activeForm) {
    return null
  }

  return (
    <div className="border-border bg-background pb-safe fixed right-0 bottom-0 left-0 z-20 flex h-16 items-center justify-around border-t md:hidden">
      {navItems.slice(0, 4).map((item) => (
        <NavLink key={item.href} href={item.href}>
          <item.icon className="h-4 w-4" />
          <span className="text-xs font-medium">{item.label}</span>
        </NavLink>
      ))}

      {navItems.length > 4 && (
        <NavLink href="/more">
          <MoreHorizontal className="h-4 w-4" />
          <span className="text-xs font-medium">More</span>
        </NavLink>
      )}
    </div>
  )
}
