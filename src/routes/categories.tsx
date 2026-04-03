import {
  Outlet,
  createFileRoute,
  useChildMatches,
  useNavigate,
} from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import type { UUID } from 'node:crypto'
import type { ReactNode } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { CategoryRow } from '@/components/layout/category-row'
import { RouteToolbar } from '@/components/layout/route-toolbar'
import { ActionButton } from '@/components/ui/action-button'
import { CurrencySpan } from '@/components/ui/currency-span'
import { MonthNavigator } from '@/components/ui/month-navigator'
import { Separator } from '@/components/ui/separator'
import { SummaryCell } from '@/components/ui/summary-cell'
import { useCategoryStats } from '@/features/categories/api'
import { useMonthlyStats } from '@/features/transactions/api'
import { useCurrentUser } from '@/features/users/api'

const searchSchema = z.object({
  month: z.number().min(1).max(12).optional(),
  year: z.number().optional(),
})

export const Route = createFileRoute('/categories')({
  component: CategoriesPage,
  validateSearch: searchSchema,
})

function CategoriesPage() {
  const childMatches = useChildMatches()

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

  const { data: monthlyStats, isLoading: isLoadingMonthlyStats } =
    useMonthlyStats(user, month, year)

  const { data: categoryStats = [], isLoading: isLoadingCategoryStats } =
    useCategoryStats(user, month, year)

  // #endregion

  // #region Expand Categories Logic
  const [expandedCategories, setExpandedCategories] = useState<
    Record<UUID, boolean>
  >({})

  if (childMatches.length) {
    return <Outlet />
  }

  const toggleCategory = (categoryId: UUID) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  // #endregion

  // Sort by amount (highest spend first)
  const sortedCategoryStats = categoryStats.sort(
    (a, b) => Math.abs(b.amount) - Math.abs(a.amount),
  )

  let summaryStats: ReactNode
  if (isLoadingMonthlyStats) {
    summaryStats = <div className="text-muted-foreground p-4">Loading...</div>
  } else {
    summaryStats = (
      <CategorySummaryStats
        income={monthlyStats?.income || 0}
        expense={monthlyStats?.expense || 0}
      />
    )
  }

  let categoryList: ReactNode
  if (isLoadingCategoryStats) {
    categoryList = (
      <div className="text-muted-foreground border-border bg-card rounded-lg border border-dashed p-8 text-center">
        Loading groups...
      </div>
    )
  } else if (sortedCategoryStats.length === 0) {
    categoryList = (
      <div className="text-muted-foreground border-border bg-card rounded-lg border border-dashed p-8 text-center">
        No groups found.
      </div>
    )
  } else {
    // Only show top-level categories in the main list
    const topLevelStats = sortedCategoryStats.filter((cs) => !cs.isSubcategory)

    if (topLevelStats.length === 0) {
      categoryList = (
        <div className="text-muted-foreground border-border bg-card rounded-lg border border-dashed p-8 text-center">
          No categories found.
        </div>
      )
    } else {
      categoryList = topLevelStats.map((cs) => (
        <div key={cs.category.id} className="mb-4 break-inside-avoid">
          <CategoryRow
            categoryStat={cs}
            isExpanded={expandedCategories[cs.category.id]}
            onToggle={(id: UUID) => toggleCategory(id)}
          />
        </div>
      ))
    }
  }

  return (
    <AppLayout
      routeTitle="Categories"
      routeSubtitle="Spending breakdown by category"
      mobileAction={{ to: '/categories/form', text: 'New Category' }}
      actionButton={<ActionButton to="/categories/form" text="New Category" />}
    >
      <RouteToolbar>
        <MonthNavigator
          currentMonth={month}
          currentYear={year}
          setMonthYear={setMonthYear}
        />
        {summaryStats}
      </RouteToolbar>
      <div className="flex flex-col gap-6 pb-20 md:pb-8">
        <h1 className="text-lg font-semibold">Your Categories</h1>
        <div className="block columns-1 gap-4 md:columns-2 lg:columns-3">
          {categoryList}
        </div>
      </div>
    </AppLayout>
  )
}

interface CategorySummaryStatsProps {
  income: number
  expense: number
}

function CategorySummaryStats({ income, expense }: CategorySummaryStatsProps) {
  return (
    <div className="flex w-full flex-col justify-center gap-4 xl:w-auto xl:flex-row xl:justify-end xl:gap-8">
      <SummaryCell heading="Expense">
        <span className="text-expense font-bold">
          <CurrencySpan amount={expense} />
        </span>
      </SummaryCell>
      <Separator orientation="vertical" className="hidden xl:block" />
      <Separator className="block xl:hidden" />
      <SummaryCell heading="Income">
        <span className="text-income font-bold">
          <CurrencySpan amount={income} />
        </span>
      </SummaryCell>
    </div>
  )
}
