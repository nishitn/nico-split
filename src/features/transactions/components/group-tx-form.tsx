import { FormSection } from '@/components/layout/form-section'
import { FieldRow } from '@/components/ui/field-row'
import { InputGroup, InputGroupInput } from '@/components/ui/input-group'
import { Currency, CURRENCY_META } from '@/features/accounts/types'
import {
  AmountInput,
  DateInput,
  RequiredFormData,
  TimeInput,
} from '@/features/transactions/components/common-tx-input'
import { GroupTransactionType } from '@/features/transactions/types'
import { useState } from 'react'

interface GroupTxMetadata {}

export function GroupTxFormSection() {
  const [groupTxType, setGroupTxType] = useState<GroupTransactionType>(
    GroupTransactionType.SPLIT,
  )

  const [formData, setFormData] = useState<RequiredFormData>({
    amount: '',
    currency: Currency.INR,
    date: new Date(),
    note: '',
  })

  const updateForm = (updates: Partial<RequiredFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const [metadata, setMetadata] = useState<GroupTxMetadata>({})

  const updateMetadata = (updates: Partial<GroupTxMetadata>) => {
    setMetadata((prev) => ({ ...prev, ...updates }))
  }

  const currencySymbol = CURRENCY_META[formData.currency].symbol
  const isTransfer = groupTxType === GroupTransactionType.TRANSFER

  return (
    <>
      <FormSection heading="Details">
        <div className="flex flex-col gap-4">
          <FieldRow label="Group">
            <></>
          </FieldRow>
          <FieldRow label="People">
            <></>
          </FieldRow>

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
    </>
  )
}
