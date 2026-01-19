import type { DayTransactionData, Transaction } from '@/features/transactions/types'
import type { User } from '@/features/users/types'
import { getUserAmounts } from '@/lib/utils'

export function groupTransactionsByDate(
  transactions: Array<Transaction>,
  user: User,
): Array<DayTransactionData> {
  const groups: Record<string, DayTransactionData> = {}

  transactions.forEach((tx) => {
    // Normalize date to midnight togroup by day
    const dateKey = new Date(
      tx.dateTime.getFullYear(),
      tx.dateTime.getMonth(),
      tx.dateTime.getDate(),
    ).toISOString()

    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: new Date(dateKey),
        income: 0,
        expense: 0,
        owes: 0,
        transactions: [],
      }
    }

    const { income, expense, owes } = getUserAmounts(user, tx)
    groups[dateKey].income += income
    groups[dateKey].expense += expense
    groups[dateKey].owes += owes
    groups[dateKey].transactions.push(tx)
  })

  return Object.values(groups).sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  )
}
