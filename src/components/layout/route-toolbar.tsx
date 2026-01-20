export function RouteToolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-border bg-card rounded-lg border p-4 shadow-sm flex flex-col justify-between items-center gap-6 xl:flex-row">
      {children}
    </div>
  )
}
