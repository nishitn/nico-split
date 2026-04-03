import type { IconName } from '@/lib/icon-map'

export interface CategoryDto {
  id: string
  label: string
  type: string
  iconName: IconName
  subCategories: Array<string>
}

export interface CategoryStatDto {
  category: CategoryDto
  amount: number
  isSubcategory: boolean
  subcategories: Array<CategoryStatDto>
}
