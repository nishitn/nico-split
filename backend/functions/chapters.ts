import { createServerFn } from '@tanstack/react-start'
import { requireAuthSession } from '../auth-session'
import * as service from '../service'

export const getChapters = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await requireAuthSession()
    return service.getChapters(session.user.id)
  },
)
