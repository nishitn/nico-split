import { useNavigate } from '@tanstack/react-router'
import { ChevronDownIcon, SparklesIcon, TriangleAlertIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SplitType } from '../types'
import type { User } from '@/features/users/types'
import type {GroupPeopleMetadata} from '@/features/transactions/components/group-tx-form';
import type {RequiredFormData} from '@/features/transactions/components/common-tx-input';
import { FormSection } from '@/components/layout/form-section'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldRow } from '@/components/ui/field-row'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CURRENCY_META, Currency } from '@/features/accounts/types'
import { useCategories } from '@/features/categories/api'
import { CategoryType } from '@/features/categories/types'
import {
  AmountInput,
  DateInput,
  
  TimeInput
} from '@/features/transactions/components/common-tx-input'
import {
  GroupPeopleInput
  
} from '@/features/transactions/components/group-tx-form'
import { useCurrentUser } from '@/features/users/api'
import { cn, getPaidByText } from '@/lib/utils'

type AmountMap = Record<string, number>
type SplitEntry = { amount: string; included: boolean }

interface SplitTxMetadata extends GroupPeopleMetadata {
  splitCategoryId: string
  paidBy: AmountMap
  owes: AmountMap
}

export function GroupSplitTxFormSection() {
  const navigate = useNavigate()
  const { data: currentUser } = useCurrentUser()

  const [splitType, setSplitType] = useState<SplitType>(SplitType.EQUAL)
  const [splitDistribution, setSplitDistribution] = useState<
    Record<string, SplitEntry>
  >({})

  const [formData, setFormData] = useState<RequiredFormData>({
    amount: '',
    currency: Currency.INR,
    date: new Date(),
    note: '',
  })

  const updateForm = (updates: Partial<RequiredFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const [metadata, setMetadata] = useState<SplitTxMetadata>({
    groupId: '',
    members: [],
    selectionMode: 'none',
    splitCategoryId: '',
    paidBy: {},
    owes: {},
  })

  const updateMetadata = (updates: Partial<SplitTxMetadata>) => {
    setMetadata((prev) => ({ ...prev, ...updates }))
  }

  const currencySymbol = CURRENCY_META[formData.currency].symbol
  const totalAmount = parseFloat(formData.amount) || 0

  useEffect(() => {
    setSplitDistribution((prev) => {
      const next: Record<string, SplitEntry> = {}
      for (const person of metadata.members) {
        next[person.id] = prev[person.id] ?? { amount: '', included: true }
      }
      return next
    })
  }, [currentUser.id, formData.amount, metadata.members])

  const applySplitSuggestion = (
    targetPeople: Array<User>,
    options?: { excludeCurrentUser?: boolean; roundToWhole?: boolean },
  ) => {
    const eligiblePeople = targetPeople.filter((person) =>
      options?.excludeCurrentUser ? person.id !== currentUser.id : true,
    )

    if (eligiblePeople.length === 0) return

    const amounts = distributeAmounts(
      totalAmount,
      eligiblePeople.length,
      options?.roundToWhole ?? false,
    )

    setSplitType(SplitType.UNEQUAL)
    setSplitDistribution((prev) => {
      const next = { ...prev }

      metadata.members.forEach((person) => {
        next[person.id] = {
          ...prev[person.id],
          included: false,
          amount: '',
        }
      })

      eligiblePeople.forEach((person, index) => {
        next[person.id] = {
          ...next[person.id],
          included: true,
          amount: amounts[index],
        }
      })

      if (options?.excludeCurrentUser) {
        next[currentUser.id] = {
          ...next[currentUser.id],
          included: false,
          amount: '',
        }
      }

      return next
    })
  }

  return (
    <>
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
                placeholder="Dinner, rent, cab, etc."
                value={formData.note}
                onChange={(e) => updateForm({ note: e.target.value })}
              />
            </InputGroup>
          </FieldRow>
        </div>
      </FormSection>

      <FormSection heading="Split">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="min-w-0 flex-1">
              <PaidByPanel
                currentUser={currentUser}
                totalAmount={formData.amount}
                currencySymbol={currencySymbol}
                metadata={metadata}
                updateMetadata={updateMetadata}
              />
            </div>

            <div className="min-w-0 flex-1">
              <FieldRow label="Split">
                <SplitTypeSelect
                  splitType={splitType}
                  onSplitTypeChange={setSplitType}
                  canImprove={totalAmount > 0 && metadata.members.length > 0}
                  onEqualEveryone={() => applySplitSuggestion(metadata.members)}
                  onEqualOthers={() =>
                    applySplitSuggestion(metadata.members, {
                      excludeCurrentUser: true,
                    })
                  }
                  onRoundedEveryone={() =>
                    applySplitSuggestion(metadata.members, {
                      roundToWhole: true,
                    })
                  }
                />
              </FieldRow>
            </div>
          </div>

          <FieldRow label="Category">
            <GroupCategoryInput
              categoryId={metadata.splitCategoryId}
              onChange={(splitCategoryId) =>
                updateMetadata({ splitCategoryId })
              }
            />
          </FieldRow>

          {splitType === SplitType.UNEQUAL && metadata.members.length > 0 ? (
            <UnequalSplitPanel
              people={metadata.members}
              totalAmount={formData.amount}
              currencySymbol={currencySymbol}
              splits={splitDistribution}
              onSplitsChange={setSplitDistribution}
            />
          ) : null}
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
    </>
  )
}

function PaidByPanel({
  currentUser,
  totalAmount,
  currencySymbol,
  metadata,
  updateMetadata,
}: {
  currentUser: User
  totalAmount: string
  currencySymbol: string
  metadata: SplitTxMetadata
  updateMetadata: (updates: Partial<SplitTxMetadata>) => void
}) {
  const people = metadata.members
  const payerOptions = Array.from(
    new Map(
      [currentUser, ...people].map((person) => [person.id, person]),
    ).values(),
  )
  const paidBy = metadata.paidBy
  const payerIds = Object.keys(paidBy)
  const parsedTotalAmount = parseFloat(totalAmount) || 0
  const paidByTotal = Object.values(paidBy).reduce(
    (sum, amount) => sum + amount,
    0,
  )
  const paidByRemaining = parsedTotalAmount - paidByTotal
  const hasPaidByMismatch =
    payerIds.length > 1 &&
    parsedTotalAmount > 0 &&
    Math.abs(paidByRemaining) >= 0.005

  useEffect(() => {
    if (payerIds.length > 0) return

    updateMetadata({ paidBy: { [currentUser.id]: parsedTotalAmount } })
  }, [currentUser.id, parsedTotalAmount, payerIds.length, updateMetadata])

  useEffect(() => {
    if (payerIds.length !== 1) return

    const payerId = payerIds[0]
    if (paidBy[payerId] === parsedTotalAmount) return

    updateMetadata({ paidBy: { [payerId]: parsedTotalAmount } })
  }, [paidBy, parsedTotalAmount, payerIds, updateMetadata])

  const triggerLabel =
    payerIds.length === 0
      ? 'You'
      : getPaidByText(currentUser, paidBy, payerOptions)
  const togglePerson = (personId: string) => {
    const nextPaidBy = { ...paidBy }

    if (Object.hasOwn(nextPaidBy, personId)) {
      delete nextPaidBy[personId]
    } else {
      nextPaidBy[personId] =
        Object.keys(nextPaidBy).length === 0 ? parsedTotalAmount : 0
    }

    updateMetadata({ paidBy: nextPaidBy })
  }

  const updateAmount = (personId: string, value: string) => {
    updateMetadata({
      paidBy: {
        ...paidBy,
        [personId]: parseFloat(value) || 0,
      },
    })
  }

  return (
    <FieldRow label="Paid By">
      <PaidByEditorDialog
        people={payerOptions}
        currentUser={currentUser}
        paidBy={paidBy}
        totalAmount={totalAmount}
        currencySymbol={currencySymbol}
        togglePerson={togglePerson}
        updateAmount={updateAmount}
        triggerLabel={triggerLabel}
        hasMismatch={hasPaidByMismatch}
        mismatchAmount={paidByRemaining}
      />
    </FieldRow>
  )
}

function SplitTypeSelect({
  splitType,
  onSplitTypeChange,
  canImprove,
  onEqualEveryone,
  onEqualOthers,
  onRoundedEveryone,
}: {
  splitType: SplitType
  onSplitTypeChange: (value: SplitType) => void
  canImprove: boolean
  onEqualEveryone: () => void
  onEqualOthers: () => void
  onRoundedEveryone: () => void
}) {
  const [open, setOpen] = useState(false)

  const applyType = (value: SplitType) => {
    onSplitTypeChange(value)
    setOpen(false)
  }

  const applyPreset = (action: () => void) => {
    action()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="border-input data-[placeholder]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full items-center justify-between gap-1.5 rounded-md border bg-transparent py-2 pr-2 pl-2.5 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
        >
          <span className="truncate font-medium">
            {splitType === SplitType.EQUAL ? 'Equally' : 'Unequally'}
          </span>
          <ChevronDownIcon className="text-muted-foreground size-4 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <PopoverHeader className="p-4 pb-0">
          <PopoverTitle>How should this be split?</PopoverTitle>
          <PopoverDescription>
            Choose the split mode or use a quick preset to prefill shares.
          </PopoverDescription>
        </PopoverHeader>
        <div className="mt-4 grid gap-2 px-4 pb-4">
          <Button
            type="button"
            variant={splitType === SplitType.EQUAL ? 'default' : 'outline'}
            className="justify-start"
            onClick={() => applyType(SplitType.EQUAL)}
          >
            Equally
          </Button>
          <Button
            type="button"
            variant={splitType === SplitType.UNEQUAL ? 'default' : 'outline'}
            className="justify-start"
            onClick={() => applyType(SplitType.UNEQUAL)}
          >
            Unequally
          </Button>
          {canImprove && (
            <>
              <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs font-medium">
                <SparklesIcon className="size-3.5" />
                Quick unequal splits
              </div>
              <Button
                type="button"
                variant="outline"
                className="justify-start"
                onClick={() => applyPreset(onEqualEveryone)}
              >
                Split equally across everyone
              </Button>
              <Button
                type="button"
                variant="outline"
                className="justify-start"
                onClick={() => applyPreset(onEqualOthers)}
              >
                Split equally across everyone except you
              </Button>
              <Button
                type="button"
                variant="outline"
                className="justify-start"
                onClick={() => applyPreset(onRoundedEveryone)}
              >
                Split equally and round to whole numbers
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function PaidByEditorDialog({
  people,
  currentUser,
  paidBy,
  totalAmount,
  currencySymbol,
  togglePerson,
  updateAmount,
  triggerLabel,
  hasMismatch,
  mismatchAmount,
}: {
  people: Array<User>
  currentUser: User
  paidBy: AmountMap
  totalAmount: string
  currencySymbol: string
  togglePerson: (personId: string) => void
  updateAmount: (personId: string, value: string) => void
  triggerLabel: string
  hasMismatch: boolean
  mismatchAmount: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="border-input data-[placeholder]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full items-center justify-between gap-1.5 rounded-md border bg-transparent py-2 pr-2 pl-2.5 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
        >
          <span className="truncate font-medium">{triggerLabel}</span>
          <div className="flex items-center gap-2">
            {hasMismatch && (
              <TriangleAlertIcon className="size-4 shrink-0 text-amber-500" />
            )}
            <ChevronDownIcon className="text-muted-foreground size-4 shrink-0" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <PopoverHeader className="p-4 pb-0">
          <PopoverTitle>Who paid?</PopoverTitle>
          {hasMismatch && (
            <div className="flex items-center gap-2 text-amber-500">
              <TriangleAlertIcon className="size-4 shrink-0" />
              <span>
                {currencySymbol}
                {Math.abs(mismatchAmount).toFixed(2)}{' '}
                {mismatchAmount > 0 ? 'left to assign' : 'over total'}
              </span>
            </div>
          )}
        </PopoverHeader>
        <div className="mt-4 divide-y overflow-hidden rounded-b-md border-t">
          {people.map((person) => {
            const included = Object.hasOwn(paidBy, person.id)

            return (
              <div
                key={person.id}
                className={cn(
                  'flex items-center gap-3 px-4 py-3',
                  !included && 'bg-muted/20',
                )}
              >
                <Checkbox
                  id={`payer-dialog-${person.id}`}
                  checked={included}
                  onCheckedChange={() => togglePerson(person.id)}
                />
                <label
                  htmlFor={`payer-dialog-${person.id}`}
                  className={cn(
                    'flex-1 cursor-pointer truncate text-sm font-medium select-none',
                    !included && 'text-muted-foreground',
                  )}
                >
                  {person.id === currentUser.id
                    ? `${person.name} (You)`
                    : person.name}
                </label>
                <div
                  className={cn(
                    'w-[120px] shrink-0',
                    !included && 'pointer-events-none opacity-40',
                  )}
                >
                  <InputGroup>
                    <InputGroupAddon>{currencySymbol}</InputGroupAddon>
                    <InputGroupInput
                      type="number"
                      placeholder={totalAmount || '0.00'}
                      value={paidBy[person.id] ?? ''}
                      onChange={(e) => updateAmount(person.id, e.target.value)}
                      onFocus={(e) => e.target.select()}
                      disabled={!included}
                    />
                  </InputGroup>
                </div>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function GroupCategoryInput({
  categoryId,
  onChange,
}: {
  categoryId: string
  onChange: (value: string) => void
}) {
  const { data: categories = [], isLoading } = useCategories()
  const expenseCategories = categories.filter(
    (category) => category.type === CategoryType.EXPENSE,
  )

  return (
    <Select value={categoryId} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Choose a category" />
      </SelectTrigger>
      <SelectContent align="end" position="popper">
        {isLoading ? (
          <SelectItem value="loading">Loading...</SelectItem>
        ) : (
          expenseCategories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}

function UnequalSplitPanel({
  people,
  totalAmount,
  currencySymbol,
  splits,
  onSplitsChange,
}: {
  people: Array<User>
  totalAmount: string
  currencySymbol: string
  splits: Record<string, SplitEntry>
  onSplitsChange: React.Dispatch<
    React.SetStateAction<Record<string, SplitEntry>>
  >
}) {
  const total = parseFloat(totalAmount) || 0
  const assigned = people.reduce((sum, person) => {
    const entry = splits[person.id]
    if (!entry.included) return sum
    return sum + (parseFloat(entry.amount) || 0)
  }, 0)
  const remaining = total - assigned
  const isBalanced = total > 0 && Math.abs(remaining) < 0.005
  const isOver = remaining < -0.005
  const isUnder = remaining > 0.005

  const toggleIncluded = (personId: string) => {
    onSplitsChange((prev) => ({
        ...prev,
        [personId]: {
          ...prev[personId],
          included: !prev[personId].included,
        },
      }))
  }

  const updateAmount = (personId: string, value: string) => {
    onSplitsChange((prev) => ({
      ...prev,
      [personId]: {
        ...prev[personId],
        amount: value,
      },
    }))
  }

  const includedCount = people.filter((person) => splits[person.id].included).length

  return (
    <FieldRow label="Members">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col overflow-hidden rounded-lg border">
          <div className="bg-muted/30 border-b px-4 py-2.5">
            <p className="text-muted-foreground text-xs font-medium">
              Select members and enter their share.
            </p>
          </div>
          <div className="divide-y">
            {people.map((person) => {
              const entry = splits[person.id]
              const included = entry.included

              return (
                <div
                  key={person.id}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 transition-colors',
                    !included && 'bg-muted/20',
                  )}
                >
                  <Checkbox
                    id={`split-${person.id}`}
                    checked={included}
                    onCheckedChange={() => toggleIncluded(person.id)}
                  />
                  <label
                    htmlFor={`split-${person.id}`}
                    className={cn(
                      'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-xs font-bold select-none',
                      included
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {person.name.charAt(0).toUpperCase()}
                  </label>
                  <label
                    htmlFor={`split-${person.id}`}
                    className={cn(
                      'flex-1 cursor-pointer truncate text-sm font-medium select-none',
                      !included && 'text-muted-foreground line-through',
                    )}
                  >
                    {person.name}
                  </label>
                  <div
                    className={cn(
                      'w-[120px] shrink-0 transition-all duration-200',
                      !included && 'pointer-events-none opacity-40',
                    )}
                  >
                    <InputGroup>
                      <InputGroupAddon>{currencySymbol}</InputGroupAddon>
                      <InputGroupInput
                        type="number"
                        placeholder="0.00"
                        value={entry.amount}
                        onChange={(e) =>
                          updateAmount(person.id, e.target.value)
                        }
                        disabled={!included}
                      />
                    </InputGroup>
                  </div>
                </div>
              )
            })}
          </div>
          <div
            className={cn(
              'flex items-center justify-between gap-3 border-t px-4 py-3 text-xs font-medium transition-colors',
              isBalanced
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : isOver
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
            )}
          >
            <span>
              {includedCount} member{includedCount !== 1 ? 's' : ''} included
            </span>
            <div className="flex items-center gap-3">
              <span>
                Assigned:{' '}
                <span className="font-semibold tabular-nums">
                  {currencySymbol}
                  {assigned.toFixed(2)}
                </span>
              </span>
              {total > 0 && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-bold',
                    isBalanced
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : isOver
                        ? 'bg-destructive/20 text-destructive'
                        : 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
                  )}
                >
                  {isBalanced
                    ? 'Balanced'
                    : isOver
                      ? `${currencySymbol}${Math.abs(remaining).toFixed(2)} over`
                      : isUnder
                        ? `${currencySymbol}${remaining.toFixed(2)} left`
                        : `${currencySymbol}${remaining.toFixed(2)} left`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </FieldRow>
  )
}

function distributeAmounts(
  total: number,
  count: number,
  roundToWhole: boolean,
): Array<string> {
  if (count === 0) return []

  if (roundToWhole) {
    const base = Math.floor(total / count)
    const remainder = Math.round(total - base * count)
    return Array.from({ length: count }, (_, index) =>
      String(base + (index < remainder ? 1 : 0)),
    )
  }

  const totalCents = Math.round(total * 100)
  const baseCents = Math.floor(totalCents / count)
  const remainder = totalCents - baseCents * count

  return Array.from({ length: count }, (_, index) =>
    ((baseCents + (index < remainder ? 1 : 0)) / 100).toFixed(2),
  )
}
