import { useQuery } from '@tanstack/react-query'
import type { User } from '@/features/users/types'
import { api } from '@/lib/api'

export const keys = {
  groups: 'groups',
}

export const useGroups = () => {
  return useQuery({
    queryKey: [keys.groups],
    queryFn: () => api.getGroups(),
  })
}

export const useGroupBalances = (user: User, month: number, year: number) => {
  return useQuery({
    queryKey: [keys.groups, user.id, month, year],
    queryFn: () => api.getGroupBalances(user, month, year),
  })
}
