import type { IconName } from '../src/lib/icon-map'

export interface UserDto {
  id: string
  name: string
}

export interface AccountDto {
  id: string
  label: string
  type: string
  iconName: IconName
  currency: string
  balance: number
}

export interface CategoryDto {
  id: string
  label: string
  type: string
  iconName: IconName
  subCategories: Array<string>
}

export interface ChapterDto {
  id: string
  label: string
}

export interface GroupDto {
  id: string
  label: string
  iconName: IconName
  members: Array<UserDto>
}

export interface UserMetadataDto {
  account: AccountDto
  category?: CategoryDto
  toAccount?: AccountDto
}

export interface GroupSplitMetadataDto {
  paidBy: Record<string, number>
  split: Record<string, number>
  category?: CategoryDto
}

export interface GroupTransferMetadataDto {
  paidBy: UserDto
  paidTo: UserDto
}

export interface BaseTransactionDto {
  id: string
  dateTime: string
  currency: string
  amount: number
  note?: string
  createdBy: UserDto
}

export interface PersonalTransactionDto extends BaseTransactionDto {
  scope: 'personal'
  type: string
  metadata: UserMetadataDto
}

export interface GroupTransactionDto extends BaseTransactionDto {
  group: GroupDto
  scope: 'group'
  type: string
  groupMetadata: GroupSplitMetadataDto | GroupTransferMetadataDto
  userMetadata: UserMetadataDto
}

export type TransactionDto = PersonalTransactionDto | GroupTransactionDto

export interface GroupBalanceDto {
  group: GroupDto
  monthlyOwes: Record<string, number>
  overallOwes: Record<string, number>
  balance: number
}

export interface MonthlyStatsDto {
  income: number
  expense: number
  owes: number
}

export interface CategoryStatDto {
  category: CategoryDto
  amount: number
  isSubcategory: boolean
  subcategories: Array<CategoryStatDto>
}

export interface PeopleBalanceDto {
  user: UserDto
  owes: number
}

export interface DatabaseTableDto {
  name: string
  rowCount: number
  columns: Array<string>
}

export interface DatabaseTablePreviewDto {
  tableName: string
  rowCount: number
  previewLimit: number
  columns: Array<string>
  rows: Array<Record<string, string | null>>
}
