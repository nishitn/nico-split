import { and, eq, exists, or } from 'drizzle-orm'
import { getDrizzleDb } from './database'
import {
  AccountType,
  CategoryType,
  Currency,
  GroupTransactionType,
  PersonalTransactionType,
  TransactionScope,
} from './enums'
import {
  accountsTable,
  authUsersTable,
  categoriesTable,
  chaptersTable,
  groupMembersTable,
  groupsTable,
  transactionsTable,
  userFriendsTable,
} from './schema'

const SEED_FRIENDS = [
  {
    id: 'seed-friend-dev',
    name: 'Dev',
    email: 'seed-dev@local.invalid',
  },
  {
    id: 'seed-friend-ishan',
    name: 'Ishan',
    email: 'seed-ishan@local.invalid',
  },
] as const

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

export function ensureUserSeedData(userId: string) {
  const db = getDrizzleDb()

  const hasData =
    db
      .select({ id: accountsTable.id })
      .from(accountsTable)
      .where(eq(accountsTable.userId, userId))
      .limit(1)
      .all().length > 0 ||
    db
      .select({ id: categoriesTable.id })
      .from(categoriesTable)
      .where(eq(categoriesTable.userId, userId))
      .limit(1)
      .all().length > 0 ||
    db
      .select({ id: chaptersTable.id })
      .from(chaptersTable)
      .where(eq(chaptersTable.userId, userId))
      .limit(1)
      .all().length > 0 ||
    db
      .select({ userId: transactionsTable.createdByUserId })
      .from(transactionsTable)
      .where(
        or(
          eq(transactionsTable.createdByUserId, userId),
          exists(
            db
              .select({ groupId: groupMembersTable.groupId })
              .from(groupMembersTable)
              .where(
                and(
                  eq(groupMembersTable.groupId, transactionsTable.groupId),
                  eq(groupMembersTable.userId, userId),
                ),
              ),
          ),
        ),
      )
      .limit(1)
      .all().length > 0

  if (hasData) {
    return
  }

  const now = new Date()

  db.insert(authUsersTable)
    .values(
      SEED_FRIENDS.map((friend) => ({
        id: friend.id,
        name: friend.name,
        email: friend.email,
        emailVerified: false,
        image: null,
        createdAt: now,
        updatedAt: now,
      })),
    )
    .onConflictDoNothing()
    .run()

  const ids = {
    accountBank: `${userId}-seed-account-bank`,
    accountCash: `${userId}-seed-account-cash`,
    accountWallet: `${userId}-seed-account-wallet`,
    categoryFood: `${userId}-seed-category-food`,
    categoryGroceries: `${userId}-seed-category-groceries`,
    categoryDining: `${userId}-seed-category-dining`,
    categoryTransport: `${userId}-seed-category-transport`,
    categorySalary: `${userId}-seed-category-salary`,
    categoryEntertainment: `${userId}-seed-category-entertainment`,
    categoryRent: `${userId}-seed-category-rent`,
    chapterBangalore: `${userId}-seed-chapter-bangalore`,
    chapterIndore: `${userId}-seed-chapter-indore`,
    groupFlat: `${userId}-seed-group-flat`,
    groupTrip: `${userId}-seed-group-trip`,
    txSalary: `${userId}-seed-tx-salary`,
    txGroceries: `${userId}-seed-tx-groceries`,
    txTransport: `${userId}-seed-tx-transport`,
    txTransfer: `${userId}-seed-tx-transfer`,
    txGroupSplit: `${userId}-seed-tx-group-split`,
    txGroupTransfer: `${userId}-seed-tx-group-transfer`,
  }

  db.insert(accountsTable)
    .values([
      {
        id: ids.accountBank,
        userId,
        label: 'HDFC Bank',
        type: AccountType.BANK,
        iconName: 'wallet',
        currency: Currency.INR,
        balance: 1000000,
      },
      {
        id: ids.accountCash,
        userId,
        label: 'Cash',
        type: AccountType.CASH,
        iconName: 'wallet',
        currency: Currency.INR,
        balance: 300,
      },
      {
        id: ids.accountWallet,
        userId,
        label: 'Travel Wallet',
        type: AccountType.WALLET,
        iconName: 'wallet',
        currency: Currency.INR,
        balance: 12000,
      },
    ])
    .onConflictDoNothing()
    .run()

  db.insert(categoriesTable)
    .values([
      {
        id: ids.categoryFood,
        userId,
        label: 'Food & Dining',
        type: CategoryType.EXPENSE,
        iconName: 'utensils',
        parentId: null,
      },
      {
        id: ids.categoryGroceries,
        userId,
        label: 'Groceries',
        type: CategoryType.EXPENSE,
        iconName: 'utensils',
        parentId: ids.categoryFood,
      },
      {
        id: ids.categoryDining,
        userId,
        label: 'Restaurants',
        type: CategoryType.EXPENSE,
        iconName: 'utensils',
        parentId: ids.categoryFood,
      },
      {
        id: ids.categoryTransport,
        userId,
        label: 'Transport',
        type: CategoryType.EXPENSE,
        iconName: 'car',
        parentId: null,
      },
      {
        id: ids.categorySalary,
        userId,
        label: 'Salary',
        type: CategoryType.INCOME,
        iconName: 'wallet',
        parentId: null,
      },
      {
        id: ids.categoryEntertainment,
        userId,
        label: 'Entertainment',
        type: CategoryType.EXPENSE,
        iconName: 'film',
        parentId: null,
      },
      {
        id: ids.categoryRent,
        userId,
        label: 'Rent',
        type: CategoryType.EXPENSE,
        iconName: 'home',
        parentId: null,
      },
    ])
    .onConflictDoNothing()
    .run()

  db.insert(chaptersTable)
    .values([
      {
        id: ids.chapterBangalore,
        userId,
        label: 'Bangalore',
      },
      {
        id: ids.chapterIndore,
        userId,
        label: 'Indore',
      },
    ])
    .onConflictDoNothing()
    .run()

  db.insert(userFriendsTable)
    .values([
      {
        userId,
        friendUserId: SEED_FRIENDS[0].id,
      },
      {
        userId,
        friendUserId: SEED_FRIENDS[1].id,
      },
      {
        userId: SEED_FRIENDS[0].id,
        friendUserId: userId,
      },
      {
        userId: SEED_FRIENDS[1].id,
        friendUserId: userId,
      },
    ])
    .onConflictDoNothing()
    .run()

  db.insert(groupsTable)
    .values([
      {
        id: ids.groupFlat,
        label: 'Blr Flat',
        iconName: 'users',
      },
      {
        id: ids.groupTrip,
        label: 'Goa Trip',
        iconName: 'users',
      },
    ])
    .onConflictDoNothing()
    .run()

  db.insert(groupMembersTable)
    .values([
      { groupId: ids.groupFlat, userId },
      { groupId: ids.groupFlat, userId: SEED_FRIENDS[0].id },
      { groupId: ids.groupFlat, userId: SEED_FRIENDS[1].id },
      { groupId: ids.groupTrip, userId },
      { groupId: ids.groupTrip, userId: SEED_FRIENDS[0].id },
    ])
    .onConflictDoNothing()
    .run()

  db.insert(transactionsTable)
    .values([
      {
        id: ids.txSalary,
        scope: TransactionScope.PERSONAL,
        type: PersonalTransactionType.INCOME,
        dateTime: daysFromNow(-2),
        currency: Currency.INR,
        amount: 150000,
        note: 'Salary Credit',
        createdByUserId: userId,
        groupId: null,
        userMetadataJson: JSON.stringify({
          accountId: ids.accountBank,
          categoryId: ids.categorySalary,
        }),
        groupMetadataJson: null,
      },
      {
        id: ids.txGroceries,
        scope: TransactionScope.PERSONAL,
        type: PersonalTransactionType.EXPENSE,
        dateTime: daysFromNow(-1),
        currency: Currency.INR,
        amount: 2500,
        note: 'Groceries',
        createdByUserId: userId,
        groupId: null,
        userMetadataJson: JSON.stringify({
          accountId: ids.accountCash,
          categoryId: ids.categoryGroceries,
        }),
        groupMetadataJson: null,
      },
      {
        id: ids.txTransport,
        scope: TransactionScope.PERSONAL,
        type: PersonalTransactionType.EXPENSE,
        dateTime: daysFromNow(0),
        currency: Currency.INR,
        amount: 310,
        note: 'Metro card recharge',
        createdByUserId: userId,
        groupId: null,
        userMetadataJson: JSON.stringify({
          accountId: ids.accountWallet,
          categoryId: ids.categoryTransport,
        }),
        groupMetadataJson: null,
      },
      {
        id: ids.txTransfer,
        scope: TransactionScope.PERSONAL,
        type: PersonalTransactionType.TRANSFER,
        dateTime: daysFromNow(0),
        currency: Currency.INR,
        amount: 45000,
        note: 'Move money for rent',
        createdByUserId: userId,
        groupId: null,
        userMetadataJson: JSON.stringify({
          accountId: ids.accountBank,
          toAccountId: ids.accountWallet,
        }),
        groupMetadataJson: null,
      },
      {
        id: ids.txGroupSplit,
        scope: TransactionScope.GROUP,
        type: GroupTransactionType.SPLIT,
        dateTime: daysFromNow(-5),
        currency: Currency.INR,
        amount: 10000,
        note: 'Flat rent',
        createdByUserId: SEED_FRIENDS[0].id,
        groupId: ids.groupFlat,
        userMetadataJson: JSON.stringify({
          accountId: ids.accountBank,
          categoryId: ids.categoryRent,
        }),
        groupMetadataJson: JSON.stringify({
          paidBy: {
            [SEED_FRIENDS[1].id]: 10000,
          },
          split: {
            [userId]: 2500,
            [SEED_FRIENDS[0].id]: 2500,
            [SEED_FRIENDS[1].id]: 5000,
          },
          categoryId: ids.categoryRent,
        }),
      },
      {
        id: ids.txGroupTransfer,
        scope: TransactionScope.GROUP,
        type: GroupTransactionType.TRANSFER,
        dateTime: daysFromNow(-4),
        currency: Currency.INR,
        amount: 10000,
        note: 'Rent settlement',
        createdByUserId: userId,
        groupId: ids.groupFlat,
        userMetadataJson: JSON.stringify({
          accountId: ids.accountBank,
          categoryId: ids.categoryEntertainment,
        }),
        groupMetadataJson: JSON.stringify({
          paidByUserId: SEED_FRIENDS[1].id,
          paidToUserId: userId,
        }),
      },
    ])
    .onConflictDoNothing()
    .run()
}
