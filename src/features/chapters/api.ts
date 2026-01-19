import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const keys = {
  chapters: 'chapters',
}

export const useChapters = () => {
  return useQuery({
    queryKey: [keys.chapters],
    queryFn: () => api.getChapters(),
  })
}
