import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { authUsersTable } from './auth'

export const chaptersTable = sqliteTable('chapters', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => authUsersTable.id),
  label: text('label').notNull(),
})

export type ChapterRecord = typeof chaptersTable.$inferSelect
