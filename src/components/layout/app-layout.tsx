import { Link } from '@tanstack/react-router'
import {
  Calculator,
  CreditCard,
  LayoutDashboard,
  LineChart,
  Menu,
  MoreHorizontal,
  Users,
} from 'lucide-react'
import * as React from 'react'

// Needed to import icons that were missing
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'
import { PieChart } from 'lucide-react'

interface AppLayoutProps {
  children: React.ReactNode
  headerAction?: React.ReactNode
}

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export function AppLayout({ children, headerAction }: AppLayoutProps) {
  const navItems: Array<NavItem> = [
    { label: 'Transactions', href: '/transactions', icon: LayoutDashboard },
    { label: 'Groups', href: '/groups', icon: Users },
    { label: 'Categories', href: '/categories', icon: PieChart },
    { label: 'Accounts', href: '/accounts', icon: CreditCard },
    { label: 'Budget', href: '/budget', icon: Calculator },
    { label: 'Charts', href: '/charts', icon: LineChart },
  ]

  // Mobile Nav Toggle
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false)

  return (
    <div className="bg-background text-foreground flex h-screen flex-col overflow-hidden font-sans md:flex-row">
      {/* Sidebar - Desktop */}
      <Sidebar navItems={navItems} />

      {/* Main Content Area */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 flex h-16 items-center justify-between border-b px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="text-lg font-bold">MoneyMgr</span>
          </div>

          <div className="ml-auto flex items-center gap-4">{headerAction}</div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
      </main>

      {/* Mobile Navigation Bottom Bar (Using standard Tab Bar pattern for simplicity in mobile view or could use Sheet) 
          Let's use a Bottom Tab Bar for mobile which is very common in Money Apps
      */}
      <div className="border-border bg-background pb-safe fixed right-0 bottom-0 left-0 z-20 flex h-16 items-center justify-around border-t md:hidden">
        {navItems.slice(0, 4).map((item) => (
          <Link
            key={item.href}
            to={item.href}
            activeProps={{ className: 'text-primary' }}
            inactiveProps={{ className: 'text-muted-foreground' }}
            className="flex h-full w-full flex-col items-center justify-center gap-1"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}

        {navItems.length > 4 && (
          <Link
            to="/more"
            activeProps={{ className: 'text-primary' }}
            inactiveProps={{ className: 'text-muted-foreground' }}
            className="flex h-full w-full flex-col items-center justify-center gap-1"
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </Link>
        )}
      </div>
    </div>
  )
}
