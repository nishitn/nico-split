import type { UUID } from 'node:crypto'

export interface Chapter {
  id: UUID
  label: string
}
