import { createServerFn } from '@tanstack/react-start'
import { requireAuthSession } from '../auth-session'
import * as service from '../service'

const userIdValidator = (input: { userId: string }) => input

export const getUsers = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAuthSession()
  return service.getUsers()
})

export const getFriends = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await requireAuthSession()
  return service.getFriends(session.user.id)
})

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await requireAuthSession()
    return service.getCurrentUser(session.user.id)
  },
)

export const getPeopleBalances = createServerFn({ method: 'POST' })
  .inputValidator(userIdValidator)
  .handler(async ({ data }) => {
    const session = await requireAuthSession()
    return service.getPeopleBalances(session.user.id)
  })
