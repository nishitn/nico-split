import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function FormNavButton({
  onClick,
  className,
  isSelected,
  children,
  color = 'primary',
}: {
  onClick: () => void
  className?: string
  isSelected: boolean
  children: React.ReactNode
  color?: string
}) {
  return (
    <Button
      type="button"
      onClick={() => onClick()}
      className={cn(
        'flex h-auto flex-1 flex-col items-center gap-2 rounded-md border p-2 text-sm',
        isSelected
          ? `bg-${color}/10 text-${color} border-${color} hover:bg-${color}/10 hover:text-${color}`
          : 'text-muted-foreground border-border hover:bg-sidebar-accent hover:text-foreground bg-card cursor-pointer',
        className,
      )}
    >
      {children}
    </Button>
  )
}
