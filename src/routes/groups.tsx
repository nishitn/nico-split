import { AppLayout } from '@/components/layout/app-layout'
import { GroupRow } from '@/components/layout/group-row'
import { RouteToolbar } from '@/components/layout/route-toolbar'
import { ActionButton } from '@/components/ui/action-button'
import { CurrencySpan } from '@/components/ui/currency-span'
import { MonthNavigator } from '@/components/ui/month-navigator'
import { Separator } from '@/components/ui/separator'
import { SummaryCell } from '@/components/ui/summary-cell'
import { useGroupBalances } from '@/features/groups/api'
import { useCurrentUser } from '@/features/users/api'
import { cn, getOwesColor, getOwesText } from '@/lib/utils'
import {
  Outlet,
  createFileRoute,
  useChildMatches,
  useNavigate,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
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
  const childMatches = useChildMatches()

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
  const { data: groupBalances = [], isLoading: isLoadingBalances } =
    useGroupBalances(user, month, year)

  // #endregion

  if (childMatches.length > 0) {
    return <Outlet />
  }

  if (!user) return <div className="flex justify-center p-8">Loading...</div>

  // #region Calculate totals
  const totalMonthlyOwes = groupBalances.reduce((acc, gb) => {
    // Sum up what the user owes in this group for this month
    const groupMonthlyNet = Object.values(gb.monthlyOwes).reduce(
      (sum, amount) => sum + amount,
      0,
    )
    return acc + groupMonthlyNet
  }, 0)

  const totalOverallOwes = groupBalances.reduce((acc, gb) => {
    return acc + gb.balance
  }, 0)
  // #endregion

  let summaryStats: ReactNode
  if (isLoadingBalances) {
    summaryStats = <div className="text-muted-foreground p-4">Loading...</div>
  } else {
    summaryStats = (
      <GroupSummaryStats
        monthlyOwes={totalMonthlyOwes}
        overallOwes={totalOverallOwes}
      />
    )
  }

  let groupList: ReactNode
  if (isLoadingBalances) {
    groupList = (
      <div className="text-muted-foreground border-border bg-card rounded-lg border border-dashed p-8 text-center">
        Loading groups...
      </div>
    )
  } else if (groupBalances.length === 0) {
    groupList = (
      <div className="text-muted-foreground border-border bg-card rounded-lg border border-dashed p-8 text-center">
        No groups found.
      </div>
    )
  } else {
    groupList = (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {groupBalances.map((gb) => (
          <GroupRow key={gb.group.id} groupBalance={gb} />
        ))}
      </div>
    )
  }

  return (
    <AppLayout
      routeTitle="Groups"
      routeSubtitle="Balances across your shared groups"
      mobileAction={{ to: '/groups/form', text: 'New Group' }}
      actionButton={<ActionButton to="/groups/form" text="New Group" />}
    >
      <RouteToolbar>
        <MonthNavigator
          currentMonth={month}
          currentYear={year}
          setMonthYear={setMonthYear}
        />
        {summaryStats}
      </RouteToolbar>
      <div className="flex flex-col gap-4 pb-20 md:pb-0">
        <h1 className="text-lg font-semibold">Your Groups</h1>
        {groupList}
      </div>
    </AppLayout>
  )
}

interface GroupSummaryStatsProps {
  monthlyOwes: number
  overallOwes: number
}

function GroupSummaryStats({
  monthlyOwes,
  overallOwes,
}: GroupSummaryStatsProps) {
  const foregroundColor = 'text-card-foreground'
  const monthlyOwesColor = getOwesColor(monthlyOwes, foregroundColor)
  const monthlyOwesText = getOwesText(monthlyOwes)

  const overallOwesText = getOwesText(overallOwes)
  const overallOwesColor = getOwesColor(overallOwes, foregroundColor)

  return (
    <div className="flex w-full flex-col justify-center gap-4 xl:w-auto xl:flex-row xl:justify-end xl:gap-8">
      <SummaryCell heading="This Month">
        <span className={cn('font-bold', monthlyOwesColor)}>
          {monthlyOwesText} <CurrencySpan amount={monthlyOwes} />
        </span>
      </SummaryCell>
      <Separator orientation="vertical" className="hidden xl:block" />
      <Separator className="block xl:hidden" />
      <SummaryCell heading="Overall">
        <span className={cn('font-bold', overallOwesColor)}>
          {overallOwesText} <CurrencySpan amount={overallOwes} />
        </span>
      </SummaryCell>
    </div>
  )
}
