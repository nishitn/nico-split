import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from './button'

export interface ActionButtonProps {
  to: string
  text: string
}

export function ActionButton({ to, text }: ActionButtonProps) {
  return (
    <Link to={to}>
      <Button className="h-12 transform rounded-xl px-6 text-sm font-bold shadow-sm transition-all active:scale-95 hidden md:flex">
        <Plus className="mr-2 h-4 w-4" /> {text}
      </Button>
    </Link>
  )
}
