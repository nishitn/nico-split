import type { Account } from '@/features/accounts/types'
import type { Category, CategoryStat } from '@/features/categories/types'
import type { Chapter } from '@/features/chapters/types'
import type { Group, GroupBalance } from '@/features/groups/types'
import type {
  GroupSplitMetadata,
  GroupTransferMetadata,
  MonthlyStats,
  Transaction,
} from '@/features/transactions/types'
import {
  GroupTransactionType,
  TransactionScope,
} from '@/features/transactions/types'
import type { User } from '@/features/users/types'
import {
  mockAccounts,
  mockCategories,
  mockChapters,
  mockGroups,
  mockTransactions,
  mockUsers,
} from '@/lib/mock-data'
import { getSettlement, getUserAmounts, getUserOwes } from '@/lib/utils'

const DELAY = 150

const delay = (ms: number = DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  getCurrentUser: async (): Promise<User> => {
    await delay()
    return mockUsers[0]
  },

  getAccounts: async (): Promise<Array<Account>> => {
    await delay()
    return [...mockAccounts]
  },

  getCategories: async (): Promise<Array<Category>> => {
    await delay()
    return [...mockCategories]
  },

  getChapters: async (): Promise<Array<Chapter>> => {
    await delay()
    return [...mockChapters]
  },

  getGroups: async (): Promise<Array<Group>> => {
    await delay()
    return [...mockGroups]
  },

  getTransactions: async (
    month: number,
    year: number,
  ): Promise<Array<Transaction>> => {
    await delay()
    return mockTransactions.filter((tx) => {
      return (
        tx.dateTime.getMonth() === month && tx.dateTime.getFullYear() === year
      )
    })
  },

  getGroupBalances: async (
    user: User,
    month: number,
    year: number,
  ): Promise<Array<GroupBalance>> => {
    await delay()

    const groupBalances: Array<GroupBalance> = []

    for (const group of mockGroups) {
      const monthlyOwes: Record<string, number> = {}
      const overallOwes: Record<string, number> = {}

      const monthlyNet: Record<string, number> = {}
      const overallNet: Record<string, number> = {}

      group.members.forEach((member) => {
        monthlyNet[member.id] = 0
        overallNet[member.id] = 0
      })

      const groupTransactions = mockTransactions.filter(
        (transaction) =>
          transaction.scope === TransactionScope.GROUP &&
          transaction.group.id === group.id,
      )

      // Calculate net balances for each member
      groupTransactions.forEach((tx) => {
        const isCurrentMonth =
          tx.dateTime.getMonth() === month && tx.dateTime.getFullYear() === year

        if (tx.type === GroupTransactionType.SPLIT) {
          const { paidBy, split } = tx.groupMetadata as GroupSplitMetadata

          // Calculate net for each member (what they paid - what they owe)
          group.members.forEach((member) => {
            const net = getUserOwes(member, paidBy, split)
            overallNet[member.id] += net
            if (isCurrentMonth) monthlyNet[member.id] += net
          })
        } else if (tx.type === GroupTransactionType.TRANSFER) {
          const { paidBy, paidTo } = tx.groupMetadata as GroupTransferMetadata
          const amount = tx.amount

          // Payer has positive net (they are owed)
          overallNet[paidBy.id] -= amount
          if (isCurrentMonth) monthlyNet[paidBy.id] -= amount

          // Receiver has negative net (they owe)
          overallNet[paidTo.id] += amount
          if (isCurrentMonth) monthlyNet[paidTo.id] += amount
        }
      })

      // Use getSettlement to calculate optimal settlements
      const monthlySettlements = getSettlement(monthlyNet)
      const overallSettlements = getSettlement(overallNet)

      // Extract how much the given user owes to each member
      monthlySettlements.forEach((s) => {
        if (s.from === user.id) {
          monthlyOwes[s.to] = (monthlyOwes[s.to] || 0) + s.amount
        } else if (s.to === user.id) {
          monthlyOwes[s.from] = (monthlyOwes[s.from] || 0) - s.amount
        }
      })

      overallSettlements.forEach((s) => {
        if (s.from === user.id) {
          overallOwes[s.to] = (overallOwes[s.to] || 0) + s.amount
        } else if (s.to === user.id) {
          overallOwes[s.from] = (overallOwes[s.from] || 0) - s.amount
        }
      })

      groupBalances.push({
        group,
        monthlyOwes,
        overallOwes,
        balance: overallNet[user.id] || 0,
      })
    }

    return groupBalances
  },

  getMonthlyStats: async (
    user: User,
    month: number,
    year: number,
  ): Promise<MonthlyStats> => {
    await delay()

    const monthTxs = mockTransactions.filter((tx) => {
      return (
        tx.dateTime.getMonth() === month && tx.dateTime.getFullYear() === year
      )
    })

    const { income, expense, owes } = monthTxs.reduce(
      (acc, tx) => {
        const { income, expense, owes } = getUserAmounts(user, tx)
        acc.income += income
        acc.expense += expense
        acc.owes += owes
        return acc
      },
      { income: 0, expense: 0, owes: 0 },
    )

    return { income, expense, owes }
  },

  getCategoryStats: async (
    user: User,
    month: number,
    year: number,
  ): Promise<Array<CategoryStat>> => {
    await delay()

    const monthTxs = mockTransactions.filter((tx) => {
      return (
        tx.dateTime.getMonth() === month && tx.dateTime.getFullYear() === year
      )
    })

    const getAmountForCategory = (category: Category) => {
      return monthTxs
        .filter((tx) => {
          if (tx.scope === TransactionScope.PERSONAL) {
            return tx.metadata.category?.id === category.id
          }
          if (tx.scope === TransactionScope.GROUP) {
            if (tx.type === GroupTransactionType.SPLIT) {
              const groupMetadata = tx.groupMetadata as GroupSplitMetadata
              return groupMetadata.category?.id === category.id
            }
          }
        })
        .reduce((acc, tx) => {
          const { income, expense, owes: _ } = getUserAmounts(user, tx)
          acc = income - expense
          return acc
        }, 0)
    }

    const categories = [...mockCategories]

    const allSubCategoryIds = new Set(
      categories.flatMap((c) => c.subCategories),
    )

    const categoryStats: Array<CategoryStat> = categories.map((cat) => {
      const getStat = (c: Category): CategoryStat => ({
        category: c,
        amount: getAmountForCategory(c),
        isSubcategory: allSubCategoryIds.has(c.id),
        subcategories: [],
      })

      const subStats = cat.subCategories.map((subId) => {
        const subCat = categories.find((c) => c.id === subId)
        return getStat(subCat!)
      })

      const subCatSum = subStats.reduce((acc, s) => acc + s.amount, 0)

      return {
        ...getStat(cat),
        amount: getAmountForCategory(cat) + subCatSum,
        subcategories: subStats,
      }
    })

    return categoryStats.filter((c) => c.amount !== 0)
  },
}
