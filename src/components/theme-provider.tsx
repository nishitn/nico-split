import * as React from 'react'

type Theme = 'dark'

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'dark',
  setTheme: () => null,
}

const ThemeProviderContext =
  React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme] = React.useState<Theme>('dark')

  React.useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')
    root.classList.add('dark')
  }, [theme])

  const value = {
    theme,
    setTheme: () => {},
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)
  return context
}
