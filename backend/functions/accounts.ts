import { createServerFn } from '@tanstack/react-start'
import { requireAuthSession } from '../auth-session'
import * as service from '../service'

export const getAccounts = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await requireAuthSession()
    return service.getAccounts(session.user.id)
  },
)
