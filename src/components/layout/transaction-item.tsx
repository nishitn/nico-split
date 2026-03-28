import { CurrencySpan } from '@/components/ui/currency-span'
import {
  NsAmount,
  NsCard,
  NsContent,
  NsIcon,
  NsMainRow,
  NsSubRow,
} from '@/components/ui/ns-card'
import { Separator } from '@/components/ui/separator'
import type { Account } from '@/features/accounts/types'
import type { Category } from '@/features/categories/types'
import type { Group } from '@/features/groups/types'
import type {
  GroupSplitMetadata,
  GroupTransaction,
  GroupTransferMetadata,
  PersonalTransaction,
  Transaction,
} from '@/features/transactions/types'
import {
  GroupTransactionType,
  PersonalTransactionType,
  TransactionScope,
} from '@/features/transactions/types'
import type { User } from '@/features/users/types'
import {
  cn,
  getOwesColor,
  getOwesText,
  getPaidByText,
  getUserOwes,
} from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { FileQuestion, MoveRight, Users } from 'lucide-react'
import type { ReactNode } from 'react'

interface TransactionItemProps {
  tx: Transaction
  user: User
}

export function TransactionItem({ tx, user }: TransactionItemProps) {
  if (tx.scope === TransactionScope.PERSONAL) {
    return <PersonalTransactionItem tx={tx} />
  } else if (tx.scope === TransactionScope.GROUP) {
    if (tx.type === GroupTransactionType.SPLIT) {
      return <GroupSplitTransactionItem tx={tx} user={user} />
    } else if (tx.type === GroupTransactionType.TRANSFER) {
      return <GroupTransferTransactionItem tx={tx} user={user} />
    }
  }
}

export function PersonalTransactionItem({ tx }: { tx: PersonalTransaction }) {
  let amountColor: string
  if (tx.type === PersonalTransactionType.EXPENSE) {
    amountColor = 'text-expense'
  } else if (tx.type === PersonalTransactionType.INCOME) {
    amountColor = 'text-income'
  } else {
    amountColor = 'text-card-foreground'
  }

  const isTransfer = tx.type === PersonalTransactionType.TRANSFER

  let icon: LucideIcon
  if (isTransfer) {
    icon = Users
  } else {
    icon = tx.metadata.category?.icon || FileQuestion
  }

  let metadataRow: ReactNode
  if (isTransfer) {
    metadataRow = (
      <TransferRow
        fromAccount={tx.metadata.account}
        toAccount={tx.metadata.toAccount!}
      />
    )
  } else {
    metadataRow = (
      <MetaDataRow
        userCategory={tx.metadata.category}
        account={tx.metadata.account}
      />
    )
  }

  return (
    <NsCard>
      <NsIcon icon={icon} />
      <NsContent>
        <NsMainRow>
          <div className="flex w-full min-w-0 flex-col gap-1">
            {tx.note && <NoteRow note={tx.note} />}
            <span className="text-muted-foreground flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {metadataRow}
            </span>
          </div>
          <NsAmount className={amountColor} amount={tx.amount} />
        </NsMainRow>
      </NsContent>
    </NsCard>
  )
}

function NoteRow({ note }: { note: string }) {
  return <div className="text-card-foreground flex-1 truncate">{note}</div>
}

function MetaDataRow({
  userCategory,
  account,
  group,
  groupCategory,
}: {
  userCategory?: Category
  account?: Account
  group?: Group
  groupCategory?: Category
}) {
  const categoryLabel = userCategory ? userCategory.label : groupCategory?.label
  return (
    <>
      {categoryLabel && (
        <>
          {categoryLabel} <span className="text-xs">•</span>
        </>
      )}
      {account && (
        <span className="flex items-center gap-1">
          <AccountText className="size-3" account={account} />
        </span>
      )}
      {group && <GroupLabel group={group} />}
    </>
  )
}

function GroupLabel({ group }: { group: Group }) {
  return (
    <span className="bg-muted text-muted-foreground flex items-center gap-1 rounded-md px-2 text-xs">
      {group.label}
    </span>
  )
}

function TransferRow({
  fromAccount,
  toAccount,
}: {
  fromAccount: Account
  toAccount: Account
}) {
  return (
    <>
      <span className="flex items-center gap-1">
        <AccountText account={fromAccount} className="size-3" />
      </span>
      <MoveRight className="size-4" />
      <span className="flex items-center gap-1">
        <AccountText account={toAccount} className="size-3" />
      </span>
    </>
  )
}

function AccountText({
  account,
  className,
}: {
  account: Account
  className?: string
}) {
  const Icon = account.icon
  return (
    <>
      <Icon className={className} /> {account.label}
    </>
  )
}

export function GroupSplitTransactionItem({
  tx,
  user,
}: {
  tx: GroupTransaction
  user: User
}) {
  const groupMetadata = tx.groupMetadata as GroupSplitMetadata

  const paidByText = getPaidByText(user, groupMetadata.paidBy, tx.group.members)
  const userPaid = groupMetadata.paidBy[user.id] || 0
  const amountColor = userPaid === 0 ? 'text-card-foreground' : 'text-expense'

  const userOwes = getUserOwes(user, groupMetadata.paidBy, groupMetadata.split)
  const userOwesColor = getOwesColor(userOwes, 'text-card-foreground')
  const userOwesText = getOwesText(userOwes)

  const metadataRow = (
    <MetaDataRow
      userCategory={tx.userMetadata.category}
      group={tx.group}
      groupCategory={groupMetadata.category}
    />
  )

  return (
    <NsCard>
      <NsIcon icon={tx.group.icon} />
      <NsContent>
        <NsMainRow>
          <div className="flex w-full min-w-0 flex-col gap-1">
            {tx.note && <NoteRow note={tx.note} />}
            <span className="text-muted-foreground flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {metadataRow}
            </span>
          </div>
          <NsAmount className={amountColor} amount={userPaid} />
        </NsMainRow>
        <Separator />
        <NsSubRow>
          <span className="flex-1">
            {paidByText} paid <CurrencySpan amount={tx.amount} />
          </span>
          <span className={cn('item-center flex gap-1', userOwesColor)}>
            {userOwesText} <CurrencySpan amount={userOwes} />
          </span>
        </NsSubRow>
      </NsContent>
    </NsCard>
  )
}

export function GroupTransferTransactionItem({
  tx,
  user,
}: {
  tx: GroupTransaction
  user: User
}) {
  const groupMetadata = tx.groupMetadata as GroupTransferMetadata

  const amountColor =
    groupMetadata.paidBy.id === user.id ? 'text-card-expense' : 'text-income'

  const metadataRow = (
    <GroupTransferRow
      from={groupMetadata.paidBy}
      to={groupMetadata.paidTo}
      group={tx.group}
    />
  )

  return (
    <NsCard>
      <NsIcon icon={tx.group.icon} />
      <NsContent>
        <NsMainRow>
          <div className="flex w-full min-w-0 flex-col gap-1">
            {tx.note && <NoteRow note={tx.note} />}
            <span className="text-muted-foreground flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {metadataRow}
            </span>
          </div>
          <NsAmount className={amountColor} amount={tx.amount} />
        </NsMainRow>
      </NsContent>
    </NsCard>
  )
}

function GroupTransferRow({
  from,
  to,
  group,
}: {
  from: User
  to: User
  group: Group
}) {
  return (
    <>
      <span className="flex items-center gap-1">{from.name}</span>
      <MoveRight className="size-4" />
      <span className="flex items-center gap-1">{to.name}</span>
      <span className="text-xs">•</span>
      <GroupLabel group={group} />
    </>
  )
}
