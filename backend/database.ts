import { DB_DIRECTORY, DB_PATH } from '@db/db-config'
import Database from 'better-sqlite3'
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { mkdirSync } from 'node:fs'
import * as schema from './schema'

declare global {
  // Reuse the SQLite connection across server reloads in development.
  var __nicoSplitDb: InstanceType<typeof Database> | undefined
  // Reuse the initialized Drizzle client so migrations and seeding only run once per process.
  var __nicoSplitDrizzleDb: BetterSQLite3Database<typeof schema> | undefined
}

function createDatabase() {
  // Opening the file creates it if it does not exist yet.
  mkdirSync(DB_DIRECTORY, { recursive: true })
  return new Database(DB_PATH)
}

export function getDatabase() {
  if (globalThis.__nicoSplitDb) {
    return globalThis.__nicoSplitDb
  }

  const database = createDatabase()
  globalThis.__nicoSplitDb = database
  return database
}

export function getDrizzleDb(): BetterSQLite3Database<typeof schema> {
  if (globalThis.__nicoSplitDrizzleDb) {
    return globalThis.__nicoSplitDrizzleDb
  }

  const drizzleDb = drizzle({
    client: getDatabase(),
    schema,
  })
  // First run creates the file, and Drizzle migrations create or update the schema.
  migrate(drizzleDb, { migrationsFolder: './drizzle' })

  globalThis.__nicoSplitDrizzleDb = drizzleDb
  return drizzleDb
}

export { DB_PATH }
