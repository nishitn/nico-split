import { getDrizzleDb } from '@db/database'
import { and, desc, eq, exists, or } from 'drizzle-orm'
import type { CategoryDto } from './dto/category-dto'
import type {
  GroupDto,
  GroupSplitMetadataDto,
  UserMetadataDto,
} from './dto/group-dto'
import type { TransactionDto } from './dto/transaction-dto'
import type { UserRecord } from './schema'
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
import { AccountRecord } from './schema/accounts'
import { ChapterRecord } from './schema/chapters'

type GroupMetadataRow =
  | {
      paidBy: Record<string, number>
      split: Record<string, number>
      categoryId?: string
    }
  | {
      paidByUserId: string
      paidToUserId: string
    }

function invariant<T>(value: T | undefined | null, message: string): T {
  if (value == null) {
    throw new Error(message)
  }

  return value
}

export function loadUsers(): Array<UserRecord> {
  const db = getDrizzleDb()
  return db.select().from(authUsersTable).orderBy(authUsersTable.name).all()
}

export function loadAccounts(userId: string): Array<AccountRecord> {
  const db = getDrizzleDb()
  return db
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.userId, userId))
    .orderBy(accountsTable.id)
    .all()
}

export function loadCategories(userId: string): Array<CategoryDto> {
  const db = getDrizzleDb()
  const rows = db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.userId, userId))
    .orderBy(categoriesTable.id)
    .all()
  const byParent = new Map<string, Array<string>>()

  for (const row of rows) {
    if (!row.parentId) {
      continue
    }

    const existing = byParent.get(row.parentId) ?? []
    existing.push(row.id)
    byParent.set(row.parentId, existing)
  }

  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    type: row.type,
    iconName: row.iconName,
    subCategories: byParent.get(row.id) ?? [],
  }))
}

export function loadChapters(userId: string): Array<ChapterRecord> {
  const db = getDrizzleDb()
  return db
    .select()
    .from(chaptersTable)
    .where(eq(chaptersTable.userId, userId))
    .orderBy(chaptersTable.id)
    .all()
}

export function loadFriends(userId: string): Array<UserRecord> {
  const db = getDrizzleDb()
  return db
    .select({
      id: authUsersTable.id,
      name: authUsersTable.name,
      email: authUsersTable.email,
      emailVerified: authUsersTable.emailVerified,
      image: authUsersTable.image,
      createdAt: authUsersTable.createdAt,
      updatedAt: authUsersTable.updatedAt,
    })
    .from(authUsersTable)
    .where(
      exists(
        db
          .select({ value: userFriendsTable.friendUserId })
          .from(userFriendsTable)
          .where(
            and(
              eq(userFriendsTable.userId, userId),
              eq(userFriendsTable.friendUserId, authUsersTable.id),
            ),
          ),
      ),
    )
    .orderBy(authUsersTable.name)
    .all()
}

export function loadGroups(
  currentUserId: string,
  users: Array<UserRecord>,
): Array<GroupDto> {
  const db = getDrizzleDb()
  const groups = db
    .select()
    .from(groupsTable)
    .where(
      exists(
        db
          .select({ value: groupMembersTable.groupId })
          .from(groupMembersTable)
          .where(
            and(
              eq(groupMembersTable.groupId, groupsTable.id),
              eq(groupMembersTable.userId, currentUserId),
            ),
          ),
      ),
    )
    .orderBy(groupsTable.id)
    .all()
  const memberships = db
    .select()
    .from(groupMembersTable)
    .orderBy(groupMembersTable.groupId, groupMembersTable.userId)
    .all()

  const usersById = new Map(users.map((user) => [user.id, user]))
  const memberIdsByGroup = new Map<string, Array<string>>()

  for (const membership of memberships) {
    const groupMemberIds = memberIdsByGroup.get(membership.groupId) ?? []
    groupMemberIds.push(membership.userId)
    memberIdsByGroup.set(membership.groupId, groupMemberIds)
  }

  return groups.map((group) => ({
    id: group.id,
    label: group.label,
    iconName: group.iconName,
    members: (memberIdsByGroup.get(group.id) ?? []).map((memberId) =>
      invariant(
        usersById.get(memberId),
        `Missing user ${memberId} for group ${group.id}`,
      ),
    ),
  }))
}

