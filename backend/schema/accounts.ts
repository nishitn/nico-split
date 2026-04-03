import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { IconName } from '@/lib/icon-map'
import type { AccountTypeValue, CurrencyValue } from '../enums'
import { authUsersTable } from './auth'

export const accountsTable = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => authUsersTable.id),
  label: text('label').notNull(),
  type: text('type').$type<AccountTypeValue>().notNull(),
  iconName: text('icon_name').$type<IconName>().notNull(),
  currency: text('currency').$type<CurrencyValue>().notNull(),
  balance: integer('balance').notNull(),
})

export type AccountRecord = typeof accountsTable.$inferSelect
