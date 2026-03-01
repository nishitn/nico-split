import { AppLayout } from '@/components/layout/app-layout'
import { FormSection } from '@/components/layout/form-section'
import { FormNavButton } from '@/components/ui/form-nav-button'
import { PersonTxFormSection } from '@/features/transactions/components/personal-tx-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRightLeft, LucideIcon, UserIcon, UsersIcon } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

// #region Route

const searchSchema = z.object({
  id: z.string().optional(),
})

export const Route = createFileRoute('/transactions/form')({
  component: TransactionFormPage,
  validateSearch: searchSchema,
})

// #endregion

// #region Constants

type TxTypeHeading = 'personal' | 'split' | 'user_transfer'

const TX_TYPE_OPTIONS: {
  type: TxTypeHeading
  label: string
  icon: LucideIcon
}[] = [
  {
    type: 'personal',
    label: 'Personal',
    icon: UserIcon,
  },
  {
    type: 'split',
    label: 'Split',
    icon: UsersIcon,
  },
  {
    type: 'user_transfer',
    label: 'Send or Receive',
    icon: ArrowRightLeft,
  },
]
0
// #endregion

function TransactionFormPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const isEditing = !!search.id

  const [txType, setTxType] = useState<TxTypeHeading>('personal')

  return (
    <AppLayout routeTitle={isEditing ? 'Edit Transaction' : 'New Transaction'}>
      <form className="flex flex-col gap-4 md:gap-8">
        <TxTypeNavSection txType={txType} setTxType={setTxType} />
        {txType === 'personal' && <PersonTxFormSection />}
      </form>
    </AppLayout>
  )
}

function TxTypeNavSection({
  txType,
  setTxType,
}: {
  txType: TxTypeHeading
  setTxType: (txType: TxTypeHeading) => void
}) {
  return (
    <FormSection heading="Transaction Type">
      <div className="flex flex-row gap-2 md:gap-4">
        {TX_TYPE_OPTIONS.map(({ type, label, icon: Icon }) => {
          const isSelected = txType === type
          return (
            <FormNavButton
              key={type}
              onClick={() => setTxType(type)}
              isSelected={isSelected}
            >
              <Icon className="size-5" />
              {label}
            </FormNavButton>
          )
        })}
      </div>
    </FormSection>
  )
}
