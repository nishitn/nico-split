import { AppLayout } from '@/components/layout/app-layout'
import { RouteToolbar } from '@/components/layout/route-toolbar'
import { MoneyCard } from '@/components/shared/money-card'
import { MonthNavigator } from '@/components/ui/month-navigator'
import { useGroupBalances } from '@/features/groups/api'
import { useCurrentUser } from '@/features/users/api'
import { cn } from '@/lib/utils'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'

const groupsSearchSchema = z.object({
  month: z.number().min(1).max(12).optional(),
  year: z.number().optional(),
})

export const Route = createFileRoute('/groups')({
  component: GroupsPage,
  validateSearch: groupsSearchSchema,
})

function GroupsPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()

  const now = new Date()
  const month = search.month ? search.month - 1 : now.getMonth()
  const year = search.year ?? now.getFullYear()

  const { data: user } = useCurrentUser()
  const { data: groupBalances, isLoading } = useGroupBalances(user, month, year)

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

  if (!user) return <div className="flex justify-center p-8">Loading...</div>

  // Calculate totals
  // Calculate totals
  const totalMonthlyOwes =
    groupBalances?.reduce((acc, gb) => {
      // Sum up monthly owes where I owe someone
      const myMonthlyDebt = Object.entries(gb.monthlyOwes).reduce(
        (sum, [_uid, amount]) => {
          // If amount > 0, I owe them. If < 0, they owe me.
          return sum + amount
        },
        0,
      )
      return acc + myMonthlyDebt
    }, 0) || 0
  const totalOverallOwed =
    groupBalances?.reduce((acc, gb) => acc + gb.balance, 0) || 0

  return (
    <AppLayout
      routeTitle="Groups"
      routeSubtitle="Balances across your shared groups"
    >
      <RouteToolbar>
        <MonthNavigator
          currentMonth={month}
          currentYear={year}
          onMonthChange={handleDateChange}
        />
      </RouteToolbar>
      <div className="flex flex-col gap-6 pb-20 md:pb-0">
        <h1 className="text-2xl font-bold tracking-tight md:hidden">Groups</h1>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <MoneyCard
            title="Net Owed (Month)"
            amount={totalMonthlyOwes}
            type={totalMonthlyOwes > 0 ? 'expense' : 'income'}
            formatter={(val) =>
              Math.abs(val).toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
              }) + (totalMonthlyOwes > 0 ? ' (Dr)' : ' (Cr)')
            }
          />
          <MoneyCard
            title="Net Owed (Overall)"
            amount={totalOverallOwed}
            type={totalOverallOwed > 0 ? 'expense' : 'income'}
            formatter={(val) =>
              Math.abs(val).toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
              }) + (totalOverallOwed > 0 ? ' (Dr)' : ' (Cr)')
            }
          />
        </div>

        {/* Groups List */}
        <div className="grid gap-4 md:grid-cols-2">
          {isLoading ? (
            <div>Loading groups...</div>
          ) : (
            groupBalances?.map((gb) => (
              <div
                key={gb.group.id}
                className="border-border bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                    <gb.group.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{gb.group.label}</h3>
                    <p className="text-muted-foreground text-xs">
                      {gb.group.members.length} members
                    </p>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="bg-secondary/50 rounded-lg p-2">
                    <span className="text-muted-foreground block text-xs">
                      This Month
                    </span>
                    <span
                      className={cn(
                        'font-medium',
                        gb.balance > 0 ? 'text-expense' : 'text-income',
                      )}
                    >
                      {gb.balance > 0 ? 'You owe ' : 'Owes you '}
                      {Math.abs(gb.balance).toLocaleString('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-2">
                    <span className="text-muted-foreground block text-xs">
                      Overall
                    </span>
                    <span
                      className={cn(
                        'font-medium',
                        gb.balance > 0 ? 'text-expense' : 'text-income',
                      )}
                    >
                      {gb.balance > 0 ? 'You owe ' : 'Owes you '}
                      {Math.abs(gb.balance).toLocaleString('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  )
}
