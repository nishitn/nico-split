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

export const Route = createFileRoute('/categories/form')({
  component: CategoryFormPage,
  validateSearch: searchSchema,
})

function CategoryFormPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const isEditing = !!search.id

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: implement save logic

    navigate({ to: '/categories' })
  }

  return (
    <AppLayout
      routeTitle={isEditing ? 'Edit Category' : 'New Category'}
      routeSubtitle="Manage category details"
    >
      <div className="mx-auto w-full max-w-md pt-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Card className="flex flex-col gap-4 p-6">
            <Field>
              <FieldLabel>Category Name</FieldLabel>
              <Input placeholder="e.g. Food, Transport" autoFocus required />
            </Field>

            <Field>
              <FieldLabel>Icon</FieldLabel>
              <Input placeholder="e.g. 🍔, 🚗" required />
            </Field>

            <Field>
              <FieldLabel>Color code</FieldLabel>
              <Input
                type="color"
                className="h-10 w-full p-1"
                defaultValue="#3b82f6"
                required
              />
            </Field>
          </Card>

          <Button type="submit" size="lg" className="w-full font-bold">
            {isEditing ? 'Save Changes' : 'Create Category'}
          </Button>
        </form>
      </div>
    </AppLayout>
  )
}
