import {
  Calculator,
  CreditCard,
  LayoutDashboard,
  LineChart,
  Users,
} from 'lucide-react'
import * as React from 'react'

// Needed to import icons that were missing
import { Sidebar } from '@/components/layout/sidebar'
import type { LucideIcon } from 'lucide-react'
import { PieChart } from 'lucide-react'
import { BottomNav } from './bottom-nav'
import { MobileHeader } from './header'

interface AppLayoutProps {
  children: React.ReactNode
  routeTitle?: string
  routeSubtitle?: string
  actionButton?: React.ReactNode
}

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export function AppLayout({
  children,
  routeTitle,
  routeSubtitle,
  actionButton,
}: AppLayoutProps) {
  const navItems: Array<NavItem> = [
    { label: 'Transactions', href: '/transactions', icon: LayoutDashboard },
    { label: 'Groups', href: '/groups', icon: Users },
    { label: 'Categories', href: '/categories', icon: PieChart },
    { label: 'Accounts', href: '/accounts', icon: CreditCard },
    { label: 'Budget', href: '/budget', icon: Calculator },
    { label: 'Charts', href: '/charts', icon: LineChart },
  ]

  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col font-sans md:h-dvh md:flex-row md:overflow-hidden">
      <Sidebar navItems={navItems} />

      {/* Main Content Area */}
      <main className="flex min-w-0 flex-1 flex-col md:overflow-hidden">
        <MobileHeader />

        <div className="flex flex-col flex-1 p-4 md:min-h-0 md:overflow-auto md:p-6">
          <div className="mx-auto w-full max-w-6xl flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-foreground text-2xl font-bold">
                  {routeTitle}
                </h1>
                <span className="text-muted-foreground text-sm">
                  {routeSubtitle}
                </span>
              </div>
              {actionButton}
            </div>
            {children}
          </div>
        </div>
      </main>

      <BottomNav navItems={navItems} />
    </div>
  )
}
