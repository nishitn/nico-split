import { AppLayout } from '@/components/layout/app-layout'
import { RouteToolbar } from '@/components/layout/route-toolbar'
import { MonthNavigator } from '@/components/ui/month-navigator'
import { useCategoryStats } from '@/features/categories/api'
import { useCurrentUser } from '@/features/users/api'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  month: z.number().min(1).max(12).optional(),
  year: z.number().optional(),
})

export const Route = createFileRoute('/categories')({
  component: CategoriesPage,
  validateSearch: searchSchema,
})

function CategoriesPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()

  const now = new Date()
  const month = search.month ? search.month - 1 : now.getMonth()
  const year = search.year ?? now.getFullYear()

  const { data: user } = useCurrentUser()
  const { data: stats, isLoading } = useCategoryStats(user, month, year)

  const handleDateChange = (newMonth: number, newYear: number) => {
    const isCurrent =
      newMonth === now.getMonth() && newYear === now.getFullYear()
    navigate({
      search: {
        month: isCurrent ? undefined : newMonth + 1,
        year: isCurrent ? undefined : newYear,
      },
    })
  }

  if (!user) return <div>Loading...</div>

  // Sort by amount (highest spend first)
  // Sort by amount (highest spend first)
  const sortedStats = [...(stats || [])].sort(
    (a, b) => Math.abs(b.amount) - Math.abs(a.amount),
  )
  const totalSpent = sortedStats.reduce(
    (acc, curr) => acc + (curr.amount < 0 ? Math.abs(curr.amount) : 0),
    0,
  )

  return (
    <AppLayout
      routeTitle="Categories"
      routeSubtitle="Spending breakdown by category"
    >
      <RouteToolbar>
        <MonthNavigator
          currentMonth={month}
          currentYear={year}
          onMonthChange={handleDateChange}
        />
      </RouteToolbar>

      <div className="bg-primary/10 flex flex-col items-center justify-center gap-2 rounded-2xl p-6">
        <span className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          Total Spent
        </span>
        <span className="text-primary text-4xl font-bold">
          {totalSpent.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
          })}
        </span>
        <span className="text-muted-foreground text-xs">
          in{' '}
          {new Date(year, month).toLocaleString('default', { month: 'long' })}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div>Loading stats...</div>
        ) : (
          <div className="space-y-4">
            {sortedStats.map((stat) => {
              const amount = stat.amount
              const isExpense = amount < 0
              const absAmount = Math.abs(amount)
              const percentage =
                totalSpent > 0 && isExpense ? (absAmount / totalSpent) * 100 : 0

              return (
                <div
                  key={stat.category.id}
                  className="bg-card border-border rounded-xl border p-4"
                >
                  <div className="mb-2 flex items-center gap-4">
                    <div className="bg-secondary flex h-10 w-10 items-center justify-center rounded-full">
                      <stat.category.icon className="h-5 w-5 opacity-70" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          {stat.category.label}
                        </span>
                        <span
                          className={
                            amount < 0 ? 'text-expense' : 'text-income'
                          }
                        >
                          {amount.toLocaleString('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                          })}
                        </span>
                      </div>
                      {isExpense && (
                        <div className="bg-secondary mt-2 h-1.5 w-full overflow-hidden rounded-full">
                          <div
                            className="bg-primary/70 h-full rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
