import { createServerFn } from '@tanstack/react-start'
import { requireAuthSession } from '../auth-session'
import * as service from '../service'

const monthYearValidator = (input: { month: number; year: number }) => input
const userMonthYearValidator = (input: {
  userId: string
  month: number
  year: number
}) => input

export const getTransactions = createServerFn({ method: 'POST' })
  .inputValidator(monthYearValidator)
  .handler(async ({ data }) => {
    const session = await requireAuthSession()
    return service.getTransactions(session.user.id, data.month, data.year)
  })

export const getMonthlyStats = createServerFn({ method: 'POST' })
  .inputValidator(userMonthYearValidator)
  .handler(async ({ data }) => {
    const session = await requireAuthSession()
    return service.getMonthlyStats(session.user.id, data.month, data.year)
  })
