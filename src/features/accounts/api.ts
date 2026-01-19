import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export const keys = {
  accounts: 'accounts',
}

export function useAccounts() {
  return useQuery({
    queryKey: [keys.accounts],
    queryFn: api.getAccounts,
  })
}
