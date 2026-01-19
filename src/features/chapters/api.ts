import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export const keys = {
  chapters: 'chapters',
}

export const useChapters = () => {
  return useQuery({
    queryKey: [keys.chapters],
    queryFn: () => api.getChapters(),
  })
}
