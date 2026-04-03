import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './backend/schema/index.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: './data/nico-split.db',
  },
})
