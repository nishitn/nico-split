import { createServerFn } from '@tanstack/react-start'
import { requireAuthSession } from './auth-session'
import * as service from './service'

export const getUsers = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await requireAuthSession()
  return service.getUsers(session.user.name)
})

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await requireAuthSession()
    return service.getCurrentUser(session.user.name)
  },
)

export const getAccounts = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAuthSession()
    return service.getAccounts()
  },
)

export const getCategories = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAuthSession()
    return service.getCategories()
  },
)

export const getChapters = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAuthSession()
    return service.getChapters()
  },
)

export const getGroups = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await requireAuthSession()
  return service.getGroups(session.user.name)
})

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
    return service.getTransactions(data.month, data.year, session.user.name)
  })

export const getGroupBalances = createServerFn({ method: 'POST' })
  .inputValidator(userMonthYearValidator)
  .handler(async ({ data }) => {
    const session = await requireAuthSession()
    return service.getGroupBalances(
      data.userId,
      data.month,
      data.year,
      session.user.name,
    )
  })

export const getMonthlyStats = createServerFn({ method: 'POST' })
  .inputValidator(userMonthYearValidator)
  .handler(async ({ data }) => {
    const session = await requireAuthSession()
    return service.getMonthlyStats(
      data.userId,
      data.month,
      data.year,
      session.user.name,
    )
  })

export const getCategoryStats = createServerFn({ method: 'POST' })
  .inputValidator(userMonthYearValidator)
  .handler(async ({ data }) => {
    const session = await requireAuthSession()
    return service.getCategoryStats(
      data.userId,
      data.month,
      data.year,
      session.user.name,
    )
  })

export const getPeopleBalances = createServerFn({ method: 'POST' })
  .inputValidator((input: { userId: string }) => input)
  .handler(async ({ data }) => {
    const session = await requireAuthSession()
    return service.getPeopleBalances(data.userId, session.user.name)
  })

export const getDatabaseTables = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAuthSession()
    return service.getDatabaseTables()
  },
)

export const getDatabaseTablePreview = createServerFn({ method: 'POST' })
  .inputValidator((input: { tableName: string; limit?: number }) => input)
  .handler(async ({ data }) => {
    await requireAuthSession()
    return service.getDatabaseTablePreview(data.tableName, data.limit)
  })
