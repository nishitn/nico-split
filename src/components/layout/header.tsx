import { Separator } from '@/components/ui/separator'
import { Wallet } from 'lucide-react'

export function MobileHeader() {
  return (
    <header className="bg-background sticky top-0 z-10 flex h-16 items-center justify-between md:hidden">
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2 px-4">
          <MainLogo />
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
