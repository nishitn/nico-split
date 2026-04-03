import { useLocation, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Wallet } from 'lucide-react'
import { getActiveFormContext } from '@/components/layout/layout-route'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function MobileHeader({
  routeTitle,
  routeSubtitle,
  mobileAction,
}: {
  routeTitle?: string
  routeSubtitle?: string
  mobileAction?: {
    to: string
    text: string
  }
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const activeForm = getActiveFormContext(location.pathname, location.searchStr)

  if (activeForm) {
    return (
      <header className="bg-background sticky top-0 z-10 md:hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate({ to: activeForm.parentHref })}
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            {routeTitle && <p className="truncate text-lg font-semibold">{routeTitle}</p>}
            {routeSubtitle ? (
              <p className="text-muted-foreground truncate text-xs">
                {routeSubtitle}
              </p>
            ) : null}
          </div>
        </div>
        <Separator />
      </header>
    )
  }

  return (
    <header className="bg-background sticky top-0 z-10 flex h-16 items-center justify-between md:hidden">
      <div className="flex w-full flex-col">
        <div className="flex items-center gap-2 px-4">
          <MainLogo />
          {mobileAction ? (
            <span className="text-muted-foreground truncate text-xs">
              {mobileAction.text}
            </span>
          ) : null}
        </div>
        <Separator />
      </div>
    </header>
  )
}

export function MainLogo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <Wallet className="text-primary h-8 w-8" />
      <span className="text-xl font-bold">NicoSplit</span>
    </div>
  )
}
