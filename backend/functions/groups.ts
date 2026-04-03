import { createServerFn } from '@tanstack/react-start'
import { requireAuthSession } from '../auth-session'
import * as service from '../service'

const userMonthYearValidator = (input: {
  userId: string
  month: number
  year: number
}) => input

export const getGroups = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await requireAuthSession()
  return service.getGroups(session.user.id)
})

export const getGroupBalances = createServerFn({ method: 'POST' })
  .inputValidator(userMonthYearValidator)
  .handler(async ({ data }) => {
    const session = await requireAuthSession()
    return service.getGroupBalances(session.user.id, data.month, data.year)
  })
