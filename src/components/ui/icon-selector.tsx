import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface IconOption {
  value: string
  label: string
  icon: LucideIcon
}

export function IconSelector({
  value,
  onChange,
  options,
  columns = 4,
}: {
  value: string
  onChange: (value: string) => void
  options: IconOption[]
  columns?: 3 | 4
}) {
  return (
    <div
      className={cn(
        'grid gap-2',
        columns === 3 ? 'grid-cols-3' : 'grid-cols-4',
      )}
    >
      {options.map((option) => {
        const Icon = option.icon
        const isSelected = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-lg border px-3 py-3 text-xs font-medium transition-colors',
              isSelected
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="size-5" />
            <span className="truncate">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
