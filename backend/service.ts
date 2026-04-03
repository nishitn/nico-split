import { getDatabase } from '@db/database'
import type { CategoryDto, CategoryStatDto } from './dto/category-dto'
import type {
  DatabaseTableDto,
  DatabaseTablePreviewDto,
} from './dto/database-dto'
import type {
  GroupBalanceDto,
  GroupSplitMetadataDto,
  GroupTransferMetadataDto,
} from './dto/group-dto'
import type { PeopleBalanceDto } from './dto/people-balance-dto'
import type {
  GroupTransactionDto,
  MonthlyStatsDto,
  TransactionDto,
} from './dto/transaction-dto'
import {
  loadAccounts,
  loadCategories,
  loadChapters,
  loadFriends,
  loadGroups,
  loadTransactions,
  loadUsers,
} from './repository'
import type { UserRecord } from './schema'
import { ensureUserSeedData } from './seed'

function isGroupSplitMetadataDto(
  groupMetadata: GroupTransactionDto['groupMetadata'],
): groupMetadata is GroupSplitMetadataDto {
  return 'split' in groupMetadata
}

function isGroupTransferMetadataDto(
  groupMetadata: GroupTransactionDto['groupMetadata'],
): groupMetadata is GroupTransferMetadataDto {
  return 'paidTo' in groupMetadata
}

function isGroupTransactionDto(
  transaction: TransactionDto,
): transaction is GroupTransactionDto {
  return transaction.scope === 'group'
}

function getUserOwes(
  user: UserRecord,
  paidBy: Record<string, number>,
  split: Record<string, number>,
) {
  const userPaid = paidBy[user.id] || 0
  const userSplit = split[user.id] || 0

  return userSplit - userPaid
}

function getUserAmounts(user: UserRecord, transaction: TransactionDto) {
  let income = 0
  let expense = 0
  let owes = 0

  if (transaction.scope === 'personal') {
    if (transaction.type === 'income') {
      income += transaction.amount
    } else if (transaction.type === 'expense') {
      expense += transaction.amount
    }
  } else if (isGroupSplitMetadataDto(transaction.groupMetadata)) {
    const userPaid = transaction.groupMetadata.paidBy[user.id] || 0
    const userSplit = transaction.groupMetadata.split[user.id] || 0
    expense += userPaid
    owes += userSplit - userPaid
  } else if (isGroupTransferMetadataDto(transaction.groupMetadata)) {
    if (transaction.groupMetadata.paidBy.id === user.id) {
      expense += transaction.amount
      owes -= transaction.amount
    }
    if (transaction.groupMetadata.paidTo.id === user.id) {
      income += transaction.amount
      owes += transaction.amount
    }
  }

  return { income, expense, owes }
}

function getSettlement(net: Record<string, number>) {
  const debtors = Object.entries(net)
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([userId, amount]) => ({ userId, amount }))
  const creditors = Object.entries(net)
    .filter(([, amount]) => amount < 0)
    .sort((a, b) => a[1] - b[1])
    .map(([userId, amount]) => ({ userId, amount: -amount }))
  const settlements: Array<{ from: string; to: string; amount: number }> = []

  let debtorIndex = 0
  let creditorIndex = 0

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex]
    const creditor = creditors[creditorIndex]
    const settledAmount = Math.min(debtor.amount, creditor.amount)

    settlements.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: settledAmount,
    })

    debtor.amount -= settledAmount
    creditor.amount -= settledAmount

    if (debtor.amount === 0) {
      debtorIndex += 1
    }

    if (creditor.amount === 0) {
      creditorIndex += 1
    }
  }

  return settlements
}

function isInMonth(transaction: TransactionDto, month: number, year: number) {
  const date = new Date(transaction.dateTime)

  return date.getMonth() === month && date.getFullYear() === year
}

function loadAppData(userId: string) {
  ensureUserSeedData(userId)
  const users = loadUsers()
  const accounts = loadAccounts(userId)
  const categories = loadCategories(userId)
  const chapters = loadChapters(userId)
  const groups = loadGroups(userId, users)
  const transactions = loadTransactions(
    userId,
    users,
    accounts,
    categories,
    groups,
  )

  return { users, accounts, categories, chapters, groups, transactions }
}

