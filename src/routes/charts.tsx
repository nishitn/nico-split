import { createFileRoute } from '@tanstack/react-router'
import { LineChart } from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'

export const Route = createFileRoute('/charts')({
  component: ChartsPage,
})

function ChartsPage() {
  return (
    <AppLayout>
      <div className="text-muted-foreground flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="bg-muted rounded-full p-4">
          <LineChart className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold">Charts Feature Coming Soon</h2>
        <p>Advanced analytics and charts will appear here.</p>
      </div>
    </AppLayout>
  )
}
