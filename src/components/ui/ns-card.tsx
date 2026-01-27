import { CurrencySpan } from '@/components/ui/currency-span'
import { cn } from '@/lib/utils'
import { LucideIcon, User } from 'lucide-react'
import { ReactNode } from 'react'

export interface NsCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function NsCard({ children, className, onClick }: NsCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card border-border group relative flex items-center gap-4 overflow-hidden rounded-lg border p-4 transition-all duration-200',
        'hover:border-border-hover/50 hover:shadow-md',
        'dark:hover:bg-card-hover dark:border-transparent dark:hover:shadow-none',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function NsIcon({
  icon,
  className,
}: {
  icon?: LucideIcon
  className?: string
}) {
  const Icon = icon || User
  return (
    <div className={cn('relative shrink-0 self-start', className)}>
      <div className="bg-muted flex size-10 items-center justify-center rounded-full md:size-12">
        <Icon className="size-5 md:size-6" />
      </div>
    </div>
  )
}

export function NsContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {children}
    </div>
  )
}

export function NsMainRow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('flex w-full flex-row items-center gap-4 px-2', className)}
    >
      {children}
    </div>
  )
}

export function NsSubRow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'text-muted-foreground flex flex-row px-2 text-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function NsAmount({
  amount,
  className,
}: {
  amount: number
  className?: string
}) {
  return (
    <div className={cn('flex w-auto justify-end', className)}>
      <CurrencySpan amount={amount} />
    </div>
  )
}
