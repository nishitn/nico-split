import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { authUsersTable } from './auth'
import { groupsTable } from './groups'
import type {
  CurrencyValue,
  GroupTransactionTypeValue,
  PersonalTransactionTypeValue,
  TransactionScopeValue,
} from '../enums'

export const transactionsTable = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  scope: text('scope').$type<TransactionScopeValue>().notNull(),
  type: text('type')
    .$type<PersonalTransactionTypeValue | GroupTransactionTypeValue>()
    .notNull(),
  dateTime: text('date_time').notNull(),
  currency: text('currency').$type<CurrencyValue>().notNull(),
  amount: integer('amount').notNull(),
  note: text('note'),
  createdByUserId: text('created_by_user_id')
    .notNull()
    .references(() => authUsersTable.id),
  groupId: text('group_id').references(() => groupsTable.id),
  userMetadataJson: text('user_metadata_json').notNull(),
  groupMetadataJson: text('group_metadata_json'),
})

export type TransactionRecord = typeof transactionsTable.$inferSelect
