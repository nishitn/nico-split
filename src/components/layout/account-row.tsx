import type { Account } from '@/features/accounts/types'
import {
  NsAmount,
  NsCard,
  NsContent,
  NsIcon,
  NsMainRow,
} from '@/components/ui/ns-card'
import { getAmountsColor } from '@/lib/utils'

export function AccountRow({ account }: { account: Account }) {
  const amountColor = getAmountsColor(account.balance, 'text-card-foreground')
  const accountType = account.type.replace('_', ' ')

  return (
    <NsCard>
      <NsIcon icon={account.icon} />
      <NsContent>
        <NsMainRow className="flex-1">
          <div className="flex w-full min-w-0 flex-col gap-1">
            <span className="text-card-foreground flex-1 truncate font-medium">
              {account.label}
            </span>
            <span className="text-muted-foreground flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-sm capitalize">
              {accountType}
            </span>
          </div>
          <NsAmount
            amount={account.balance}
            className={amountColor}
            showSign={true}
          />
        </NsMainRow>
      </NsContent>
    </NsCard>
  )
}
