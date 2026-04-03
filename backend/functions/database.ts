import { createServerFn } from '@tanstack/react-start'
import { requireAuthSession } from '../auth-session'
import * as service from '../service'

const databaseTablePreviewValidator = (input: {
  tableName: string
  limit?: number
}) => input

export const getDatabaseTables = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAuthSession()
    return service.getDatabaseTables()
  },
)

export const getDatabaseTablePreview = createServerFn({ method: 'POST' })
  .inputValidator(databaseTablePreviewValidator)
  .handler(async ({ data }) => {
    await requireAuthSession()
    return service.getDatabaseTablePreview(data.tableName, data.limit)
  })
