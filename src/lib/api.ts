import { Account } from '@/features/accounts/types'
import { Category, CategoryStats } from '@/features/categories/types'
import { Chapter } from '@/features/chapters/types'
import { Group, GroupBalance } from '@/features/groups/types'
import {
  GroupSplitMetadata,
  GroupTransactionType,
  GroupTransferMetadata,
  MonthlyStats,
  Transaction,
  TransactionScope,
} from '@/features/transactions/types'
import { User } from '@/features/users/types'
import {
  mockAccounts,
  mockCategories,
  mockChapters,
  mockGroups,
  mockTransactions,
  mockUsers,
} from './mock-data'
import { getSettlement, getUserAmounts, getUserOwes } from './utils'

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
          monthlyOwes[s.to] += s.amount
        } else if (s.to === user.id) {
          monthlyOwes[s.from] -= s.amount
        }
      })

      overallSettlements.forEach((s) => {
        if (s.from === user.id) {
          overallOwes[s.to] += s.amount
        } else if (s.to === user.id) {
          overallOwes[s.from] -= s.amount
        }
      })

      groupBalances.push({
        group,
        monthlyOwes,
        overallOwes,
        balance: overallOwes[user.id] || 0,
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
  ): Promise<Array<CategoryStats>> => {
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

    const categoryStats: Array<CategoryStats> = categories.map((cat) => {
      const subCatSum = cat.subCategories
        .map((subCatId) => {
          const subCat = mockCategories.find((cat) => cat.id === subCatId)
          return getAmountForCategory(subCat!!)
        })
        .reduce((acc, amount) => {
          acc += amount
          return acc
        }, 0)

      return {
        category: cat,
        amount: getAmountForCategory(cat) + subCatSum,
      }
    })

    return categoryStats
  },
}
