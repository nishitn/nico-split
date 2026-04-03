import { CategoryType } from '../../../backend/enums'
import type { CategoryTypeValue } from '../../../backend/enums'
import type { UUID } from 'node:crypto'
import type { LucideIcon } from 'lucide-react'

export { CategoryType }
export type CategoryType = CategoryTypeValue

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