function getUserById(userId: string) {
  const { users } = loadAppData(userId)
  const user = users.find((candidate) => candidate.id === userId)

  if (!user) {
    throw new Error(`Unknown user ${userId}`)
  }

  return user
}

function getAmountForCategory(
  category: CategoryDto,
  user: UserRecord,
  transactions: Array<TransactionDto>,
) {
  return transactions
    .filter((transaction) => {
      if (transaction.scope === 'personal') {
        return transaction.metadata.category?.id === category.id
      }

      if (isGroupSplitMetadataDto(transaction.groupMetadata)) {
        return transaction.userMetadata.category?.id === category.id
      }

      return false
    })
    .reduce((sum, transaction) => {
      const { income, expense } = getUserAmounts(user, transaction)
      return sum + income - expense
    }, 0)
}

export function getUsers() {
  return loadUsers()
}

export function getFriends(userId: string) {
  return loadFriends(userId)
}

export function getCurrentUser(userId: string) {
  return getUserById(userId)
}

export function getAccounts(userId: string) {
  return loadAccounts(userId)
}

export function getCategories(userId: string) {
  return loadCategories(userId)
}

export function getChapters(userId: string) {
  return loadChapters(userId)
}

export function getGroups(userId: string) {
  return loadGroups(userId, loadUsers())
}

export function getTransactions(userId: string, month: number, year: number) {
  const { transactions } = loadAppData(userId)
  return transactions.filter((transaction) =>
    isInMonth(transaction, month, year),
  )
}

export function getGroupBalances(
  userId: string,
  month: number,
  year: number,
): Array<GroupBalanceDto> {
  const { groups, transactions } = loadAppData(userId)
  const user = getUserById(userId)

  return groups.map((group) => {
    const monthlyOwes: Record<string, number> = {}
    const overallOwes: Record<string, number> = {}
    const monthlyNet: Record<string, number> = {}
    const overallNet: Record<string, number> = {}

    group.members.forEach((member) => {
      monthlyNet[member.id] = 0
      overallNet[member.id] = 0
    })

    const groupTransactions = transactions.filter(
      (transaction): transaction is GroupTransactionDto =>
        isGroupTransactionDto(transaction) && transaction.group.id === group.id,
    )

    for (const transaction of groupTransactions) {
      const currentMonth = isInMonth(transaction, month, year)
      const groupMetadata = transaction.groupMetadata

      if (isGroupSplitMetadataDto(groupMetadata)) {
        group.members.forEach((member) => {
          const net = getUserOwes(
            member,
            groupMetadata.paidBy,
            groupMetadata.split,
          )
          overallNet[member.id] += net

          if (currentMonth) {
            monthlyNet[member.id] += net
          }
        })

        continue
      }

      overallNet[groupMetadata.paidBy.id] -= transaction.amount
      overallNet[groupMetadata.paidTo.id] += transaction.amount

      if (currentMonth) {
        monthlyNet[groupMetadata.paidBy.id] -= transaction.amount
        monthlyNet[groupMetadata.paidTo.id] += transaction.amount
      }
    }

    const monthlySettlements = getSettlement(monthlyNet)
    const overallSettlements = getSettlement(overallNet)

    for (const settlement of monthlySettlements) {
      if (settlement.from === user.id) {
        monthlyOwes[settlement.to] =
          (monthlyOwes[settlement.to] || 0) + settlement.amount
      } else if (settlement.to === user.id) {
        monthlyOwes[settlement.from] =
          (monthlyOwes[settlement.from] || 0) - settlement.amount
      }
    }

    for (const settlement of overallSettlements) {
      if (settlement.from === user.id) {
        overallOwes[settlement.to] =
          (overallOwes[settlement.to] || 0) + settlement.amount
      } else if (settlement.to === user.id) {
        overallOwes[settlement.from] =
          (overallOwes[settlement.from] || 0) - settlement.amount
      }
    }

    return {
      group,
      monthlyOwes,
      overallOwes,
      balance: overallNet[user.id] || 0,
    }
  })
}

