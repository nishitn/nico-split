import type { UUID } from 'crypto'
import type { LucideIcon } from 'lucide-react'
import {
  Banknote,
  Building2,
  CreditCard,
  LineChart,
  MoreHorizontal,
  TrendingDown,
  Wallet,
} from 'lucide-react'

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

// ─── Account Type Options ────────────────────────────────────────────────────

export const ACCOUNT_TYPE_OPTIONS: {
  type: AccountType
  label: string
  icon: LucideIcon
}[] = [
  { type: AccountType.CASH, label: 'Cash', icon: Banknote },
  { type: AccountType.BANK, label: 'Bank', icon: Building2 },
  { type: AccountType.CREDIT_CARD, label: 'Credit', icon: CreditCard },
  { type: AccountType.DEBIT_CARD, label: 'Debit', icon: CreditCard },
  { type: AccountType.WALLET, label: 'Wallet', icon: Wallet },
  { type: AccountType.LOAN, label: 'Loan', icon: TrendingDown },
  { type: AccountType.INVESTMENT, label: 'Invest', icon: LineChart },
  { type: AccountType.OTHER, label: 'Other', icon: MoreHorizontal },
]

// ─── Currency Metadata ───────────────────────────────────────────────────────

export const CURRENCY_META: Record<Currency, { symbol: string; name: string }> =
  {
    [Currency.INR]: { symbol: '₹', name: 'Indian Rupee' },
    [Currency.USD]: { symbol: '$', name: 'US Dollar' },
    [Currency.EUR]: { symbol: '€', name: 'Euro' },
    [Currency.GBP]: { symbol: '£', name: 'British Pound' },
    [Currency.JPY]: { symbol: '¥', name: 'Japanese Yen' },
    [Currency.CNY]: { symbol: '¥', name: 'Chinese Yuan' },
    [Currency.AUD]: { symbol: 'A$', name: 'Australian Dollar' },
    [Currency.CAD]: { symbol: 'C$', name: 'Canadian Dollar' },
    [Currency.CHF]: { symbol: 'Fr', name: 'Swiss Franc' },
    [Currency.SEK]: { symbol: 'kr', name: 'Swedish Krona' },
    [Currency.NOK]: { symbol: 'kr', name: 'Norwegian Krone' },
    [Currency.DKK]: { symbol: 'kr', name: 'Danish Krone' },
    [Currency.NZD]: { symbol: 'NZ$', name: 'New Zealand Dollar' },
    [Currency.SGD]: { symbol: 'S$', name: 'Singapore Dollar' },
    [Currency.HKD]: { symbol: 'HK$', name: 'Hong Kong Dollar' },
    [Currency.KRW]: { symbol: '₩', name: 'South Korean Won' },
    [Currency.TRY]: { symbol: '₺', name: 'Turkish Lira' },
    [Currency.BRL]: { symbol: 'R$', name: 'Brazilian Real' },
    [Currency.ZAR]: { symbol: 'R', name: 'South African Rand' },
    [Currency.RUB]: { symbol: '₽', name: 'Russian Ruble' },
  }
