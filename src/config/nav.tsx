import {
  Calculator,
  CreditCard,
  LayoutDashboard,
  LineChart,
  PieChart,
  Users,
} from 'lucide-react'

export const navItems = [
  { label: 'Transactions', href: '/transactions', icon: LayoutDashboard },
  { label: 'Groups', href: '/groups', icon: Users },
  { label: 'Categories', href: '/categories', icon: PieChart },
  { label: 'Accounts', href: '/accounts', icon: CreditCard },
  { label: 'Budget', href: '/budget', icon: Calculator },
  { label: 'Charts', href: '/charts', icon: LineChart },
]
