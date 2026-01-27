export function RouteToolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-border bg-card flex flex-col items-center justify-between gap-6 rounded-lg border p-4 shadow-sm xl:flex-row">
      {children}
    </div>
  )
}
