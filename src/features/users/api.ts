import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import type { User } from '@/features/users/types'
import { api } from '@/lib/api'

export const keys = {
  users: 'users',
  friends: 'friends',
}

export const useFriends = () => {
  return useQuery({
    queryKey: [keys.friends],
    queryFn: () => api.getFriends(),
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
