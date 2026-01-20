import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export interface SummaryCellProps {
  className?: string
  heading: string
  children: ReactNode
}

export function SummaryCell({
  className,
  heading,
  children,
}: SummaryCellProps) {
  return (
    <div
      className={cn(
        className,
        'flex min-w-25 flex-1 flex-row items-center xl:min-w-40 xl:flex-none xl:flex-col xl:items-end',
      )}
    >
      <span className="text-muted-foreground flex-1 text-xs font-bold uppercase tracking-wider xl:flex-none">
        {heading}
      </span>
      <div className="flex flex-col items-end justify-center xl:flex-1">
        {children}
      </div>
    </div>
  )
}
