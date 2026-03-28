import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { getDatabase } from './database'

const betterAuthUrl = process.env.BETTER_AUTH_URL
const betterAuthSecret = process.env.BETTER_AUTH_SECRET

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

export const googleAuthEnabled = Boolean(googleClientId && googleClientSecret)

export const auth = betterAuth({
  appName: 'Nico Split',
  baseURL: betterAuthUrl,
  secret: betterAuthSecret,
  database: getDatabase(),
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
