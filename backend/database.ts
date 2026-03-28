import Database from 'better-sqlite3'
import type { IconName } from '../src/lib/icon-map'
import { mkdirSync } from 'node:fs'
import { DB_DIRECTORY, DB_PATH } from './db-config'

interface SeedUser {
  id: string
  name: string
}

interface SeedAccount {
  id: string
  label: string
  type: string
  iconName: IconName
  currency: string
  balance: number
}

interface SeedCategory {
  id: string
  label: string
  type: string
  iconName: IconName
  parentId: string | null
}

interface SeedChapter {
  id: string
  label: string
}

interface SeedGroup {
  id: string
  label: string
  iconName: IconName
  memberIds: Array<string>
}

interface SeedTransaction {
  id: string
  scope: 'personal' | 'group'
  type: string
  dateTime: string
  currency: string
  amount: number
  note?: string
  createdByUserId: string
  groupId?: string
  userMetadata: {
    accountId: string
    categoryId?: string
    toAccountId?: string
  }
  groupMetadata?:
    | {
        paidBy: Record<string, number>
        split: Record<string, number>
        categoryId?: string
      }
    | {
        paidByUserId: string
        paidToUserId: string
      }
}

declare global {
  var __nicoSplitDb: InstanceType<typeof Database> | undefined
}

const seedUsers: Array<SeedUser> = [
  { id: 'u0', name: 'Nishit' },
  { id: 'u1', name: 'Dev' },
  { id: 'u2', name: 'Ishan' },
]

const seedAccounts: Array<SeedAccount> = [
  {
    id: 'a0',
    label: 'HDFC Bank',
    currency: 'inr',
    balance: 1_000_000,
    type: 'bank',
    iconName: 'wallet',
  },
  {
    id: 'a1',
    label: 'Canara Bank',
    currency: 'inr',
    balance: 20_000,
    type: 'debit_card',
    iconName: 'wallet',
  },
  {
    id: 'a2',
    label: 'Cash',
    currency: 'inr',
    balance: 300,
    type: 'cash',
    iconName: 'wallet',
  },
]

const seedCategories: Array<SeedCategory> = [
  {
    id: 'c0',
    label: 'Food & Dining',
    type: 'expense',
    iconName: 'utensils',
    parentId: null,
  },
  {
    id: 'c1',
    label: 'Groceries',
    type: 'expense',
    iconName: 'utensils',
    parentId: 'c0',
  },
  {
    id: 'c2',
    label: 'Restaurants',
    type: 'expense',
    iconName: 'utensils',
    parentId: 'c0',
  },
  {
    id: 'c3',
    label: 'Transport',
    type: 'expense',
    iconName: 'car',
    parentId: null,
  },
  {
    id: 'c4',
    label: 'Salary',
    type: 'income',
    iconName: 'wallet',
    parentId: null,
  },
  {
    id: 'c5',
    label: 'Entertainment',
    type: 'expense',
    iconName: 'film',
    parentId: null,
  },
  {
    id: 'c7',
    label: 'Rent',
    type: 'expense',
    iconName: 'home',
    parentId: null,
  },
]

const seedChapters: Array<SeedChapter> = [
  { id: 'ch0', label: 'Blr_Sonestaa' },
  { id: 'ch1', label: 'Indore' },
]

const seedGroups: Array<SeedGroup> = [
  {
    id: 'g0',
    label: 'Blr Flat',
    iconName: 'users',
    memberIds: ['u0', 'u1', 'u2'],
  },
  {
    id: 'g1',
    label: 'Trip to Big Name Bhubhneshwar',
    iconName: 'users',
    memberIds: ['u0', 'u1'],
  },
]

