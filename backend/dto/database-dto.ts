export interface DatabaseTableDto {
  name: string
  rowCount: number
  columns: Array<string>
}

export interface DatabaseTablePreviewDto {
  tableName: string
  rowCount: number
  previewLimit: number
  columns: Array<string>
  rows: Array<Record<string, string | null>>
}
