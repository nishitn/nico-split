import { AccountRow } from '@/components/layout/account-row'
import { AppLayout } from '@/components/layout/app-layout'
import { PeopleRow } from '@/components/layout/people-row'
import { RouteToolbar } from '@/components/layout/route-toolbar'
import { ActionButton } from '@/components/ui/action-button'
import { CurrencySpan } from '@/components/ui/currency-span'
import { Separator } from '@/components/ui/separator'
import { SummaryCell } from '@/components/ui/summary-cell'
import { useAccounts } from '@/features/accounts/api'
import { useCurrentUser, usePeopleBalances } from '@/features/users/api'
import { cn, getAmountsColor, getOwesColor, getOwesText } from '@/lib/utils'
import {
  createFileRoute,
  Outlet,
  useChildMatches,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/accounts')({
  component: AccountsPage,
})

function AccountsPage() {
  // #region Load Data
  const { data: user } = useCurrentUser()
  const { data: accounts = [], isLoading: isLoadingAccounts } = useAccounts()
  const { data: peopleBalances = [], isLoading: isLoadingPeople } =
    usePeopleBalances(user)

  // #endregion

  const childMatches = useChildMatches()
  if (childMatches.length > 0) {
    return <Outlet />
  }

  // #region Calculate Stats
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  const totalYouOwe = peopleBalances
    .filter((p) => p.owes > 0)
    .reduce((acc, p) => acc + p.owes, 0)

  const totalLent = peopleBalances
    .filter((p) => p.owes < 0)
    .reduce((acc, p) => acc + Math.abs(p.owes), 0)

  // #endregion

  let summaryStats: ReactNode
  if (isLoadingAccounts || isLoadingPeople) {
    summaryStats = <div className="text-muted-foreground p-4">Loading...</div>
  } else {
    summaryStats = (
      <AccountsSummaryStats
        totalBalance={totalBalance}
        totalOwe={totalYouOwe + totalLent}
      />
    )
  }

  let accountList: ReactNode
  if (isLoadingAccounts) {
    accountList = (
      <div className="text-muted-foreground border-border bg-card rounded-lg border border-dashed p-8 text-center">
        Loading accounts...
      </div>
    )
  } else if (accounts.length === 0) {
    accountList = (
      <div className="text-muted-foreground border-border bg-card rounded-lg border border-dashed p-8 text-center">
        No Accounts Found
      </div>
    )
  } else {
    accountList = (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <AccountRow key={account.id} account={account} />
        ))}
      </div>
    )
  }

  let peopleList: ReactNode
  if (isLoadingPeople) {
    peopleList = (
      <div className="text-muted-foreground border-border bg-card rounded-lg border border-dashed p-8 text-center">
        Loading people...
      </div>
    )
  } else if (peopleBalances.length === 0) {
    peopleList = (
      <div className="text-muted-foreground border-border bg-card rounded-lg border border-dashed p-8 text-center">
        No shared balances with anyone.
      </div>
    )
  } else {
    peopleList = (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {peopleBalances.map((pb) => (
          <PeopleRow key={pb.user.id} peopleBalance={pb} />
        ))}
      </div>
    )
  }

  return (
    <AppLayout
      routeTitle="Accounts"
      routeSubtitle="Your balances and debts"
      mobileAction={{ to: '/accounts/form', text: 'New Account' }}
      actionButton={<ActionButton to="/accounts/form" text="New Account" />}
    >
      <RouteToolbar>{summaryStats}</RouteToolbar>

      <div className="flex flex-col gap-8 pb-20 md:pb-8">
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Your Accounts</h2>
          {accountList}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">People</h2>
          {peopleList}
        </section>
      </div>
    </AppLayout>
  )
}

interface AccountsSummaryStatsProps {
  totalBalance: number
  totalOwe: number
}

function AccountsSummaryStats({
  totalBalance,
  totalOwe,
}: AccountsSummaryStatsProps) {
  const balanceColor = getAmountsColor(totalBalance, 'text-card-foreground')
  const owesColor = getOwesColor(totalOwe, 'text-card-foreground')
  const owesText = getOwesText(totalOwe)

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-4 xl:w-auto xl:flex-row xl:justify-end xl:gap-8">
      <SummaryCell heading="Total Balance">
        <span className={cn(balanceColor, 'font-bold')}>
          <CurrencySpan amount={totalBalance} showSign={true} />
        </span>
      </SummaryCell>
      <Separator orientation="vertical" className="hidden xl:block" />
      <Separator className="block xl:hidden" />
      <SummaryCell heading="You Owe">
        <span className={cn(owesColor, 'font-bold')}>
          {owesText} <CurrencySpan amount={totalOwe} />
        </span>
      </SummaryCell>
    </div>
  )
}
