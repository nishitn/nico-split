import type { UUID } from 'node:crypto'

export interface User {
  id: UUID
  name: string
}

export interface PeopleBalance {
  user: User
  owes: number
}
