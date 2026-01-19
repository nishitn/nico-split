import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Wallet } from 'lucide-react'
import { z } from 'zod'
import { AppLayout } from '@/components/layout/app-layout'
import { MoneyCard } from '@/components/shared/money-card'
import { MonthYearPicker } from '@/components/shared/month-year-picker'
import { TransactionItem } from '@/components/shared/transaction-item'
import { useMonthlyStats, useTransactions } from '@/features/transactions/api'
import { useCurrentUser } from '@/features/users/api'
import { groupTransactionsByDate } from '@/lib/transactions-util'

// Schema for search params
const transactionsSearchSchema = z.object({
  month: z.number().optional(),
  year: z.number().optional(),
})

export const Route = createFileRoute('/transactions')({
  component: TransactionsPage,
  validateSearch: transactionsSearchSchema,
})

function TransactionsPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()

  // Default to current month/year if not present
  const currentDate = new Date()
  const month = search.month ?? currentDate.getMonth()
  const year = search.year ?? currentDate.getFullYear()

  const { data: user } = useCurrentUser()
  const { data: transactions, isLoading: isTransactionsLoading } =
    useTransactions(month, year)

  // Conditionally fetch stats only when user is available
  const { data: stats, isLoading: isStatsLoading } = useMonthlyStats(
    user,
    month,
    year,
  )

  const handleDateChange = (newMonth: number, newYear: number) => {
    navigate({
      search: { month: newMonth, year: newYear },
    })
  }

  if (!user)
    return <div className="flex justify-center p-8">Loading user...</div>

  const groupedTransactions = transactions
    ? groupTransactionsByDate(transactions, user)
    : []
  const isLoading = isTransactionsLoading || isStatsLoading

  return (
    <AppLayout
      headerAction={
        <MonthYearPicker
          month={month}
          year={year}
          onChange={handleDateChange}
        />
      }
    >
      <div className="flex flex-col gap-6 pb-20 md:pb-0">
        <h1 className="text-2xl font-bold tracking-tight md:hidden">
          Transactions
        </h1>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <MoneyCard title="Income" amount={stats?.income || 0} type="income" />
          <MoneyCard
            title="Expense"
            amount={stats?.expense || 0}
            type="expense"
          />
          <MoneyCard
            title="Owed"
            amount={stats?.owes || 0}
            type={stats?.owes && stats.owes < 0 ? 'expense' : 'income'} // Red if I owe, Green if owed to me (roughly)
            // Actually 'owes' in MonthlyStats: positive if I am owed, negative if I owe?
            // Let's check api.ts:
            // getUserAmounts -> owes is (userSplit - userPaid).
            // If I paid 1000 and split was 500. I am owed 500. (userPaid - userSplit) = 500 -> Wait logic in utils might be reversed or specific.
            // Utils: owes += userSplit - userPaid.
            // If I paid 1000 (userPaid), split 500 (userSplit). Owes = 500 - 1000 = -500.
            // So negative means I am OWED money? That seems counter-intuitive for "Owes".
            // Usually "Owes" means "I owe".
            // Let's re-read utils.ts.
            // getUserAmounts return { owes }.
            // If split (what I should pay) > paid (what I paid), result is positive. So I OWE money.
            // If split < paid, result is negative. So I am OWED money.
            // So Positive = Expense/Debt. Negative = Income/Credit.
            // So if stats.owes > 0 (I owe), should be red/expense color?
            // If stats.owes < 0 (I am owed), should be green/income color?
            // Let's stick to 'default' color or custom logic.
          />
        </div>

        {/* Specific Monthly Balance Card (Optional - user requested "monthly expense, income and balance along with monthly money owed")
            Balance = Income - Expense. 
            Money Card above covers Income, Expense. 
            Combined Balance could be useful.
        */}
        <div className="grid gap-4 md:grid-cols-1">
          <div className="bg-primary/10 border-primary/20 flex items-center justify-between rounded-xl border p-4">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm font-medium">
                Monthly Balance
              </span>
              <span className="text-primary text-2xl font-bold">
                {((stats?.income || 0) - (stats?.expense || 0)).toLocaleString(
                  'en-IN',
                  { style: 'currency', currency: 'INR' },
                )}
              </span>
            </div>
            <Wallet className="text-primary h-8 w-8 opacity-50" />
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">History</h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-muted h-16 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : groupedTransactions.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              No transactions found for this month.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {groupedTransactions.map((group) => (
                <div
                  key={group.date.toISOString()}
                  className="flex flex-col gap-2"
                >
                  {/* Date Header */}
                  <div className="bg-background/95 border-border/50 sticky top-[4rem] z-10 flex items-center justify-between border-b py-2 backdrop-blur">
                    <span className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                      {group.date.toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        weekday: 'short',
                      })}
                    </span>
                    <div className="flex items-center gap-3 text-xs font-medium">
                      {group.income > 0 && (
                        <span className="text-income">
                          +{group.income.toLocaleString()}
                        </span>
                      )}
                      {group.expense > 0 && (
                        <span className="text-expense">
                          -{group.expense.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Transactions */}
                  <div className="border-border bg-card overflow-hidden rounded-xl border px-4">
                    {group.transactions.map((tx) => (
                      <TransactionItem
                        key={tx.id}
                        transaction={tx}
                        user={user}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
