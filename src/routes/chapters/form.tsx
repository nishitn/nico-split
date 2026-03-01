import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const searchSchema = z.object({
  id: z.string().optional(),
})

export const Route = createFileRoute('/chapters/form')({
  component: ChapterFormPage,
  validateSearch: searchSchema,
})

function ChapterFormPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const isEditing = !!search.id

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: implement save logic

    navigate({ to: '/' })
  }

  return (
    <AppLayout
      routeTitle={isEditing ? 'Edit Chapter' : 'New Chapter'}
      routeSubtitle="Manage your financial chapters"
    >
      <div className="mx-auto w-full max-w-md pt-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Card className="flex flex-col gap-4 p-6">
            <Field>
              <FieldLabel>Chapter Name</FieldLabel>
              <Input
                placeholder="e.g. Europe Trip 2026, February Expenses"
                autoFocus
                required
              />
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Input placeholder="Optional description..." />
            </Field>

            <Field>
              <FieldLabel>Target/Budget</FieldLabel>
              <Input type="number" step="1" placeholder="0.00" />
            </Field>
          </Card>

          <Button type="submit" size="lg" className="w-full font-bold">
            {isEditing ? 'Save Changes' : 'Create Chapter'}
          </Button>
        </form>
      </div>
    </AppLayout>
  )
}