export function getMonthlyStats(
  userId: string,
  month: number,
  year: number,
): MonthlyStatsDto {
  const user = getUserById(userId)
  const monthTransactions = getTransactions(userId, month, year)

  return monthTransactions.reduce(
    (totals, transaction) => {
      const { income, expense, owes } = getUserAmounts(user, transaction)
      totals.income += income
      totals.expense += expense
      totals.owes += owes
      return totals
    },
    { income: 0, expense: 0, owes: 0 },
  )
}

export function getCategoryStats(
  userId: string,
  month: number,
  year: number,
): Array<CategoryStatDto> {
  const { categories } = loadAppData(userId)
  const user = getUserById(userId)
  const monthTransactions = getTransactions(userId, month, year)
  const allSubCategoryIds = new Set(
    categories.flatMap((category) => category.subCategories),
  )

  const getStat = (category: CategoryDto): CategoryStatDto => ({
    category,
    amount: getAmountForCategory(category, user, monthTransactions),
    isSubcategory: allSubCategoryIds.has(category.id),
    subcategories: [],
  })

  return categories
    .map((category) => {
      const subcategories = category.subCategories
        .map((subCategoryId) =>
          categories.find((candidate) => candidate.id === subCategoryId),
        )
        .filter((candidate): candidate is CategoryDto => Boolean(candidate))
        .map(getStat)
      const subcategorySum = subcategories.reduce(
        (sum, subcategory) => sum + subcategory.amount,
        0,
      )

      return {
        ...getStat(category),
        amount:
          getAmountForCategory(category, user, monthTransactions) +
          subcategorySum,
        subcategories,
      }
    })
    .filter((categoryStat) => categoryStat.amount !== 0)
}

export function getPeopleBalances(userId: string): Array<PeopleBalanceDto> {
  const now = new Date()
  const groupBalances = getGroupBalances(
    userId,
    now.getMonth(),
    now.getFullYear(),
  )
  const peopleMap: Record<string, number> = {}
  const { users } = loadAppData(userId)

  for (const groupBalance of groupBalances) {
    for (const [otherUserId, owes] of Object.entries(
      groupBalance.overallOwes,
    )) {
      peopleMap[otherUserId] = (peopleMap[otherUserId] || 0) + owes
    }
  }

  return Object.entries(peopleMap)
    .map(([otherUserId, owes]) => ({
      user: users.find((user) => user.id === otherUserId)!,
      owes,
    }))
    .filter((person) => person.owes !== 0)
}

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`
}

function serializeCell(value: unknown): string | null {
  if (value == null) {
    return null
  }

  if (typeof value === 'string') {
    return value
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return String(value)
  }

  return JSON.stringify(value)
}

export function getDatabaseTables(): Array<DatabaseTableDto> {
  const db = getDatabase()
  const tables = db
    .prepare(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `,
    )
    .all() as Array<{ name: string }>

  return tables.map(({ name }) => {
    const columnRows = db
      .prepare(`PRAGMA table_info(${quoteIdentifier(name)})`)
      .all() as Array<{ name: string }>
    const countRow = db
      .prepare(`SELECT COUNT(*) as count FROM ${quoteIdentifier(name)}`)
      .get() as { count: number }

    return {
      name,
      rowCount: countRow.count,
      columns: columnRows.map((column) => column.name),
    }
  })
}

export function getDatabaseTablePreview(
  tableName: string,
  previewLimit = 25,
): DatabaseTablePreviewDto {
  const db = getDatabase()
  const availableTables = new Set(
    getDatabaseTables().map((table) => table.name),
  )

  if (!availableTables.has(tableName)) {
    throw new Error(`Unknown table ${tableName}`)
  }

  const safeLimit = Math.max(1, Math.min(previewLimit, 100))
  const columns = db
    .prepare(`PRAGMA table_info(${quoteIdentifier(tableName)})`)
    .all() as Array<{ name: string }>
  const rowCount = (
    db
      .prepare(`SELECT COUNT(*) as count FROM ${quoteIdentifier(tableName)}`)
      .get() as { count: number }
  ).count
  const rows = db
    .prepare(
      `SELECT * FROM ${quoteIdentifier(tableName)} LIMIT ${safeLimit.toString()}`,
    )
    .all() as Array<Record<string, unknown>>

  return {
    tableName,
    rowCount,
    previewLimit: safeLimit,
    columns: columns.map((column) => column.name),
    rows: rows.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key, serializeCell(value)]),
      ),
    ),
  }
}
