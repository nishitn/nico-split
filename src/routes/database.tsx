import { AppLayout } from '@/components/layout/app-layout'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDatabaseTables } from '@/features/database/api'
import { DatabaseViewerSection } from '@/features/database/components/database-viewer-section'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { z } from 'zod'

const searchSchema = z.object({
  table: z.string().optional(),
})

export const Route = createFileRoute('/database')({
  component: DatabasePage,
  validateSearch: searchSchema,
})

function DatabasePage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()
  const { data: tables = [], isLoading } = useDatabaseTables()

  const selectedTableName = tables.some((table) => table.name === search.table)
    ? search.table
    : tables[0]?.name

  useEffect(() => {
    if (!selectedTableName || search.table === selectedTableName) {
      return
    }

    navigate({
      replace: true,
      search: {
        table: selectedTableName,
      },
    })
  }, [navigate, search.table, selectedTableName])

  return (
    <AppLayout routeTitle="Database" routeSubtitle="Browse saved records">
      <div className="flex flex-col gap-4 pb-20 md:pb-8">
        <div className="border-border bg-card/40 flex flex-col gap-3 rounded-xl border p-4 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Table</span>
            {selectedTableName ? (
              <Badge variant="outline">
                {tables.find((table) => table.name === selectedTableName)?.rowCount ??
                  0}{' '}
                rows
              </Badge>
            ) : null}
          </div>

          <Select
            value={selectedTableName}
            onValueChange={(tableName) =>
              navigate({
                search: {
                  table: tableName,
                },
              })
            }
            disabled={isLoading || tables.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a table" />
            </SelectTrigger>
            <SelectContent>
              {tables.map((table) => (
                <SelectItem key={table.name} value={table.name}>
                  {table.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <DatabaseViewerSection tableName={selectedTableName} />
        </div>
      </div>
    </AppLayout>
  )
}
