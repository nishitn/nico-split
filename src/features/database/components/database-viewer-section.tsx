import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useDatabaseTablePreview } from '@/features/database/api'
import { cn } from '@/lib/utils'

export function DatabaseViewerSection({ tableName }: { tableName?: string }) {
  if (!tableName) {
    return (
      <div className="text-muted-foreground rounded-xl border border-dashed p-6">
        No tables available.
      </div>
    )
  }

  return <TablePreviewPanel tableName={tableName} />
}

function TablePreviewPanel({ tableName }: { tableName: string }) {
  const { data, isLoading } = useDatabaseTablePreview(tableName)

  if (isLoading || !data) {
    return (
      <div className="text-muted-foreground rounded-xl border border-dashed p-4">
        Loading rows...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold">{data.tableName}</h3>
        <Badge variant="outline">{data.rowCount} rows</Badge>
        <Badge variant="outline">{data.columns.length} columns</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {data.columns.map((column) => (
          <Badge key={column} variant="secondary">
            {column}
          </Badge>
        ))}
      </div>

      <Separator />

      {data.rows.length === 0 ? (
        <div className="text-muted-foreground rounded-xl border border-dashed p-4">
          This table is empty.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-muted/40">
              <tr>
                {data.columns.map((column) => (
                  <th
                    key={column}
                    className="border-border text-foreground border-b px-4 py-3 font-medium"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rowIndex) => (
                <tr
                  key={`${data.tableName}-${rowIndex.toString()}`}
                  className={cn(
                    'border-border border-b align-top last:border-b-0',
                    rowIndex % 2 === 0 ? 'bg-card' : 'bg-muted/10',
                  )}
                >
                  {data.columns.map((column) => (
                    <td
                      key={`${rowIndex.toString()}-${column}`}
                      className="text-muted-foreground max-w-[280px] px-4 py-3 font-mono text-xs break-words whitespace-pre-wrap"
                    >
                      {row[column] ?? 'NULL'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
