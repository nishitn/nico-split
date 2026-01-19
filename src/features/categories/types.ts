import type { UUID } from 'node:crypto'
import type { LucideIcon } from 'lucide-react'

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Category {
  id: UUID
  label: string
  type: CategoryType
  icon: LucideIcon
  subCategories: Array<UUID>
}

export interface CategoryStats {
  category: Category
  amount: number
}
