import type { User } from '@/features/users/types'
import type { UUID } from 'node:crypto'
import type { LucideIcon } from 'lucide-react'

export interface Group {
  id: UUID
  label: string
  icon: LucideIcon
  members: Array<User>
}

export interface GroupBalance {
  group: Group
  monthlyOwes: Record<string, number>
  overallOwes: Record<string, number>
  balance: number
}
