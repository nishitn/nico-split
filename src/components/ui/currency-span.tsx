import { Currency } from '@/features/accounts/types'
import { cn } from '@/lib/utils'

export interface CurrencySpanProps {
  amount: number
  currency?: Currency
  className?: string
  showSign?: boolean
}

export function CurrencySpan({
  amount,
  currency = Currency.INR,
  className,
  showSign = false,
}: CurrencySpanProps) {
  const displayAmount = showSign ? amount : Math.abs(amount)
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(displayAmount)

  return <span className={cn('whitespace-nowrap', className)}>{formatted}</span>
}
