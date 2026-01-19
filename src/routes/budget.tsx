import { createFileRoute } from '@tanstack/react-router'
import { Calculator } from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'

export const Route = createFileRoute('/budget')({
  component: BudgetPage,
})

function BudgetPage() {
  return (
    <AppLayout>
      <div className="text-muted-foreground flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="bg-muted rounded-full p-4">
          <Calculator className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold">Budget Feature Coming Soon</h2>
        <p>This section is under construction.</p>
      </div>
    </AppLayout>
  )
}
