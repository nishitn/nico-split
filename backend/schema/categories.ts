import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'
import type { IconName } from '@/lib/icon-map'
import type { CategoryTypeValue } from '../enums'
import { authUsersTable } from './auth'

export const categoriesTable = sqliteTable('categories', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => authUsersTable.id),
  label: text('label').notNull(),
  type: text('type').$type<CategoryTypeValue>().notNull(),
  iconName: text('icon_name').$type<IconName>().notNull(),
  parentId: text('parent_id').references(
    (): AnySQLiteColumn => categoriesTable.id,
  ),
})

export type CategoryRecord = typeof categoriesTable.$inferSelect
