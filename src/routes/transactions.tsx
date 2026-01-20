import { AppLayout } from '@/components/layout/app-layout'
import { RouteToolbar } from '@/components/layout/route-toolbar'
import { TransactionItem } from '@/components/shared/transaction-item'
import { ActionButton } from '@/components/ui/action-button'
import { CurrencySpan } from '@/components/ui/currency-span'
import { MonthNavigator } from '@/components/ui/month-navigator'
import { Separator } from '@/components/ui/separator'
import { SummaryCell } from '@/components/ui/summary-cell'
import { useMonthlyStats, useTransactions } from '@/features/transactions/api'
import { useCurrentUser } from '@/features/users/api'
import { groupTransactionsByDate } from '@/lib/transactions-util'
import { cn, getAmountsColor, getOwesColor, getOwesText } from '@/lib/utils'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ReactNode, useMemo } from 'react'
import { z } from 'zod'

// Schema for search params
const transactionsSearchSchema = z.object({
  month: z.number().min(1).max(12).optional(),
  year: z.number().optional(),
})

export const Route = createFileRoute('/transactions')({
  component: TransactionsPage,
  validateSearch: transactionsSearchSchema,
})

function TransactionsPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()

  // #region Get Date from search params or use current date
  const currentDate = new Date()
  const month = search.month ? search.month - 1 : currentDate.getMonth()
  const year = search.year ?? currentDate.getFullYear()

  const setMonthYear = (newMonth: number, newYear: number) => {
    const isCurrent =
      newMonth === currentDate.getMonth() &&
      newYear === currentDate.getFullYear()
    navigate({
      search: {
        month: isCurrent ? undefined : newMonth + 1,
        year: isCurrent ? undefined : newYear,
      },
    })
  }

  // #endregion

  // #region Load Data
  const { data: user } = useCurrentUser()
  const { data: transactions = [], isLoading: isTransactionsLoading } =
    useTransactions(month, year)

  if (!user)
    return <div className="flex justify-center p-8">Loading user...</div>

  const { data: stats, isLoading: isStatsLoading } = useMonthlyStats(
    user,
    month,
    year,
  )

  const dayWiseTransactions = useMemo(
    () => groupTransactionsByDate(transactions, user),
    [transactions, user],
  )

  // #endregion

  let summaryStats: ReactNode
  if (isStatsLoading) {
    summaryStats = (
      <div className="flex justify-center p-8">Loading stats...</div>
    )
  } else {
    const totalIncome = stats?.income || 0
    const totalExpense = stats?.expense || 0
    const totalOwes = stats?.owes || 0

    summaryStats = (
      <TransactionSummaryStats
        income={totalIncome}
        expense={totalExpense}
        owes={totalOwes}
        balance={totalIncome - totalExpense}
      />
    )
  }

  const isLoading = isTransactionsLoading || isStatsLoading

  return (
    <AppLayout
      routeTitle="Dashboard"
      routeSubtitle="Overview of your monthly transactions"
      actionButton={
        <ActionButton to="/transactions/new" text="New Transaction" />
      }
    >
      <RouteToolbar>
        <MonthNavigator
          currentMonth={month}
          currentYear={year}
          setMonthYear={setMonthYear}
        />
        {summaryStats}
      </RouteToolbar>

      <div className="flex flex-col gap-6 pb-20 md:pb-0">
        <h1 className="text-lg font-semibold">Transactions</h1>

        {/* Transactions List */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-muted h-16 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : dayWiseTransactions.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              No transactions found for this month.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {dayWiseTransactions.map((group) => (
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

interface TransactionSummaryStatsProps {
  income: number
  expense: number
  owes: number
  balance: number
}

function TransactionSummaryStats({
  income,
  expense,
  owes,
  balance,
}: TransactionSummaryStatsProps) {
  const foregroundColor = 'text-card-foreground'
  const balanceColor = getAmountsColor(balance, foregroundColor)
  const owesColor = getOwesColor(owes, foregroundColor)
  const owesText = getOwesText(owes)

  return (
    <div className="flex flex-col justify-center gap-4 w-full xl:w-auto xl:flex-row">
      <div className="flex flex-row justify-center gap-4 xl:w-auto xl:justify-end">
        <SummaryCell heading="Expense">
          <span className="font-bold text-expense">
            <CurrencySpan amount={expense} />
          </span>
        </SummaryCell>
        <Separator orientation="vertical" />
        <SummaryCell heading="Income">
          <span className="font-bold text-income">
            <CurrencySpan amount={income} />
          </span>
        </SummaryCell>
      </div>
      <Separator orientation="vertical" className="hidden xl:block" />
      <Separator className="xl:hidden" />
      <SummaryCell heading="Balance">
        <span className={cn('font-bold', balanceColor)}>
          {balance >= 0 ? '+' : '-'}
          <CurrencySpan amount={balance} />
        </span>
        {owesText && (
          <span className={cn('text-sm font-bold', owesColor)}>
            {owesText}
            <CurrencySpan amount={owes} />
          </span>
        )}
      </SummaryCell>
    </div>
  )
}
