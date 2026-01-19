import { useSuspenseQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const keys = {
  users: 'users',
}

export const useCurrentUser = () => {
  return useSuspenseQuery({
    queryKey: [keys.users],
    queryFn: () => api.getCurrentUser(),
  })
}
