import { cn } from '@/lib/utils'
import { Field, FieldLabel } from './field'

export function FieldRow(props: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <Field
      orientation="horizontal"
      className="flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-4 [&>[data-slot=field-label]]:md:flex-none"
    >
      <FieldLabel
        className={cn('md:mb-0 md:w-auto md:min-w-24', props.className)}
      >
        {props.label}
      </FieldLabel>
      <div className="flex-1">{props.children}</div>
    </Field>
  )
}
