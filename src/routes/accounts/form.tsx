import { createFileRoute, useNavigate } from '@tanstack/react-router'
import * as React from 'react'
import { z } from 'zod'

import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
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
import { cn } from '@/lib/utils'

// ─── Route ───────────────────────────────────────────────────────────────────

const searchSchema = z.object({
  id: z.string().optional(),
})

export const Route = createFileRoute('/accounts/form')({
  component: AccountFormPage,
  validateSearch: searchSchema,
})

// ─── Page ─────────────────────────────────────────────────────────────────────

function AccountFormPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const isEditing = !!search.id

  const [accountName, setAccountName] = React.useState('')
  const [accountType, setAccountType] = React.useState<AccountType>(
    AccountType.BANK,
  )
  const [currency, setCurrency] = React.useState<Currency>(Currency.INR)
  const [balance, setBalance] = React.useState('')

  const currencySymbol = CURRENCY_META[currency].symbol

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: implement save logic
    navigate({ to: '/accounts' })
  }

  return (
    <AppLayout
      routeTitle={isEditing ? 'Edit Account' : 'New Account'}
      routeSubtitle="Manage account details"
    >
      <div className="mx-auto w-full max-w-md pt-2 pb-20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* ── Account Details ─────────────────────────────────────── */}
          <Card className="flex flex-col gap-5 p-6">
            <SectionHeading>Account Details</SectionHeading>

            {/* Account Name */}
            <Field>
              <FieldLabel>Account Name</FieldLabel>
              <Input
                placeholder="e.g. HDFC Savings, Cash Wallet"
                autoFocus
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </Field>

            {/* Account Type */}
            <Field>
              <FieldLabel>Account Type</FieldLabel>
              <div className="grid grid-cols-4 gap-2">
                {ACCOUNT_TYPE_OPTIONS.map(({ type, label, icon: Icon }) => {
                  const isSelected = accountType === type
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAccountType(type)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-all duration-150',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary dark:bg-primary/15'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <Icon
                        className={cn(
                          'size-5 transition-colors',
                          isSelected ? 'text-primary' : '',
                        )}
                      />
                      {label}
                    </button>
                  )
                })}
              </div>
            </Field>
          </Card>

          {/* ── Balance ─────────────────────────────────────────────── */}
          <Card className="flex flex-col gap-5 p-6">
            <SectionHeading>Opening Balance</SectionHeading>

            {/* Currency + Initial Balance as an attached group */}
            <Field>
              <FieldLabel>Initial Balance</FieldLabel>
              <InputGroup>
                {/* Inline-start: currency symbol badge */}
                <InputGroupAddon align="inline-start">
                  <span className="text-muted-foreground min-w-5 text-center text-sm font-semibold">
                    {currencySymbol}
                  </span>
                </InputGroupAddon>

                {/* Amount input */}
                <InputGroupInput
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="text-base"
                  required
                />

                {/* Inline-end: currency selector */}
                <InputGroupAddon align="inline-end" className="pr-0">
                  <Select
                    value={currency}
                    onValueChange={(v) => setCurrency(v as Currency)}
                  >
                    <SelectTrigger
                      className="h-7 rounded-l-none border-0 border-l bg-transparent px-2 text-xs font-semibold shadow-none focus-visible:ring-0"
                      size="sm"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end" position="popper">
                      {Object.values(Currency).map((c) => (
                        <SelectItem key={c} value={c}>
                          <span className="font-mono font-semibold uppercase">
                            {c}
                          </span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            {CURRENCY_META[c].name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </InputGroupAddon>
              </InputGroup>
              <p className="text-muted-foreground text-xs">
                Set the current balance of this account. Leave as 0 to start
                fresh.
              </p>
            </Field>
          </Card>

          {/* ── Submit ──────────────────────────────────────────────── */}
          <Button type="submit" size="lg" className="w-full font-bold">
            {isEditing ? 'Save Changes' : 'Create Account'}
          </Button>
        </form>
      </div>
    </AppLayout>
  )
}

// ─── Helper Components ────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
        {children}
      </span>
      <div className="bg-border h-px flex-1" />
    </div>
  )
}
