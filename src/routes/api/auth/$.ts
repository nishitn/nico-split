import { createFileRoute } from '@tanstack/react-router'
import { createServerOnlyFn } from '@tanstack/react-start'

const handleAuthRequest = createServerOnlyFn(async (request: Request) => {
  const { auth } = await import('../../../../backend/auth')
  return auth.handler(request)
})

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        return handleAuthRequest(request)
      },
      POST: async ({ request }: { request: Request }) => {
        return handleAuthRequest(request)
      },
    },
  },
})
