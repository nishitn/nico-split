import { User } from '@/features/users/types'
import { UUID } from 'crypto'
import { LucideIcon } from 'lucide-react'

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
