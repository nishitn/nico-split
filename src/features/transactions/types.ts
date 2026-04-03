import {
  GroupTransactionType,
  PersonalTransactionType,
  SplitType,
  TransactionScope,
} from '../../../backend/enums'
import type {
  GroupTransactionTypeValue,
  PersonalTransactionTypeValue,
  SplitTypeValue,
  TransactionScopeValue,
} from '../../../backend/enums'
import type { Account, Currency } from '@/features/accounts/types'
import type { Category } from '@/features/categories/types'
import type { Group } from '@/features/groups/types'
import type { User } from '@/features/users/types'
import type { UUID } from 'node:crypto'

export {
  GroupTransactionType,
  PersonalTransactionType,
  SplitType,
  TransactionScope,
}
export type GroupTransactionType = GroupTransactionTypeValue
export type PersonalTransactionType = PersonalTransactionTypeValue
export type SplitType = SplitTypeValue
export type TransactionScope = TransactionScopeValue

export interface BaseTransaction {
  id: UUID
  dateTime: Date
  currency: Currency
  amount: number
  note?: string
  createdBy: User
}

export interface PersonalTransaction extends BaseTransaction {
  scope: typeof TransactionScope.PERSONAL
  type: PersonalTransactionType
  metadata: UserMetadata
}

export interface UserMetadata {
  account: Account
  category?: Category
  toAccount?: Account
}

export interface GroupTransaction extends BaseTransaction {
  group: Group
  scope: typeof TransactionScope.GROUP
  type: GroupTransactionType
  groupMetadata: GroupSplitMetadata | GroupTransferMetadata
  userMetadata: UserMetadata
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
