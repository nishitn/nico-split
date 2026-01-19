import { UUID } from 'crypto'
import { LucideIcon } from 'lucide-react'

export enum AccountType {
  CASH = 'cash',
  BANK = 'bank',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  WALLET = 'wallet',
  LOAN = 'loan',
  INVESTMENT = 'investment',
  OTHER = 'other',
}

export enum Currency {
  INR = 'inr',
  USD = 'usd',
  EUR = 'eur',
  GBP = 'gbp',
  JPY = 'jpy',
  CNY = 'cny',
  AUD = 'aud',
  CAD = 'cad',
  CHF = 'chf',
  SEK = 'sek',
  NOK = 'nok',
  DKK = 'dkk',
  NZD = 'nzd',
  SGD = 'sgd',
  HKD = 'hkd',
  KRW = 'krw',
  TRY = 'try',
  BRL = 'brl',
  ZAR = 'zar',
  RUB = 'rub',
}

export interface Account {
  id: UUID
  label: string
  type: AccountType
  icon: LucideIcon
  currency: Currency
  balance: number
}
