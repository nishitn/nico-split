export const AccountType = {
  CASH: 'cash',
  BANK: 'bank',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  WALLET: 'wallet',
  LOAN: 'loan',
  INVESTMENT: 'investment',
  OTHER: 'other',
} as const

export type AccountTypeValue = (typeof AccountType)[keyof typeof AccountType]

export const Currency = {
  INR: 'inr',
  USD: 'usd',
  EUR: 'eur',
  GBP: 'gbp',
  JPY: 'jpy',
  CNY: 'cny',
  AUD: 'aud',
  CAD: 'cad',
  CHF: 'chf',
  SEK: 'sek',
  NOK: 'nok',
  DKK: 'dkk',
  NZD: 'nzd',
  SGD: 'sgd',
  HKD: 'hkd',
  KRW: 'krw',
  TRY: 'try',
  BRL: 'brl',
  ZAR: 'zar',
  RUB: 'rub',
} as const

export type CurrencyValue = (typeof Currency)[keyof typeof Currency]

export const CategoryType = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const

export type CategoryTypeValue = (typeof CategoryType)[keyof typeof CategoryType]

export const TransactionScope = {
  PERSONAL: 'personal',
  GROUP: 'group',
} as const

export type TransactionScopeValue =
  (typeof TransactionScope)[keyof typeof TransactionScope]

export const PersonalTransactionType = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
} as const

export type PersonalTransactionTypeValue =
  (typeof PersonalTransactionType)[keyof typeof PersonalTransactionType]

export const GroupTransactionType = {
  SPLIT: 'split',
  TRANSFER: 'transfer',
} as const

export type GroupTransactionTypeValue =
  (typeof GroupTransactionType)[keyof typeof GroupTransactionType]

export const SplitType = {
  EQUAL: 'equal',
  UNEQUAL: 'unequal',
} as const

export type SplitTypeValue = (typeof SplitType)[keyof typeof SplitType]
