import { Car, Film, Home, Users, Utensils, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const iconRegistry = {
  car: Car,
  film: Film,
  home: Home,
  users: Users,
  utensils: Utensils,
  wallet: Wallet,
} as const

export type IconName = keyof typeof iconRegistry

export function getIcon(iconName: IconName): LucideIcon {
  return iconRegistry[iconName]
}
