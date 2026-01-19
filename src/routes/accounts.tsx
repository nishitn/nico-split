import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout/app-layout'
import { useAccounts } from '@/features/accounts/api'

export const Route = createFileRoute('/accounts')({
  component: AccountsPage,
})

function AccountsPage() {
  const { data: accounts, isLoading } = useAccounts()
  //   const { data: user } = useCurrentUser()

  const totalBalance =
    accounts?.reduce((acc, curr) => acc + curr.balance, 0) || 0

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 pb-20 md:pb-0">
        <h1 className="text-2xl font-bold tracking-tight md:hidden">
          Accounts
        </h1>

        <div className="from-primary/80 rounded-2xl bg-gradient-to-br to-emerald-600 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium opacity-90">
              Total Balance
            </span>
            <span className="text-4xl font-bold">
              {totalBalance.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
              })}
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div>Loading accounts...</div>
          ) : (
            accounts?.map((account) => (
              <div
                key={account.id}
                className="border-border bg-card hover:bg-muted/30 flex items-center justify-between rounded-xl border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-secondary flex h-10 w-10 items-center justify-center rounded-full">
                    <account.icon className="text-foreground h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{account.label}</span>
                    <span className="text-muted-foreground text-xs uppercase">
                      {account.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <span className="text-lg font-bold">
                  {account.balance.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: account.currency.toUpperCase(),
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  )
}
