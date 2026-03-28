import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const keys = {
  database: 'database',
}

export function useDatabaseTables(enabled = true) {
  return useQuery({
    queryKey: [keys.database, 'tables'],
    queryFn: () => api.getDatabaseTables(),
    enabled,
  })
}

export function useDatabaseTablePreview(tableName?: string, limit = 25) {
  return useQuery({
    queryKey: [keys.database, 'preview', tableName, limit],
    queryFn: () => api.getDatabaseTablePreview(tableName!, limit),
    enabled: Boolean(tableName),
  })
}
