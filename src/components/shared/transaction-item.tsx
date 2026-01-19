import { Users } from 'lucide-react'
import type {
  GroupSplitMetadata,
  Transaction} from '@/features/transactions/types';
import type { User } from '@/features/users/types'
import {
  GroupTransactionType,
  TransactionScope,
} from '@/features/transactions/types'
import {
  cn,
  getAmountsColor,
  getOwesColor,
  getOwesText,
  getUserAmounts,
} from '@/lib/utils'

interface TransactionItemProps {
  transaction: Transaction
  user: User
}

export function TransactionItem({ transaction, user }: TransactionItemProps) {
  const { income, expense, owes } = getUserAmounts(user, transaction)

  // Determine if it's income or expense for the main amount display
  // If income > 0, it's green. If expense > 0, it's red (display as negative)
  // If only owes changed (like in a split where I paid exact share), might be neutral

  const netAmount = income - expense
  const amountColor = getAmountsColor(netAmount, 'text-foreground')

  const formattedAmount = Math.abs(netAmount).toLocaleString('en-IN', {
    style: 'currency',
    currency: transaction.currency.toUpperCase(),
  })

  const owesColor = getOwesColor(owes, 'text-muted-foreground')
  const formattedOwes = Math.abs(owes).toLocaleString('en-IN', {
    style: 'currency',
    currency: transaction.currency.toUpperCase(),
  })

  // Icon and Category/Group logic
  let Icon = Users // Default fallback
  let title = ''
  let subtitle = ''
  let subIcon = null

  if (transaction.scope === TransactionScope.PERSONAL) {
    Icon = transaction.metadata.category?.icon || Users
    title = transaction.metadata.category?.label || 'Uncategorized'
    subtitle = transaction.note || transaction.metadata.account.label
  } else {
    // Group Transaction
    Icon = transaction.group.icon || Users
    title = transaction.group.label
    subtitle = transaction.note || 'Group Expense'

    // Additional logic for group details
    if (transaction.type === GroupTransactionType.SPLIT) {
      const meta = transaction.groupMetadata as GroupSplitMetadata
      subIcon = meta.category?.icon
    }
  }

  return (
    <div className="border-border flex flex-col border-b py-3 last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-secondary text-secondary-foreground flex h-10 w-10 items-center justify-center rounded-full">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{title}</span>
            <span className="text-muted-foreground line-clamp-1 text-xs">
              {subtitle}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className={cn('text-sm font-bold', amountColor)}>
            {netAmount < 0 ? '-' : '+'}
            {formattedAmount}
          </span>
        </div>
      </div>

      {/* Additional Row for splits/owes info */}
      {(transaction.scope === TransactionScope.GROUP || owes !== 0) && (
        <div className="text-muted-foreground mt-2 flex items-center gap-1 pl-[3.25rem] text-xs">
          {transaction.scope === TransactionScope.GROUP && (
            <span className="bg-secondary/50 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px]">
              <Users className="h-3 w-3" />
              Group
            </span>
          )}

          {owes !== 0 && (
            <span className={cn('ml-auto italic', owesColor)}>
              {getOwesText(owes)} {formattedOwes}
            </span>
          )}
          {transaction.scope === TransactionScope.GROUP &&
            transaction.type === GroupTransactionType.TRANSFER && (
              <span className="ml-auto italic">Transfer</span>
            )}
        </div>
      )}
    </div>
  )
}
