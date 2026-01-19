import type { UUID } from 'node:crypto'
import type { Account, Currency } from '@/features/accounts/types'
import type { Category } from '@/features/categories/types'
import type { Group } from '@/features/groups/types'
import type { User } from '@/features/users/types'

export interface BaseTransaction {
  id: UUID
  dateTime: Date
  currency: Currency
  amount: number
  note?: string
  createdBy: User
}

export enum TransactionScope {
  PERSONAL = 'personal',
  GROUP = 'group',
}

export interface PersonalTransaction extends BaseTransaction {
  scope: TransactionScope.PERSONAL
  type: PersonalTransactionType
  metadata: UserMetadata
}

export enum PersonalTransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export interface UserMetadata {
  account: Account
  category?: Category
  toAccount?: Account
}

export interface GroupTransaction extends BaseTransaction {
  group: Group
  scope: TransactionScope.GROUP
  type: GroupTransactionType
  groupMetadata: GroupSplitMetadata | GroupTransferMetadata
  userMetadata: UserMetadata
}

export enum GroupTransactionType {
  SPLIT = 'split',
  TRANSFER = 'transfer',
}

export interface GroupSplitMetadata {
  paidBy: Record<string, number> // UUID as string to amount
  split: Record<string, number> // UUID as string to amount
  category?: Category
}

export interface GroupTransferMetadata {
  paidBy: User
  paidTo: User
}

export type Transaction = PersonalTransaction | GroupTransaction

export type DayTransactionData = {
  date: Date
  income: number
  expense: number
  owes: number
  transactions: Array<Transaction>
}

export interface MonthlyStats {
  income: number
  expense: number
  owes: number
}
