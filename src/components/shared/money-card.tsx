import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MoneyCardProps {
  title: string
  amount: number
  type?: 'default' | 'income' | 'expense'
  className?: string
  formatter?: (val: number) => string
}

export function MoneyCard({
  title,
  amount,
  type = 'default',
  className,
  formatter = (val) =>
    val.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
    }),
}: MoneyCardProps) {
  const colorClass =
    type === 'income'
      ? 'text-emerald-500'
      : type === 'expense'
        ? 'text-red-500'
        : 'text-foreground'

  return (
    <Card className={cn('flex flex-col justify-between shadow-sm', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold', colorClass)}>
          {formatter(Math.abs(amount))}
        </div>
      </CardContent>
    </Card>
  )
}
