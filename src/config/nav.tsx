import {
  Calculator,
  Grid2X2Plus,
  LayoutDashboard,
  LineChart,
  PiggyBank,
  Users,
} from 'lucide-react'

export const navItems = [
  { label: 'Transactions', href: '/transactions', icon: LayoutDashboard },
  { label: 'Groups', href: '/groups', icon: Users },
  { label: 'Categories', href: '/categories', icon: Grid2X2Plus },
  { label: 'Accounts', href: '/accounts', icon: PiggyBank },
  { label: 'Budget', href: '/budget', icon: Calculator },
  { label: 'Charts', href: '/charts', icon: LineChart },
]
