import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export const keys = {
  users: 'users',
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: [keys.users],
    queryFn: () => api.getCurrentUser(),
  })
}
