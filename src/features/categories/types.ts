import type { LucideIcon } from 'lucide-react'
import type { UUID } from 'node:crypto'

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

export interface CategoryStat {
  category: Category
  amount: number
  isSubcategory: boolean
  subcategories: Array<CategoryStat>
}
