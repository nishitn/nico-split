import { AppLayout } from '@/components/layout/app-layout'
import { navItems } from '@/config/nav'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/more')({
  component: MorePage,
})

function MorePage() {
  const moreItems = navItems.slice(4)

  return (
    <AppLayout>
      <div className="flex flex-col gap-4 pb-20 md:pb-0">
        <h1 className="text-2xl font-bold tracking-tight md:hidden">More</h1>
        <div className="grid gap-2">
          {moreItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="bg-card border-border hover:bg-muted/50 flex items-center justify-between rounded-xl border p-4 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className="text-muted-foreground h-5 w-5" />
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
