import { CurrencySpan } from '@/components/ui/currency-span'
import {
  NsCard,
  NsContent,
  NsIcon,
  NsMainRow,
  NsSubRow,
} from '@/components/ui/ns-card'
import { Separator } from '@/components/ui/separator'
import type { GroupBalance } from '@/features/groups/types'
import { getOwesColor, getOwesText } from '@/lib/utils'

export function GroupRow({ groupBalance }: { groupBalance: GroupBalance }) {
  return (
    <NsCard>
      <NsIcon icon={groupBalance.group.icon} />
      <NsContent>
        <NsMainRow>
          <GroupSummarySection groupBalance={groupBalance} />
        </NsMainRow>
        {groupBalance.balance !== 0 && (
          <>
            <Separator />
            <GroupUserOwesRow groupBalance={groupBalance} />
          </>
        )}
      </NsContent>
    </NsCard>
  )
}

function GroupSummarySection({ groupBalance }: { groupBalance: GroupBalance }) {
  const owes = groupBalance.balance
  const owesColor = getOwesColor(owes, 'text-card-foreground')
  const owesText = getOwesText(owes)

  const monthlyOwes = Object.values(groupBalance.monthlyOwes).reduce(
    (sum, amount) => sum + amount,
    0,
  )
  const monthlyOwesColor = getOwesColor(monthlyOwes, 'text-card-foreground')
  const monthlyOwesText = getOwesText(monthlyOwes)

  return (
    <>
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-card-foreground">{groupBalance.group.label}</span>
        {owesText !== '' && (
          <span className={owesColor}>
            {owesText} <CurrencySpan amount={owes} />
          </span>
        )}
        {owesText === '' && (
          <span className="text-muted-foreground font-semibold">
            You are settled
          </span>
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-muted-foreground text-sm font-semibold uppercase">
          This Month
        </span>
        <span className={monthlyOwesColor}>
          {monthlyOwesText} <CurrencySpan amount={monthlyOwes} />
        </span>
      </div>
    </>
  )
}

function GroupUserOwesRow({ groupBalance }: { groupBalance: GroupBalance }) {
  return (
    <NsSubRow className="text-muted-foreground">
      {(() => {
        const entries = Object.entries(groupBalance.overallOwes).filter(
          ([_, owes]) => owes !== 0,
        )

        const showLimit = entries.length > 3 ? 2 : entries.length
        const displayEntries = entries.slice(0, showLimit)
        const remainingCount = entries.length - showLimit

        return (
          <div className="flex w-full flex-col gap-1">
            {displayEntries.map(([userId, owes]) => {
              const member = groupBalance.group.members.find(
                (u) => u.id === userId,
              )
              const itemOwesColor = getOwesColor(owes, 'text-card-foreground')
              const itemOwesText = getOwesText(owes, member)

              return (
                <div key={userId} className="flex w-full flex-row gap-1">
                  <span className="flex-1">{itemOwesText}</span>
                  <span className={itemOwesColor}>
                    <CurrencySpan amount={owes} />
                  </span>
                </div>
              )
            })}
            {remainingCount > 0 && (
              <div className="text-muted-foreground w-full pt-1 text-center text-xs">
                + {remainingCount} others
              </div>
            )}
          </div>
        )
      })()}
    </NsSubRow>
  )
}
