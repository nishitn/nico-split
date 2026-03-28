import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SELECTED_STYLES: Record<string, string> = {
  primary: 'border-primary bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
  income: 'border-income bg-income/10 text-income hover:bg-income/10 hover:text-income',
  expense:
    'border-expense bg-expense/10 text-expense hover:bg-expense/10 hover:text-expense',
  'blue-500':
    'border-blue-500 bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 hover:text-blue-500',
}

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
        'flex h-auto flex-1 flex-col items-center gap-2 rounded-md border p-2 text-sm shadow-xs',
        isSelected
          ? SELECTED_STYLES[color] ?? SELECTED_STYLES.primary
          : 'text-muted-foreground border-border hover:bg-sidebar-accent hover:text-foreground bg-card cursor-pointer',
        className,
      )}
    >
      {children}
    </Button>
  )
}
