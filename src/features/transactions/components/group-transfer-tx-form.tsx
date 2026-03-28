import { FormSection } from '@/components/layout/form-section'
import { Button } from '@/components/ui/button'
import { FieldRow } from '@/components/ui/field-row'
import { InputGroup, InputGroupInput } from '@/components/ui/input-group'
import { Currency, CURRENCY_META } from '@/features/accounts/types'
import {
  AmountInput,
  DateInput,
  type RequiredFormData,
  TimeInput,
} from '@/features/transactions/components/common-tx-input'
import {
  GroupPeopleInput,
  type GroupPeopleMetadata,
  UserSelect,
} from '@/features/transactions/components/group-tx-form'
import { useCurrentUser } from '@/features/users/api'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

interface TransferMetadata extends GroupPeopleMetadata {
  transferFromId: string
  transferToId: string
}

export function GroupTransferTxFormSection() {
  const navigate = useNavigate()
  const { data: currentUser } = useCurrentUser()

  const [formData, setFormData] = useState<RequiredFormData>({
    amount: '',
    currency: Currency.INR,
    date: new Date(),
    note: '',
  })
  const [metadata, setMetadata] = useState<TransferMetadata>({
    groupId: '',
    members: [],
    selectionMode: 'none',
    transferFromId: '',
    transferToId: '',
  })

  const currencySymbol = CURRENCY_META[formData.currency].symbol

  const updateForm = (updates: Partial<RequiredFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const updateMetadata = (updates: Partial<TransferMetadata>) => {
    setMetadata((prev) => ({ ...prev, ...updates }))
  }

  useEffect(() => {
    if (metadata.members.length === 0) {
      setMetadata((prev) => ({
        ...prev,
        transferFromId: '',
        transferToId: '',
      }))
      return
    }

    setMetadata((prev) => {
      const availableIds = new Set(metadata.members.map((person) => person.id))
      let transferFromId = prev.transferFromId
      let transferToId = prev.transferToId

      if (!transferFromId || !availableIds.has(transferFromId as never)) {
        transferFromId =
          metadata.members.find((person) => person.id === currentUser.id)?.id ??
          metadata.members[0]?.id ??
          ''
      }

      if (
        !transferToId ||
        !availableIds.has(transferToId as never) ||
        transferToId === transferFromId
      ) {
        transferToId =
          metadata.members.find((person) => person.id !== transferFromId)?.id ??
          ''
      }

      return {
        ...prev,
        transferFromId,
        transferToId,
      }
    })
  }, [currentUser.id, metadata.members])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ to: '/transactions' })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 md:gap-10">
      <FormSection heading="Who">
        <GroupPeopleInput metadata={metadata} updateMetadata={updateMetadata} />
      </FormSection>

      <FormSection heading="Details">
        <div className="flex flex-col gap-4">
          <FieldRow label="Amount">
            <AmountInput
              formData={formData}
              updateForm={updateForm}
              currencySymbol={currencySymbol}
            />
          </FieldRow>
          <div className="flex flex-row gap-2 xl:gap-10">
            <FieldRow label="Date">
              <DateInput formData={formData} updateForm={updateForm} />
            </FieldRow>
            <FieldRow label="Time" className="md:hidden xl:block">
              <TimeInput formData={formData} updateForm={updateForm} />
            </FieldRow>
          </div>
          <FieldRow label="Note">
            <InputGroup>
              <InputGroupInput
                id="note"
                type="text"
                placeholder="Add a note"
                value={formData.note}
                onChange={(e) => updateForm({ note: e.target.value })}
              />
            </InputGroup>
          </FieldRow>
        </div>
      </FormSection>

      <FormSection heading="Transfer">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="min-w-0 flex-1">
              <FieldRow label="From">
                <UserSelect
                  people={metadata.members}
                  value={metadata.transferFromId}
                  onChange={(transferFromId) =>
                    updateMetadata({ transferFromId })
                  }
                  placeholder="Select sender"
                />
              </FieldRow>
            </div>
            <div className="min-w-0 flex-1">
              <FieldRow label="To">
                <UserSelect
                  people={metadata.members.filter(
                    (person) => person.id !== metadata.transferFromId,
                  )}
                  value={metadata.transferToId}
                  onChange={(transferToId) => updateMetadata({ transferToId })}
                  placeholder="Select receiver"
                />
              </FieldRow>
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            type="submit"
            size="lg"
            className="w-full font-semibold shadow-sm sm:w-auto sm:min-w-48"
          >
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto sm:min-w-32"
            onClick={() => navigate({ to: '/transactions' })}
          >
            Cancel
          </Button>
        </div>
      </FormSection>
    </form>
  )
}
