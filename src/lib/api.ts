import {
  getAccounts as getAccountsServer,
  getCategories as getCategoriesServer,
  getCategoryStats as getCategoryStatsServer,
  getChapters as getChaptersServer,
  getCurrentUser as getCurrentUserServer,
  getDatabaseTablePreview as getDatabaseTablePreviewServer,
  getDatabaseTables as getDatabaseTablesServer,
  getGroupBalances as getGroupBalancesServer,
  getGroups as getGroupsServer,
  getMonthlyStats as getMonthlyStatsServer,
  getPeopleBalances as getPeopleBalancesServer,
  getTransactions as getTransactionsServer,
  getUsers as getUsersServer,
} from '../../backend/functions'
import type {
  AccountDto,
  CategoryDto,
  CategoryStatDto,
  ChapterDto,
  DatabaseTableDto,
  DatabaseTablePreviewDto,
  GroupBalanceDto,
  GroupDto,
  MonthlyStatsDto,
  PeopleBalanceDto,
  TransactionDto,
  UserDto,
} from '../../backend/contracts'
import type { Account } from '@/features/accounts/types'
import { AccountType, Currency } from '@/features/accounts/types'
import type { Category, CategoryStat } from '@/features/categories/types'
import { CategoryType } from '@/features/categories/types'
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
  PersonalTransactionType,
  TransactionScope,
} from '@/features/transactions/types'
import type { PeopleBalance, User } from '@/features/users/types'
import { getIcon } from '@/lib/icon-map'
import type { UUID } from 'crypto'

const asUuid = (value: string) => value as UUID

function hydrateUser(user: UserDto): User {
  return {
    id: asUuid(user.id),
    name: user.name,
  }
}

function hydrateAccount(account: AccountDto): Account {
  return {
    id: asUuid(account.id),
    label: account.label,
    type: account.type as AccountType,
    icon: getIcon(account.iconName),
    currency: account.currency as Currency,
    balance: account.balance,
  }
}

function hydrateCategory(category: CategoryDto): Category {
  return {
    id: asUuid(category.id),
    label: category.label,
    type: category.type as CategoryType,
    icon: getIcon(category.iconName),
    subCategories: category.subCategories.map(asUuid),
  }
}

function hydrateChapter(chapter: ChapterDto): Chapter {
  return {
    id: asUuid(chapter.id),
    label: chapter.label,
  }
}

function hydrateGroup(group: GroupDto): Group {
  return {
    id: asUuid(group.id),
    label: group.label,
    icon: getIcon(group.iconName),
    members: group.members.map(hydrateUser),
  }
}

function hydrateCategoryStat(categoryStat: CategoryStatDto): CategoryStat {
  return {
    category: hydrateCategory(categoryStat.category),
    amount: categoryStat.amount,
    isSubcategory: categoryStat.isSubcategory,
    subcategories: categoryStat.subcategories.map(hydrateCategoryStat),
  }
}

function hydrateGroupBalance(groupBalance: GroupBalanceDto): GroupBalance {
  return {
    group: hydrateGroup(groupBalance.group),
    monthlyOwes: groupBalance.monthlyOwes,
    overallOwes: groupBalance.overallOwes,
    balance: groupBalance.balance,
  }
}

