import { getDatabase } from './database'
import type {
  AccountDto,
  CategoryDto,
  ChapterDto,
  GroupDto,
  TransactionDto,
  UserDto,
} from './contracts'

interface UserRow {
  id: string
  name: string
}

interface AccountRow {
  id: string
  label: string
  type: string
  icon_name: AccountDto['iconName']
  currency: string
  balance: number
}

interface CategoryRow {
  id: string
  label: string
  type: string
  icon_name: CategoryDto['iconName']
  parent_id: string | null
}

interface ChapterRow {
  id: string
  label: string
}

interface GroupRow {
  id: string
  label: string
  icon_name: GroupDto['iconName']
}

interface GroupMemberRow {
  group_id: string
  user_id: string
}

interface TransactionRow {
  id: string
  scope: TransactionDto['scope']
  type: string
  date_time: string
  currency: string
  amount: number
  note: string | null
  created_by_user_id: string
  group_id: string | null
  user_metadata_json: string
  group_metadata_json: string | null
}

interface UserMetadataRow {
  accountId: string
  categoryId?: string
  toAccountId?: string
}

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

export function loadUsers(): Array<UserDto> {
  const db = getDatabase()
  const rows = db.prepare('SELECT id, name FROM users ORDER BY id').all() as
    Array<UserRow>

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
  }))
}

export function loadAccounts(): Array<AccountDto> {
  const db = getDatabase()
  const rows = db
    .prepare(
      'SELECT id, label, type, icon_name, currency, balance FROM accounts ORDER BY id',
    )
    .all() as Array<AccountRow>

  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    type: row.type,
    iconName: row.icon_name,
    currency: row.currency,
    balance: row.balance,
  }))
}

export function loadCategories(): Array<CategoryDto> {
  const db = getDatabase()
  const rows = db
    .prepare(
      'SELECT id, label, type, icon_name, parent_id FROM categories ORDER BY id',
    )
    .all() as Array<CategoryRow>

  const byParent = new Map<string, Array<string>>()

  for (const row of rows) {
    if (!row.parent_id) {
      continue
    }

    const existing = byParent.get(row.parent_id) ?? []
    existing.push(row.id)
    byParent.set(row.parent_id, existing)
  }

  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    type: row.type,
    iconName: row.icon_name,
    subCategories: byParent.get(row.id) ?? [],
  }))
}

export function loadChapters(): Array<ChapterDto> {
  const db = getDatabase()
  const rows = db.prepare('SELECT id, label FROM chapters ORDER BY id').all() as
    Array<ChapterRow>

  return rows.map((row) => ({
    id: row.id,
    label: row.label,
  }))
}

export function loadGroups(users: Array<UserDto>): Array<GroupDto> {
  const db = getDatabase()
  const groups = db
    .prepare(
      'SELECT id, label, icon_name FROM groups_table ORDER BY id',
    )
    .all() as Array<GroupRow>
  const memberships = db
    .prepare(
      'SELECT group_id, user_id FROM group_members ORDER BY group_id, user_id',
    )
    .all() as Array<GroupMemberRow>

  const usersById = new Map(users.map((user) => [user.id, user]))
  const memberIdsByGroup = new Map<string, Array<string>>()

  for (const membership of memberships) {
    const groupMemberIds = memberIdsByGroup.get(membership.group_id) ?? []
    groupMemberIds.push(membership.user_id)
    memberIdsByGroup.set(membership.group_id, groupMemberIds)
  }

  return groups.map((group) => ({
    id: group.id,
    label: group.label,
    iconName: group.icon_name,
    members: (memberIdsByGroup.get(group.id) ?? []).map((memberId) =>
      invariant(
        usersById.get(memberId),
        `Missing user ${memberId} for group ${group.id}`,
      ),
    ),
  }))
}

export function loadTransactions(
  users: Array<UserDto>,
  accounts: Array<AccountDto>,
  categories: Array<CategoryDto>,
  groups: Array<GroupDto>,
): Array<TransactionDto> {
  const db = getDatabase()
  const rows = db
    .prepare(
      'SELECT id, scope, type, date_time, currency, amount, note, created_by_user_id, group_id, user_metadata_json, group_metadata_json FROM transactions ORDER BY date_time DESC, id DESC',
    )
    .all() as Array<TransactionRow>

  const usersById = new Map(users.map((user) => [user.id, user]))
  const accountsById = new Map(accounts.map((account) => [account.id, account]))
  const categoriesById = new Map(
    categories.map((category) => [category.id, category]),
  )
  const groupsById = new Map(groups.map((group) => [group.id, group]))

  return rows.map((row) => {
    const createdBy = invariant(
      usersById.get(row.created_by_user_id),
      `Missing creator ${row.created_by_user_id} for transaction ${row.id}`,
    )
    const userMetadata = JSON.parse(row.user_metadata_json) as UserMetadataRow
    const baseTransaction = {
      id: row.id,
      dateTime: row.date_time,
      currency: row.currency,
      amount: row.amount,
      note: row.note ?? undefined,
      createdBy,
    }
    const hydratedUserMetadata = {
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

    if (row.scope === 'personal') {
      return {
        ...baseTransaction,
        scope: 'personal',
        type: row.type,
        metadata: hydratedUserMetadata,
      }
    }

    const group = invariant(
      groupsById.get(invariant(row.group_id, `Missing group for ${row.id}`)),
      `Missing group ${row.group_id} for transaction ${row.id}`,
    )
    const groupMetadata = JSON.parse(
      invariant(
        row.group_metadata_json,
        `Missing group metadata for transaction ${row.id}`,
      ),
    ) as GroupMetadataRow

    if ('split' in groupMetadata) {
      return {
        ...baseTransaction,
        group,
        scope: 'group',
        type: row.type,
        groupMetadata: {
          paidBy: groupMetadata.paidBy,
          split: groupMetadata.split,
          category: groupMetadata.categoryId
            ? invariant(
                categoriesById.get(groupMetadata.categoryId),
                `Missing category ${groupMetadata.categoryId} for transaction ${row.id}`,
              )
            : undefined,
        },
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
