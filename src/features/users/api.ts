import type { User } from '@/features/users/types'
import { api } from '@/lib/api'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'

export const keys = {
  users: 'users',
  allUsers: 'allUsers',
}

export const useUsers = () => {
  return useQuery({
    queryKey: [keys.allUsers],
    queryFn: () => api.getUsers(),
  })
}

export const useCurrentUser = () => {
  return useSuspenseQuery({
    queryKey: [keys.users],
    queryFn: () => api.getCurrentUser(),
  })
}

export const usePeopleBalances = (user: User) => {
  return useQuery({
    queryKey: [keys.users, user.id, 'balances'],
    queryFn: () => api.getPeopleBalances(user),
  })
}
