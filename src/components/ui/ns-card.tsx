import { cn } from '@/lib/utils'
import { LucideIcon, User } from 'lucide-react'
import { ReactNode } from 'react'
import { CurrencySpan } from './currency-span'
import { Separator } from './separator'

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
        'bg-card border border-border rounded-lg group relative flex items-center gap-4 overflow-hidden p-4 transition-all duration-200',
        'hover:border-border-hover/50 hover:shadow-md',
        'dark:hover:bg-card-hover dark:hover:shadow-none dark:border-transparent',
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
    <div className={cn('relative shrink-0', className)}>
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

export function NsBody({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  if (!children) return null
  return (
    <div className={cn('flex flex-col pt-3', className)}>
      <Separator className="bg-border/40 mb-2 transition-colors group-hover:bg-border/60" />
      <div className="text-muted-foreground line-clamp-1 text-[11px] font-bold uppercase tracking-widest transition-colors group-hover:text-foreground/80">
        {children}
      </div>
    </div>
  )
}

export function NsNote({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  if (!children) return null
  return (
    <div
      className={cn(
        'text-muted-foreground/70 mt-1 line-clamp-1 text-[11px] font-medium leading-relaxed italic',
        className,
      )}
    >
      {children}
    </div>
  )
}