function daysFromToday(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

const seedTransactions: Array<SeedTransaction> = [
  {
    id: 'pt0',
    scope: 'personal',
    type: 'income',
    dateTime: daysFromToday(2),
    amount: 150_000,
    note: 'Salary Credit',
    currency: 'inr',
    createdByUserId: 'u0',
    userMetadata: {
      accountId: 'a0',
      categoryId: 'c4',
    },
  },
  {
    id: 'pt1',
    scope: 'personal',
    type: 'expense',
    dateTime: daysFromToday(0),
    amount: 2_500,
    note: 'Groceries',
    currency: 'inr',
    createdByUserId: 'u0',
    userMetadata: {
      accountId: 'a2',
      categoryId: 'c1',
    },
  },
  {
    id: 'pt2',
    scope: 'personal',
    type: 'expense',
    dateTime: daysFromToday(0),
    amount: 310,
    currency: 'inr',
    createdByUserId: 'u0',
    userMetadata: {
      accountId: 'a1',
      categoryId: 'c3',
    },
  },
  {
    id: 'pt3',
    scope: 'personal',
    type: 'transfer',
    dateTime: daysFromToday(0),
    amount: 45_000,
    currency: 'inr',
    createdByUserId: 'u0',
    userMetadata: {
      accountId: 'a0',
      toAccountId: 'a1',
    },
  },
  {
    id: 'gt0',
    scope: 'group',
    type: 'split',
    dateTime: daysFromToday(-5),
    amount: 10_000,
    note: 'Rent',
    currency: 'inr',
    createdByUserId: 'u1',
    groupId: 'g0',
    userMetadata: {
      accountId: 'a0',
      categoryId: 'c7',
    },
    groupMetadata: {
      paidBy: {
        u2: 10_000,
      },
      split: {
        u0: 2_500,
        u1: 2_500,
        u2: 5_000,
      },
    },
  },
  {
    id: 'gt1',
    scope: 'group',
    type: 'transfer',
    dateTime: daysFromToday(-5),
    amount: 10_000,
    note: 'Rent',
    currency: 'inr',
    createdByUserId: 'u0',
    groupId: 'g0',
    userMetadata: {
      accountId: 'a0',
      categoryId: 'c5',
    },
    groupMetadata: {
      paidByUserId: 'u2',
      paidToUserId: 'u0',
    },
  },
]

function createSchema(db: InstanceType<typeof Database>) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      type TEXT NOT NULL,
      icon_name TEXT NOT NULL,
      currency TEXT NOT NULL,
      balance INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      type TEXT NOT NULL,
      icon_name TEXT NOT NULL,
      parent_id TEXT REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS chapters (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS groups_table (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      icon_name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS group_members (
      group_id TEXT NOT NULL REFERENCES groups_table(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      PRIMARY KEY (group_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      scope TEXT NOT NULL,
      type TEXT NOT NULL,
      date_time TEXT NOT NULL,
      currency TEXT NOT NULL,
      amount INTEGER NOT NULL,
      note TEXT,
      created_by_user_id TEXT NOT NULL REFERENCES users(id),
      group_id TEXT REFERENCES groups_table(id),
      user_metadata_json TEXT NOT NULL,
      group_metadata_json TEXT
    );
  `)
}

function seedIfEmpty(db: InstanceType<typeof Database>) {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM users').get() as
    | {
        count: number
      }
    | undefined

  if ((countRow?.count ?? 0) > 0) {
    return
  }

  db.exec('BEGIN')

  try {
    const insertUser = db.prepare(
      'INSERT INTO users (id, name) VALUES (?, ?)',
    )
    const insertAccount = db.prepare(
      'INSERT INTO accounts (id, label, type, icon_name, currency, balance) VALUES (?, ?, ?, ?, ?, ?)',
    )
    const insertCategory = db.prepare(
      'INSERT INTO categories (id, label, type, icon_name, parent_id) VALUES (?, ?, ?, ?, ?)',
    )
    const insertChapter = db.prepare(
      'INSERT INTO chapters (id, label) VALUES (?, ?)',
    )
    const insertGroup = db.prepare(
      'INSERT INTO groups_table (id, label, icon_name) VALUES (?, ?, ?)',
    )
    const insertGroupMember = db.prepare(
      'INSERT INTO group_members (group_id, user_id) VALUES (?, ?)',
    )
    const insertTransaction = db.prepare(
      'INSERT INTO transactions (id, scope, type, date_time, currency, amount, note, created_by_user_id, group_id, user_metadata_json, group_metadata_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    )

    for (const user of seedUsers) {
      insertUser.run(user.id, user.name)
    }

    for (const account of seedAccounts) {
      insertAccount.run(
        account.id,
        account.label,
        account.type,
        account.iconName,
        account.currency,
        account.balance,
      )
    }

    for (const category of seedCategories) {
      insertCategory.run(
        category.id,
        category.label,
        category.type,
        category.iconName,
        category.parentId,
      )
    }

    for (const chapter of seedChapters) {
      insertChapter.run(chapter.id, chapter.label)
    }

    for (const group of seedGroups) {
      insertGroup.run(group.id, group.label, group.iconName)

      for (const memberId of group.memberIds) {
        insertGroupMember.run(group.id, memberId)
      }
    }

    for (const transaction of seedTransactions) {
      insertTransaction.run(
        transaction.id,
        transaction.scope,
        transaction.type,
        transaction.dateTime,
        transaction.currency,
        transaction.amount,
        transaction.note ?? null,
        transaction.createdByUserId,
        transaction.groupId ?? null,
        JSON.stringify(transaction.userMetadata),
        transaction.groupMetadata
          ? JSON.stringify(transaction.groupMetadata)
          : null,
      )
    }

    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

export function getDatabase() {
  if (globalThis.__nicoSplitDb) {
    return globalThis.__nicoSplitDb
  }

  mkdirSync(DB_DIRECTORY, { recursive: true })

  const db = new Database(DB_PATH)
  createSchema(db)
  seedIfEmpty(db)

  globalThis.__nicoSplitDb = db

  return db
}

export { DB_PATH }
