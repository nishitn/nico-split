import {  clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type {ClassValue} from 'clsx';
import type {
  GroupSplitMetadata,
  GroupTransferMetadata,
  Transaction} from '@/features/transactions/types';
import type { User } from '@/features/users/types'
import {
  GroupTransactionType,
  PersonalTransactionType,
  TransactionScope,
} from '@/features/transactions/types'

// UI Helpers
export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function getAmountsColor(amount: number, foregroundColor: string) {
  if (amount > 0) {
    return 'text-income'
  } else if (amount < 0) {
    return 'text-expense'
  } else {
    return foregroundColor
  }
}

export function getOwesColor(owes: number, foregroundColor: string) {
  return getAmountsColor(-owes, foregroundColor)
}

export function getOwesText(owes: number, user?: User) {
  if (!user) {
    return owes > 0 ? 'You owe: ' : owes < 0 ? 'You lent: ' : ''
  }
  return owes > 0
    ? `You owe ${user.name}: `
    : owes < 0
      ? `${user.name} owes you: `
      : ''
}

// API Helpers
export function getUserOwes(
  user: User,
  paidBy: Record<string, number>,
  split: Record<string, number>,
) {
  const userPaid = paidBy[user.id] || 0
  const userSplit = split[user.id] || 0

  return userPaid - userSplit
}

export function getUserAmounts(user: User, t: Transaction) {
  let income = 0
  let expense = 0
  let owes = 0

  if (t.scope === TransactionScope.PERSONAL) {
    if (t.type === PersonalTransactionType.INCOME) {
      income += t.amount
    } else if (t.type === PersonalTransactionType.EXPENSE) {
      expense += t.amount
    }
  } else if (t.scope === TransactionScope.GROUP) {
    if (t.type === GroupTransactionType.SPLIT) {
      const groupMetadata = t.groupMetadata as GroupSplitMetadata
      const userPaid = groupMetadata.paidBy[user.id] || 0
      const userSplit = groupMetadata.split[user.id] || 0
      expense += userPaid
      owes += userSplit - userPaid
    } else if (t.type === GroupTransactionType.TRANSFER) {
      const groupMetadata = t.groupMetadata as GroupTransferMetadata
      if (groupMetadata.paidBy.id === user.id) {
        expense += t.amount
      }
      if (groupMetadata.paidTo.id === user.id) {
        income += t.amount
      }
    }
  }

  return { income, expense, owes }
}

export function getSettlement(net: Record<string, number>) {
  const debtors = Object.entries(net)
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([user, amount]) => ({ user, amount }))
  const creditors = Object.entries(net)
    .filter(([_, amount]) => amount < 0)
    .sort((a, b) => a[1] - b[1])
    .map(([user, amount]) => ({ user, amount: -amount }))

  const settlement: Array<{ from: string; to: string; amount: number }> = []

  // Use a greedy algorithm to minimize the number of transactions
  let i = 0 // debtors index
  let j = 0 // creditors index

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]
    const creditor = creditors[j]

    // Settle the minimum of what the debtor owes and what the creditor is owed
    const settleAmount = Math.min(debtor.amount, creditor.amount)

    settlement.push({
      from: debtor.user,
      to: creditor.user,
      amount: settleAmount,
    })

    // Update the remaining amounts
    debtor.amount -= settleAmount
    creditor.amount -= settleAmount

    // Move to the next debtor if current one is settled
    if (debtor.amount === 0) i++
    // Move to the next creditor if current one is settled
    if (creditor.amount === 0) j++
  }

  return settlement
}
