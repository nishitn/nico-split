import type {
  GroupDto,
  GroupSplitMetadataDto,
  GroupTransferMetadataDto,
  UserMetadataDto,
} from './group-dto'
import type { UserRecord } from '../schema'

export interface BaseTransactionDto {
  id: string
  dateTime: string
  currency: string
  amount: number
  note?: string
  createdBy: UserRecord
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

export interface MonthlyStatsDto {
  income: number
  expense: number
  owes: number
}
