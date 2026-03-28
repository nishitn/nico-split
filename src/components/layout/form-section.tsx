export interface FormSectionProps {
  heading?: string
  children: React.ReactNode
}

export function FormSection({ heading, children }: FormSectionProps) {
  return (
    <div className="flex w-full flex-col gap-2 md:gap-4">
      <h2 className="text-muted-foreground text-lg font-semibold">{heading}</h2>
      {children}
    </div>
  )
}