export function loadTransactions(
  currentUserId: string,
  users: Array<UserRecord>,
  accounts: Array<AccountRecord>,
  categories: Array<CategoryDto>,
  groups: Array<GroupDto>,
): Array<TransactionDto> {
  const db = getDrizzleDb()
  const rows = db
    .select()
    .from(transactionsTable)
    .where(
      or(
        eq(transactionsTable.createdByUserId, currentUserId),
        exists(
          db
            .select({ value: groupMembersTable.groupId })
            .from(groupMembersTable)
            .where(
              and(
                eq(groupMembersTable.groupId, transactionsTable.groupId),
                eq(groupMembersTable.userId, currentUserId),
              ),
            ),
        ),
      ),
    )
    .orderBy(desc(transactionsTable.dateTime), desc(transactionsTable.id))
    .all()

  const usersById = new Map(users.map((user) => [user.id, user]))
  const accountsById = new Map(accounts.map((account) => [account.id, account]))
  const categoriesById = new Map(
    categories.map((category) => [category.id, category]),
  )
  const groupsById = new Map(groups.map((group) => [group.id, group]))

  return rows.map((row) => {
    const createdBy = invariant(
      usersById.get(row.createdByUserId),
      `Missing creator ${row.createdByUserId} for transaction ${row.id}`,
    )
    const userMetadata = JSON.parse(row.userMetadataJson) as {
      accountId: string
      categoryId?: string
      toAccountId?: string
    }
    const hydratedUserMetadata: UserMetadataDto = {
      account: invariant(
        accountsById.get(userMetadata.accountId),
        `Missing account ${userMetadata.accountId} for transaction ${row.id}`,
      ),
      category: userMetadata.categoryId
        ? invariant(
            categoriesById.get(userMetadata.categoryId),
            `Missing category ${userMetadata.categoryId} for transaction ${row.id}`,
          )
        : undefined,
      toAccount: userMetadata.toAccountId
        ? invariant(
            accountsById.get(userMetadata.toAccountId),
            `Missing account ${userMetadata.toAccountId} for transaction ${row.id}`,
          )
        : undefined,
    }
    const baseTransaction = {
      id: row.id,
      dateTime: row.dateTime,
      currency: row.currency,
      amount: row.amount,
      note: row.note ?? undefined,
      createdBy,
    }

    if (row.scope === 'personal') {
      return {
        ...baseTransaction,
        scope: 'personal',
        type: row.type,
        metadata: hydratedUserMetadata,
      }
    }

    const group = invariant(
      groupsById.get(invariant(row.groupId, `Missing group for ${row.id}`)),
      `Missing group ${row.groupId} for transaction ${row.id}`,
    )
    const groupMetadata = JSON.parse(
      invariant(
        row.groupMetadataJson,
        `Missing group metadata for transaction ${row.id}`,
      ),
    ) as GroupMetadataRow

    if ('split' in groupMetadata) {
      const splitMetadata: GroupSplitMetadataDto = {
        paidBy: groupMetadata.paidBy,
        split: groupMetadata.split,
        category: groupMetadata.categoryId
          ? invariant(
              categoriesById.get(groupMetadata.categoryId),
              `Missing category ${groupMetadata.categoryId} for transaction ${row.id}`,
            )
          : undefined,
      }

      return {
        ...baseTransaction,
        group,
        scope: 'group',
        type: row.type,
        groupMetadata: splitMetadata,
        userMetadata: hydratedUserMetadata,
      }
    }

    return {
      ...baseTransaction,
      group,
      scope: 'group',
      type: row.type,
      groupMetadata: {
        paidBy: invariant(
          usersById.get(groupMetadata.paidByUserId),
          `Missing user ${groupMetadata.paidByUserId} for transaction ${row.id}`,
        ),
        paidTo: invariant(
          usersById.get(groupMetadata.paidToUserId),
          `Missing user ${groupMetadata.paidToUserId} for transaction ${row.id}`,
        ),
      },
      userMetadata: hydratedUserMetadata,
    }
  })
}
