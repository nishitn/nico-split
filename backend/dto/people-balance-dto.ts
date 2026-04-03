import type { UserRecord } from '../schema'

export interface PeopleBalanceDto {
  user: UserRecord
  owes: number
}
