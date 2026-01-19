import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { User } from '../users/types'

export const keys = {
  categories: 'categories',
}

export function useCategories() {
  return useQuery({
    queryKey: [keys.categories],
    queryFn: api.getCategories,
  })
}

export function useCategoryStats(user: User, month: number, year: number) {
  return useQuery({
    queryKey: [keys.categories, user.id, month, year],
    queryFn: () => api.getCategoryStats(user, month, year),
  })
}
