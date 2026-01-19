import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const keys = {
  accounts: 'accounts',
}

export function useAccounts() {
  return useQuery({
    queryKey: [keys.accounts],
    queryFn: api.getAccounts,
  })
}
