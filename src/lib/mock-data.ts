import { Account, AccountType, Currency } from '@/features/accounts/types'
import { Category, CategoryType } from '@/features/categories/types'
import { Chapter } from '@/features/chapters/types'
import { Group } from '@/features/groups/types'
import {
  GroupTransaction,
  GroupTransactionType,
  PersonalTransaction,
  PersonalTransactionType,
  Transaction,
  TransactionScope,
} from '@/features/transactions/types'
import { User } from '@/features/users/types'
import { UUID } from 'crypto'
import { Car, Film, Home, Users, Utensils, Wallet } from 'lucide-react'

// Users
export const mockUsers: Array<User> = [
  { id: 'u0' as UUID, name: 'Nishit' },
  { id: 'u1' as UUID, name: 'Dev' },
  { id: 'u2' as UUID, name: 'Ishan' },
]

export const currentUser = mockUsers[0]

// Accounts
export const mockAccounts: Array<Account> = [
  {
    id: 'a0' as UUID,
    label: 'HDFC Bank',
    currency: Currency.INR,
    balance: 1000000,
    type: AccountType.BANK,
    icon: Wallet,
  },
  {
    id: 'a1' as UUID,
    label: 'Canara Bank',
    currency: Currency.INR,
    balance: 20000,
    type: AccountType.DEBIT_CARD,
    icon: Wallet,
  },
  {
    id: 'a2' as UUID,
    label: 'Cash',
    currency: Currency.INR,
    balance: 300,
    type: AccountType.CASH,
    icon: Wallet,
  },
]

// Categories
export const mockCategories: Array<Category> = [
  {
    id: 'c0' as UUID,
    label: 'Food & Dining',
    icon: Utensils,
    type: CategoryType.EXPENSE,
    subCategories: ['c1' as UUID, 'c2' as UUID],
  },
  {
    id: 'c1' as UUID,
    label: 'Groceries',
    icon: Utensils,
    type: CategoryType.EXPENSE,
    subCategories: [],
  },
  {
    id: 'c2' as UUID,
    label: 'Restaurants',
    icon: Utensils,
    type: CategoryType.EXPENSE,
    subCategories: [],
  },
  {
    id: 'c3' as UUID,
    label: 'Transport',
    icon: Car,
    type: CategoryType.EXPENSE,
    subCategories: [],
  },
  {
    id: 'c4' as UUID,
    label: 'Salary',
    icon: Wallet,
    type: CategoryType.INCOME,
    subCategories: [],
  },
  {
    id: 'c5' as UUID,
    label: 'Entertainment',
    icon: Film,
    type: CategoryType.EXPENSE,
    subCategories: [],
  },
  {
    id: 'c7' as UUID,
    label: 'Rent',
    icon: Home,
    type: CategoryType.EXPENSE,
    subCategories: [],
  },
]

// Chapters
export const mockChapters: Array<Chapter> = [
  {
    id: 'ch0' as UUID,
    label: 'Blr_Sonestaa',
  },
  {
    id: 'ch1' as UUID,
    label: 'Indore',
  },
]

// Groups
export const mockGroups: Array<Group> = [
  {
    id: 'g0' as UUID,
    label: 'Blr Flat',
    icon: Users,
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
  },
  {
    id: 'g1' as UUID,
    label: 'Trip to Big Name Bhubhneshwar',
    icon: Users,
    members: [mockUsers[0], mockUsers[1]],
  },
]

// Transactions
export const mockPersonalTransactions: Array<PersonalTransaction> = [
  {
    id: 'pt0' as UUID,
    dateTime: new Date(new Date().setDate(new Date().getDate() + 2)),
    amount: 150000,
    note: 'Salary Credit',
    currency: Currency.INR,
    createdBy: currentUser,
    scope: TransactionScope.PERSONAL,
    type: PersonalTransactionType.INCOME,
    metadata: {
      category: mockCategories[4],
      account: mockAccounts[0],
    },
  },
  {
    id: 'pt1' as UUID,
    dateTime: new Date(),
    amount: 2500,
    note: 'Groceries',
    currency: Currency.INR,
    createdBy: currentUser,
    scope: TransactionScope.PERSONAL,
    type: PersonalTransactionType.EXPENSE,
    metadata: {
      category: mockCategories[1],
      account: mockAccounts[2],
    },
  },
  {
    id: 'pt2' as UUID,
    dateTime: new Date(),
    amount: 310,
    currency: Currency.INR,
    createdBy: currentUser,
    scope: TransactionScope.PERSONAL,
    type: PersonalTransactionType.EXPENSE,
    metadata: {
      category: mockCategories[3],
      account: mockAccounts[1],
    },
  },
  {
    id: 'pt3' as UUID,
    dateTime: new Date(),
    amount: 45000,
    currency: Currency.INR,
    createdBy: currentUser,
    scope: TransactionScope.PERSONAL,
    type: PersonalTransactionType.TRANSFER,
    metadata: {
      account: mockAccounts[0], // HDFC Bank
      toAccount: mockAccounts[1], // Canara Bank
    },
  },
]

export const mockGroupTransactions: Array<GroupTransaction> = [
  {
    id: 'gt0' as UUID,
    dateTime: new Date(new Date().setDate(new Date().getDate() - 5)),
    amount: 10000,
    note: 'Rent',
    currency: Currency.INR,
    createdBy: mockUsers[1], // Dev
    group: mockGroups[0],
    scope: TransactionScope.GROUP,
    type: GroupTransactionType.SPLIT,
    groupMetadata: {
      paidBy: {
        u2: 10000, // Ishan
      },
      split: {
        u0: 5000, // Nishit
        u1: 5000, // Dev
        u2: 10000, // Ishan
      },
    },
    userMetadata: {
      category: mockCategories[7],
      account: mockAccounts[0],
    },
  },
  {
    id: 'gt1' as UUID,
    dateTime: new Date(new Date().setDate(new Date().getDate() - 5)),
    amount: 10000,
    note: 'Rent',
    currency: Currency.INR,
    createdBy: currentUser,
    group: mockGroups[0],
    scope: TransactionScope.GROUP,
    type: GroupTransactionType.TRANSFER,
    groupMetadata: {
      paidBy: mockUsers[2], // Ishan
      paidTo: mockUsers[0], // Nishit
    },
    userMetadata: {
      category: mockCategories[5],
      account: mockAccounts[0],
    },
  },
]

export const mockTransactions: Array<Transaction> = [
  ...mockPersonalTransactions,
  ...mockGroupTransactions,
]
