import type { IconName } from '@/lib/icon-map'
import type { AccountRecord } from '../schema/accounts'
import type { UserRecord } from '../schema'
import type { CategoryDto } from './category-dto'

export interface GroupDto {
  id: string
  label: string
  iconName: IconName
  members: Array<UserRecord>
}

export interface UserMetadataDto {
  account: AccountRecord
  category?: CategoryDto
  toAccount?: AccountRecord
}

export interface GroupSplitMetadataDto {
  paidBy: Record<string, number>
  split: Record<string, number>
  category?: CategoryDto
}

export interface GroupTransferMetadataDto {
  paidBy: UserRecord
  paidTo: UserRecord
}
export interface GroupBalanceDto {
  group: GroupDto
  monthlyOwes: Record<string, number>
  overallOwes: Record<string, number>
  balance: number
}
