import { User } from '@/features/users/types'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export const keys = {
  transactions: 'transactions',
}

export function useTransactions(month: number, year: number) {
  return useQuery({
    queryKey: [keys.transactions, month, year],
    queryFn: () => api.getTransactions(month, year),
  })
}

export function useMonthlyStats(user: User, month: number, year: number) {
  return useQuery({
    queryKey: [keys.transactions, user.id, month, year],
    queryFn: () => api.getMonthlyStats(user, month, year),
  })
}
