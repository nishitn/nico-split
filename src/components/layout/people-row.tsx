import { CurrencySpan } from '@/components/ui/currency-span'
import { NsCard, NsContent, NsIcon, NsMainRow } from '@/components/ui/ns-card'
import type { PeopleBalance } from '@/features/users/types'
import { getOwesColor, getOwesText } from '@/lib/utils'
import { User } from 'lucide-react'

export function PeopleRow({ peopleBalance }: { peopleBalance: PeopleBalance }) {
  const owesColor = getOwesColor(peopleBalance.owes, 'text-card-foreground')
  const owesText = getOwesText(peopleBalance.owes)

  return (
    <NsCard>
      <NsIcon icon={User} />
      <NsContent>
        <NsMainRow className="flex-1">
          <span className="text-card-foreground flex-1 truncate font-medium">
            {peopleBalance.user.name}
          </span>
          <span className={owesColor}>
            {owesText} <CurrencySpan amount={peopleBalance.owes} />
          </span>
        </NsMainRow>
      </NsContent>
    </NsCard>
  )
}
