import { getDrizzleDb } from '@db/database'
import * as schema from '@db/schema'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

const betterAuthUrl = process.env.BETTER_AUTH_URL
const betterAuthSecret = process.env.BETTER_AUTH_SECRET

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

export const googleAuthEnabled = Boolean(googleClientId && googleClientSecret)

export const auth = betterAuth({
  appName: 'Nico Split',
  baseURL: betterAuthUrl,
  secret: betterAuthSecret,
  database: drizzleAdapter(getDrizzleDb(), {
    provider: 'sqlite',
    schema: {
      ...schema,
      user: schema.authUsersTable,
      session: schema.authSessionsTable,
      account: schema.authAccountsTable,
      verification: schema.authVerificationsTable,
    },
  }),
  socialProviders: googleAuthEnabled
    ? {
        google: {
          clientId: googleClientId!,
          clientSecret: googleClientSecret!,
          prompt: 'select_account',
        },
      }
    : undefined,
  plugins: [tanstackStartCookies()],
})
