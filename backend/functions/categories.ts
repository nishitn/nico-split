import { createServerFn } from '@tanstack/react-start'
import { requireAuthSession } from '../auth-session'
import * as service from '../service'

const userMonthYearValidator = (input: {
  userId: string
  month: number
  year: number
}) => input

export const getCategories = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await requireAuthSession()
    return service.getCategories(session.user.id)
  },
)

export const getCategoryStats = createServerFn({ method: 'POST' })
  .inputValidator(userMonthYearValidator)
  .handler(async ({ data }) => {
    const session = await requireAuthSession()
    return service.getCategoryStats(session.user.id, data.month, data.year)
  })
