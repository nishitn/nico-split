import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { authUsersTable } from './auth'
import type { IconName } from '@/lib/icon-map'

export const groupsTable = sqliteTable('groups_table', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  iconName: text('icon_name').$type<IconName>().notNull(),
})

export const groupMembersTable = sqliteTable(
  'group_members',
  {
    groupId: text('group_id')
      .notNull()
      .references(() => groupsTable.id),
    userId: text('user_id')
      .notNull()
      .references(() => authUsersTable.id),
  },
  (table) => [primaryKey({ columns: [table.groupId, table.userId] })],
)

export const userFriendsTable = sqliteTable(
  'user_friends',
  {
    userId: text('user_id')
      .notNull()
      .references(() => authUsersTable.id),
    friendUserId: text('friend_user_id')
      .notNull()
      .references(() => authUsersTable.id),
  },
  (table) => [primaryKey({ columns: [table.userId, table.friendUserId] })],
)

export type GroupRecord = typeof groupsTable.$inferSelect
export type GroupMemberRecord = typeof groupMembersTable.$inferSelect
export type UserFriendRecord = typeof userFriendsTable.$inferSelect