function hydrateTransaction(transaction: TransactionDto): Transaction {
  const baseTransaction = {
    id: asUuid(transaction.id),
    dateTime: new Date(transaction.dateTime),
    currency: transaction.currency as Currency,
    amount: transaction.amount,
    note: transaction.note,
    createdBy: hydrateUser(transaction.createdBy),
  }

  if (transaction.scope === 'personal') {
    return {
      ...baseTransaction,
      scope: TransactionScope.PERSONAL,
      type: transaction.type as PersonalTransactionType,
      metadata: {
        account: hydrateAccount(transaction.metadata.account),
        category: transaction.metadata.category
          ? hydrateCategory(transaction.metadata.category)
          : undefined,
        toAccount: transaction.metadata.toAccount
          ? hydrateAccount(transaction.metadata.toAccount)
          : undefined,
      },
    }
  }

  return {
    ...baseTransaction,
    group: hydrateGroup(transaction.group),
    scope: TransactionScope.GROUP,
    type: transaction.type as GroupTransactionType,
    groupMetadata:
      transaction.type === GroupTransactionType.SPLIT
        ? ({
            paidBy: transaction.groupMetadata.paidBy,
            split: transaction.groupMetadata.split,
            category: transaction.groupMetadata.category
              ? hydrateCategory(transaction.groupMetadata.category)
              : undefined,
          } satisfies GroupSplitMetadata)
        : ({
            paidBy: hydrateUser(transaction.groupMetadata.paidBy),
            paidTo: hydrateUser(transaction.groupMetadata.paidTo),
          } satisfies GroupTransferMetadata),
    userMetadata: {
      account: hydrateAccount(transaction.userMetadata.account),
      category: transaction.userMetadata.category
        ? hydrateCategory(transaction.userMetadata.category)
        : undefined,
      toAccount: transaction.userMetadata.toAccount
        ? hydrateAccount(transaction.userMetadata.toAccount)
        : undefined,
    },
  }
}

function hydrateMonthlyStats(stats: MonthlyStatsDto): MonthlyStats {
  return stats
}

function hydratePeopleBalance(balance: PeopleBalanceDto): PeopleBalance {
  return {
    user: hydrateUser(balance.user),
    owes: balance.owes,
  }
}

function hydrateDatabaseTable(table: DatabaseTableDto) {
  return table
}

function hydrateDatabaseTablePreview(preview: DatabaseTablePreviewDto) {
  return preview
}

export const api = {
  getUsers: async (): Promise<Array<User>> => {
    return (await getUsersServer()).map(hydrateUser)
  },

  getCurrentUser: async (): Promise<User> => {
    return hydrateUser(await getCurrentUserServer())
  },

  getAccounts: async (): Promise<Array<Account>> => {
    return (await getAccountsServer()).map(hydrateAccount)
  },

  getCategories: async (): Promise<Array<Category>> => {
    return (await getCategoriesServer()).map(hydrateCategory)
  },

  getChapters: async (): Promise<Array<Chapter>> => {
    return (await getChaptersServer()).map(hydrateChapter)
  },

  getGroups: async (): Promise<Array<Group>> => {
    return (await getGroupsServer()).map(hydrateGroup)
  },

  getTransactions: async (
    month: number,
    year: number,
  ): Promise<Array<Transaction>> => {
    return (
      await getTransactionsServer({
        data: {
          month,
          year,
        },
      })
    ).map(hydrateTransaction)
  },

  getGroupBalances: async (
    user: User,
    month: number,
    year: number,
  ): Promise<Array<GroupBalance>> => {
    return (
      await getGroupBalancesServer({
        data: {
          userId: user.id,
          month,
          year,
        },
      })
    ).map(hydrateGroupBalance)
  },

  getMonthlyStats: async (
    user: User,
    month: number,
    year: number,
  ): Promise<MonthlyStats> => {
    return hydrateMonthlyStats(
      await getMonthlyStatsServer({
        data: {
          userId: user.id,
          month,
          year,
        },
      }),
    )
  },

  getCategoryStats: async (
    user: User,
    month: number,
    year: number,
  ): Promise<Array<CategoryStat>> => {
    return (
      await getCategoryStatsServer({
        data: {
          userId: user.id,
          month,
          year,
        },
      })
    ).map(hydrateCategoryStat)
  },

  getPeopleBalances: async (user: User): Promise<Array<PeopleBalance>> => {
    return (
      await getPeopleBalancesServer({
        data: {
          userId: user.id,
        },
      })
    ).map(hydratePeopleBalance)
  },

  getDatabaseTables: async () => {
    return (await getDatabaseTablesServer()).map(hydrateDatabaseTable)
  },

  getDatabaseTablePreview: async (tableName: string, limit = 25) => {
    return hydrateDatabaseTablePreview(
      await getDatabaseTablePreviewServer({
        data: {
          tableName,
          limit,
        },
      }),
    )
  },
}
