import type {
  DayTransactionData,
  Transaction,
} from '@/features/transactions/types'
import type { User } from '@/features/users/types'
import { getUserAmounts } from '@/lib/utils'

export function groupTransactionsByDate(
  transactions: Array<Transaction>,
  user: User,
): Array<DayTransactionData> {
  const dayWiseTransactions: Record<string, DayTransactionData> = {}

  transactions.forEach((tx) => {
    // Normalize date to midnight togroup by day
    const dateKey = dateString(tx.dateTime)

    if (!(dateKey in dayWiseTransactions)) {
      dayWiseTransactions[dateKey] = {
        date: new Date(dateKey),
        income: 0,
        expense: 0,
        owes: 0,
        transactions: [],
      }
    }

    const { income, expense, owes } = getUserAmounts(user, tx)
    dayWiseTransactions[dateKey].income += income
    dayWiseTransactions[dateKey].expense += expense
    dayWiseTransactions[dateKey].owes += owes
    dayWiseTransactions[dateKey].transactions.push(tx)
  })

  return Object.values(dayWiseTransactions).sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  )
}

function dateString(date: Date) {
  return date.toISOString().split('T')[0]
}
