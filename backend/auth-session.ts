import { createServerFn, createServerOnlyFn } from '@tanstack/react-start'

interface AuthState {
  googleAuthEnabled: boolean
  session: null | {
    user: {
      id: string
      name: string
      email: string
      image: string | null
    }
  }
}

export async function requireAuthSession() {
  const session = await getRequiredAuthSession()

  if (!session) {
    throw new Response('Unauthorized', {
      status: 401,
    })
  }

  return session
}

const getRequiredAuthSession = createServerOnlyFn(async () => {
  const [{ auth }, { getRequestHeaders }] = await Promise.all([
    import('./auth'),
    import('@tanstack/react-start/server'),
  ])

  return auth.api.getSession({
    headers: getRequestHeaders(),
  })
})

const getServerAuthState = createServerOnlyFn(async (): Promise<AuthState> => {
  const [{ auth, googleAuthEnabled }, { getRequestHeaders }] =
    await Promise.all([
      import('./auth'),
      import('@tanstack/react-start/server'),
    ])
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  })

  if (!session) {
    return {
      googleAuthEnabled,
      session: null,
    }
  }

  return {
    googleAuthEnabled,
    session: {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
      },
    },
  }
})

export const getAuthState = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AuthState> => {
    return getServerAuthState()
  },
)
