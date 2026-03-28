import '@fontsource/roboto/500.css'

import { getAuthState } from '../../backend/auth-session'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { LoaderCircle, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

const signInSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/sign-in')({
  validateSearch: signInSearchSchema,
  loader: () => getAuthState(),
  component: SignInPage,
})

function SignInPage() {
  const search = Route.useSearch()
  const authState = Route.useLoaderData()
  const [isSigningIn, setIsSigningIn] = useState(false)

  const targetUrl =
    typeof window === 'undefined'
      ? search.redirect ?? '/'
      : new URL(search.redirect ?? '/', window.location.origin).toString()

  const handleGoogleSignIn = async () => {
    if (!authState.googleAuthEnabled || isSigningIn) {
      return
    }

    setIsSigningIn(true)

    await authClient.signIn.social({
      provider: 'google',
      callbackURL: targetUrl,
    })
  }

  return (
    <div className="bg-background text-foreground relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <div className="bg-primary/10 absolute top-0 left-0 h-72 w-72 -translate-x-1/3 -translate-y-1/3 rounded-full blur-3xl" />
      <div className="bg-primary/8 absolute right-0 bottom-0 h-80 w-80 translate-x-1/4 translate-y-1/4 rounded-full blur-3xl" />

      <Card className="border-border/80 bg-card/95 relative z-10 w-full max-w-[420px] py-0 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
        <CardHeader className="gap-4 border-b border-white/8 pt-8 pb-6">
          <div className="bg-primary/12 text-primary inline-flex h-11 w-11 items-center justify-center rounded-2xl">
            <LockKeyhole className="size-5" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl leading-tight font-semibold tracking-[-0.02em]">
              Sign in to Nico Split
            </CardTitle>
            <CardDescription className="text-muted-foreground text-[15px] leading-6">
              Continue with Google to access your workspace.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-6 pb-6">
          <Button
            type="button"
            size="lg"
            className="h-11 w-full justify-center gap-3 rounded-full border border-[#8e918f] bg-white px-4 text-[14px] font-medium text-[#1f1f1f] shadow-none hover:bg-[#f8fbff] hover:text-[#1f1f1f] focus-visible:border-[#1a73e8] focus-visible:ring-[#1a73e8]/30 disabled:border-[#5f6368] disabled:bg-[#f1f3f4] disabled:text-[#5f6368]"
            disabled={!authState.googleAuthEnabled || isSigningIn}
            onClick={handleGoogleSignIn}
            style={{ fontFamily: 'Roboto, Arial, sans-serif' }}
          >
            <GoogleMark />
            <span>Sign in with Google</span>
            {isSigningIn ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : null}
          </Button>

          {!authState.googleAuthEnabled ? (
            <div
              className={cn(
                'rounded-2xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-sm leading-6 text-amber-200',
              )}
            >
              Sign-in is temporarily unavailable. Please try again later.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg
      aria-hidden="true"
      className="size-[18px] shrink-0"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.44a5.5 5.5 0 0 1-2.39 3.61v2.99h3.86c2.26-2.08 3.58-5.15 3.58-8.84z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.07 7.94-2.89l-3.86-2.99c-1.07.72-2.44 1.15-4.08 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.27 14.31a7.24 7.24 0 0 1 0-4.62V6.6H1.29a12 12 0 0 0 0 10.8l3.98-3.09z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.77c1.76 0 3.35.61 4.6 1.82l3.45-3.45C17.95 1.14 15.24 0 12 0 7.31 0 3.27 2.69 1.29 6.6l3.98 3.09C6.22 6.88 8.87 4.77 12 4.77z"
        fill="#EA4335"
      />
    </svg>
  )
}
