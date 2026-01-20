import { GroupBalance } from '@/features/groups/types'
import { getOwesColor, getOwesText } from '@/lib/utils'
import { CurrencySpan } from '../ui/currency-span'
import { NsCard, NsContent, NsIcon, NsMainRow, NsSubRow } from '../ui/ns-card'
import { Separator } from '../ui/separator'

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
      <div className="flex flex-col gap-1 flex-1">
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
      <div className="flex flex-col gap-1 items-end">
        <span className="text-muted-foreground uppercase text-sm font-semibold">
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
          <div className="flex flex-col gap-1 w-full">
            {displayEntries.map(([userId, owes]) => {
              const member = groupBalance.group.members.find(
                (u) => u.id === userId,
              )
              const itemOwesColor = getOwesColor(owes, 'text-card-foreground')
              const itemOwesText = getOwesText(owes, member)

              return (
                <div key={userId} className="flex flex-row gap-1 w-full">
                  <span className="flex-1">{itemOwesText}</span>
                  <span className={itemOwesColor}>
                    <CurrencySpan amount={owes} />
                  </span>
                </div>
              )
            })}
            {remainingCount > 0 && (
              <div className="text-xs pt-1 text-muted-foreground w-full text-center">
                + {remainingCount} others
              </div>
            )}
          </div>
        )
      })()}
    </NsSubRow>
  )
}
