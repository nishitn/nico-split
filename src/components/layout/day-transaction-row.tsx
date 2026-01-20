import { TransactionItem } from '@/components/shared/transaction-item'
import { CurrencySpan } from '@/components/ui/currency-span'
import { Separator } from '@/components/ui/separator'
import { DayTransactionData } from '@/features/transactions/types'
import { User } from '@/features/users/types'
import { Calendar } from 'lucide-react'

export interface DayTransactionRowProps {
  user: User
  dayData: DayTransactionData
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function DateRow({ dayData }: { dayData: DayTransactionData }) {
  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground text-sm font-semibold">
            {formatDate(dayData.date)}
          </span>
        </div>
        <div className="flex flex-row items-center gap-4 text-sm font-semibold">
          <span className="text-expense min-w-25 px-2 text-end">
            +<CurrencySpan amount={dayData.expense} />
          </span>
          <span className="text-income min-w-25 px-2 text-end">
            +<CurrencySpan amount={dayData.income} />
          </span>
        </div>
      </div>
      <Separator />
    </div>
  )
}

export function DayTransactionRow({ user, dayData }: DayTransactionRowProps) {
  return (
    <div className="flex flex-col gap-2">
      <DateRow dayData={dayData} />
      <div className="flex flex-col gap-2">
        {dayData.transactions.map((tx) => (
          <TransactionItem key={tx.id} tx={tx} user={user} />
        ))}
      </div>
    </div>
  )
}
