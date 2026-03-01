import type { UUID } from 'crypto'

export interface User {
  id: UUID
  name: string
}

export interface PeopleBalance {
  user: User
  owes: number
}
