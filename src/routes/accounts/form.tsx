import { createFileRoute, useNavigate } from '@tanstack/react-router'
import * as React from 'react'
import { z } from 'zod'

import { AppLayout } from '@/components/layout/app-layout'
import { FormSection } from '@/components/layout/form-section'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ACCOUNT_TYPE_OPTIONS,
  AccountType,
  CURRENCY_META,
  Currency,
} from '@/features/accounts/types'
import type { LucideIcon } from 'lucide-react'
import {
  Banknote,
  Building2,
  CheckIcon,
  ChevronDownIcon,
  CreditCard,
  Landmark,
  LineChart,
  MoreHorizontal,
  PiggyBank,
  SearchIcon,
  ShieldCheck,
  Smartphone,
  TrendingDown,
  Wallet,
} from 'lucide-react'

const searchSchema = z.object({
  id: z.string().optional(),
})

export const Route = createFileRoute('/accounts/form')({
  component: AccountFormPage,
  validateSearch: searchSchema,
})

const ACCOUNT_TYPE_OPTIONS_ORDERED: {
  type: AccountType
  label: string
  icon: LucideIcon
}[] = ACCOUNT_TYPE_OPTIONS

interface AccountIconOption {
  value: string
  label: string
  icon: LucideIcon
}

const ACCOUNT_ICON_OPTIONS: AccountIconOption[] = [
  { value: 'building-2', label: 'Bank', icon: Building2 },
  { value: 'wallet', label: 'Wallet', icon: Wallet },
  { value: 'banknote', label: 'Cash', icon: Banknote },
  { value: 'credit-card', label: 'Card', icon: CreditCard },
  { value: 'landmark', label: 'Vault', icon: Landmark },
  { value: 'piggy-bank', label: 'Savings', icon: PiggyBank },
  { value: 'line-chart', label: 'Invest', icon: LineChart },
  { value: 'trending-down', label: 'Loan', icon: TrendingDown },
  { value: 'smartphone', label: 'Digital', icon: Smartphone },
  { value: 'shield-check', label: 'Secure', icon: ShieldCheck },
  { value: 'more-horizontal', label: 'Other', icon: MoreHorizontal },
]

function AccountFormPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const isEditing = !!search.id

  const [accountName, setAccountName] = React.useState('')
  const [accountType, setAccountType] = React.useState<AccountType>(
    AccountType.BANK,
  )
  const [iconName, setIconName] = React.useState('building-2')
  const [currency, setCurrency] = React.useState<Currency>(Currency.INR)
  const [balance, setBalance] = React.useState('')

  const currencySymbol = CURRENCY_META[currency].symbol
  const selectedAccountIcon =
    ACCOUNT_ICON_OPTIONS.find((option) => option.value === iconName) ??
    ACCOUNT_ICON_OPTIONS[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ to: '/accounts' })
  }

  return (
    <AppLayout
      routeTitle={isEditing ? 'Edit Account' : 'New Account'}
      routeSubtitle="Keep account setup quick and easy to scan"
    >
      <div className="pb-20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 md:gap-10">
          <FormSection>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-[104px_minmax(0,1fr)] items-stretch gap-3 md:grid-cols-[120px_minmax(0,1fr)] md:gap-4">
                <AccountIconPicker
                  selectedAccountIcon={selectedAccountIcon}
                  iconName={iconName}
                  setIconName={setIconName}
                />

                <div className="flex flex-col gap-3">
                  <Label htmlFor="account-name" className="text-base font-semibold">
                    Account Label
                  </Label>
                  <Input
                    id="account-name"
                    placeholder="e.g. HDFC Savings, Cash Wallet"
                    autoFocus
                    required
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-base font-semibold">Account Type</p>
                <AccountTypeSelect
                  accountType={accountType}
                  setAccountType={setAccountType}
                />
              </div>
            </div>
          </FormSection>

          <FormSection>
            <div className="flex flex-col gap-3">
              <Label htmlFor="opening-balance" className="text-base font-semibold">
                Opening Balance
              </Label>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <span className="text-muted-foreground min-w-5 text-center text-sm font-semibold">
                    {currencySymbol}
                  </span>
                </InputGroupAddon>
                <InputGroupInput
                  id="opening-balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="text-base"
                  required
                />
                <InputGroupAddon align="inline-end" className="pr-0">
                  <Select
                    value={currency}
                    onValueChange={(value) => setCurrency(value as Currency)}
                  >
                    <SelectTrigger
                      className="h-full rounded-l-none border-0 border-l bg-transparent px-3 text-sm font-semibold shadow-none focus-visible:ring-0"
                      size="sm"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end" position="popper">
                      {Object.values(Currency).map((value) => (
                        <SelectItem key={value} value={value}>
                          <span className="font-mono font-semibold uppercase">
                            {value}
                          </span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            {CURRENCY_META[value].name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                    </Select>
                  </InputGroupAddon>
                </InputGroup>
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
                onClick={() => navigate({ to: '/accounts' })}
              >
                Cancel
              </Button>
            </div>
          </FormSection>
        </form>
      </div>
    </AppLayout>
  )
}

function AccountTypePreview({
  selectedAccountType,
}: {
  selectedAccountType: {
    type: AccountType
    label: string
    icon: LucideIcon
  }
}) {
  const Icon = selectedAccountType.icon

  return (
    <div className="flex h-full min-h-[92px] w-full items-center justify-center rounded-xl p-1">
      <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-xl md:size-16">
        <Icon className="size-7 md:size-8" />
      </div>
    </div>
  )
}

function AccountIconPicker({
  selectedAccountIcon,
  iconName,
  setIconName,
}: {
  selectedAccountIcon: AccountIconOption
  iconName: string
  setIconName: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const filteredOptions = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return ACCOUNT_ICON_OPTIONS

    return ACCOUNT_ICON_OPTIONS.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    )
  }, [query])

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) setQuery('')
      }}
      modal={true}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="relative h-16 w-full rounded-xl border-transparent bg-transparent p-0 shadow-none hover:bg-transparent md:h-[72px]"
        >
          <div className="relative h-full w-full">
            <div className="bg-primary/10 text-primary absolute inset-y-0 left-0 z-10 flex w-16 items-center justify-center rounded-xl md:w-[72px]">
              <selectedAccountIcon.icon className="size-7" />
            </div>
            <div className="absolute top-1/2 right-0 flex h-16 w-7 -translate-y-1/2 items-center justify-center rounded-r-xl transition-colors duration-200 group-hover/button:bg-muted/50 group-focus-visible/button:bg-muted/50 group-data-[state=open]:bg-primary/10 md:h-[72px]">
              <ChevronDownIcon className="text-muted-foreground size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 max-w-[calc(100vw-2rem)] p-2"
        align="start"
        sideOffset={8}
      >
        <div className="flex flex-col gap-2">
          <div className="relative">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons"
              className="pl-9"
            />
          </div>

          <div className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1">
            {filteredOptions.map((option) => {
              const isSelected = option.value === iconName

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setIconName(option.value)
                    setOpen(false)
                  }}
                  className={
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors'
                      : 'hover:bg-muted/70 border-border bg-card text-foreground flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors'
                  }
                >
                  <div
                    className={
                      isSelected
                        ? 'border-primary/30 bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-xl border'
                        : 'border-border bg-background flex size-10 shrink-0 items-center justify-center rounded-xl border'
                    }
                  >
                    <option.icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{option.label}</p>
                  </div>
                  {isSelected ? <CheckIcon className="size-4 shrink-0" /> : null}
                </button>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function AccountTypeSelect({
  accountType,
  setAccountType,
}: {
  accountType: AccountType
  setAccountType: (value: AccountType) => void
}) {
  const selectedAccountType =
    ACCOUNT_TYPE_OPTIONS_ORDERED.find((option) => option.type === accountType) ??
    ACCOUNT_TYPE_OPTIONS_ORDERED[0]
  const SelectedIcon = selectedAccountType.icon

  return (
    <Select
      value={accountType}
      onValueChange={(value) => setAccountType(value as AccountType)}
    >
      <SelectTrigger className="h-12 w-full text-base">
        <div className="flex min-w-0 items-center gap-2">
          <SelectedIcon className="size-4 shrink-0" />
          <span className="truncate">{selectedAccountType.label}</span>
        </div>
      </SelectTrigger>
      <SelectContent align="end" position="popper">
        {ACCOUNT_TYPE_OPTIONS_ORDERED.map(({ type, label, icon: Icon }) => (
          <SelectItem key={type} value={type}>
            <div className="flex items-center gap-2">
              <Icon className="size-4" />
              <span>{label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
