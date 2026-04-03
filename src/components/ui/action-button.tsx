import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface ActionButtonProps {
  to: string
  text: string
}

export function ActionButton({ to, text }: ActionButtonProps) {
  return (
    <Link to={to}>
      <Button className="hidden h-12 transform rounded-xl px-6 text-sm font-bold shadow-sm transition-all active:scale-95 md:flex">
        <Plus className="mr-2 h-4 w-4" /> {text}
      </Button>
    </Link>
  )
}

export function MobileActionFab({ to, text }: ActionButtonProps) {
  return (
    <Link to={to} aria-label={text}>
      <Button className="fixed right-5 bottom-22 z-30 flex h-18 w-18 rounded-2xl shadow-xl transition-transform active:scale-95 md:hidden">
        <Plus className="size-8 stroke-2" />
      </Button>
    </Link>
  )
}
