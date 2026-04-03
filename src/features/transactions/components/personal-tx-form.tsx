import { useNavigate } from '@tanstack/react-router'
import {
  ArrowRightLeft,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  AmountInput,
  DateInput,
  TimeInput,
} from './common-tx-input'
import type {
  LucideIcon} from 'lucide-react';
import type {
  RequiredFormData} from './common-tx-input';
import type { Category } from '@/features/categories/types'
import { FormSection } from '@/components/layout/form-section'
import { Button } from '@/components/ui/button'
import { FieldRow } from '@/components/ui/field-row'
import { FormNavButton } from '@/components/ui/form-nav-button'
import { InputGroup, InputGroupInput } from '@/components/ui/input-group'
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
import { useAccounts } from '@/features/accounts/api'
import { CURRENCY_META, Currency } from '@/features/accounts/types'
import { useCategories } from '@/features/categories/api'
import { useChapters } from '@/features/chapters/api'
import { PersonalTransactionType } from '@/features/transactions/types'
import { cn } from '@/lib/utils'

// #region Types

interface PersonalTxMetadata {
  accountId: string
  categoryId: string
  chapterId: string
  toAccountId?: string
}

const PTX_TYPE_OPTIONS: Array<{
  type: PersonalTransactionType
  label: string
  icon: LucideIcon
  selectedColor: string
}> = [
  {
    type: PersonalTransactionType.EXPENSE,
    label: 'Expense',
    icon: TrendingDownIcon,
    selectedColor: 'expense',
  },
  {
    type: PersonalTransactionType.INCOME,
    label: 'Income',
    icon: TrendingUpIcon,
    selectedColor: 'income',
  },
  {
    type: PersonalTransactionType.TRANSFER,
    label: 'Transfer',
    icon: ArrowRightLeft,
    selectedColor: 'blue-500',
  },
]

// #endregion

export function PersonTxFormSection() {
  const navigate = useNavigate()
  const [personalTxType, setPersonalTxType] = useState<PersonalTransactionType>(
    PersonalTransactionType.EXPENSE,
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

  const [metadata, setMetadata] = useState<PersonalTxMetadata>({
    accountId: '',
    categoryId: '',
    chapterId: '',
  })

  const updateMetadata = (updates: Partial<PersonalTxMetadata>) => {
    setMetadata((prev) => ({ ...prev, ...updates }))
  }

  const currencySymbol = CURRENCY_META[formData.currency].symbol
  const isTransfer = personalTxType === PersonalTransactionType.TRANSFER
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ to: '/transactions' })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 md:gap-10">
      <FormSection heading="Details">
        <div className="flex flex-col gap-4">
          <FieldRow label="Type">
            <PersonalTxTypeInput
              personalTxType={personalTxType}
              setPersonalTxType={setPersonalTxType}
            />
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
      {isTransfer ? (
        <PersonalTransferMetadataSection
          metadata={metadata}
          updateMetadata={updateMetadata}
        />
      ) : (
        <PersonalTxMetadataSection
          metadata={metadata}
          updateMetadata={updateMetadata}
        />
      )}

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

function PersonalTxTypeInput({
  personalTxType,
  setPersonalTxType,
}: {
  personalTxType: PersonalTransactionType
  setPersonalTxType: (personalTxType: PersonalTransactionType) => void
}) {
  return (
    <div className="flex flex-row gap-2 md:gap-4">
      {PTX_TYPE_OPTIONS.map(({ type, label, icon: Icon, selectedColor }) => {
        const isSelected = personalTxType === type
        return (
          <FormNavButton
            key={type}
            onClick={() => setPersonalTxType(type)}
            isSelected={isSelected}
            className={cn('flex-row')}
            color={selectedColor}
          >
            <Icon className="size-5" />
            {label}
          </FormNavButton>
        )
      })}
    </div>
  )
}

function PersonalTxMetadataSection({
  metadata,
  updateMetadata,
}: {
  metadata: PersonalTxMetadata
  updateMetadata: (updates: Partial<PersonalTxMetadata>) => void
}) {
  return (
    <FormSection heading="Metadata">
      <FieldRow label="Account">
        <AccountInput metadata={metadata} updateMetadata={updateMetadata} />
      </FieldRow>
      <FieldRow label="Chapter">
        <ChapterInput metadata={metadata} updateMetadata={updateMetadata} />
      </FieldRow>
      <FieldRow label="Category">
        <CategoryInput metadata={metadata} updateMetadata={updateMetadata} />
      </FieldRow>
    </FormSection>
  )
}

function PersonalTransferMetadataSection({
  metadata,
  updateMetadata,
}: {
  metadata: PersonalTxMetadata
  updateMetadata: (updates: Partial<PersonalTxMetadata>) => void
}) {
  return (
    <FormSection heading="Metadata">
      <FieldRow label="From Account">
        <AccountInput metadata={metadata} updateMetadata={updateMetadata} />
      </FieldRow>
      <FieldRow label="To Account">
        <ToAccountInput metadata={metadata} updateMetadata={updateMetadata} />
      </FieldRow>
    </FormSection>
  )
}

function AccountInput({
  metadata,
  updateMetadata,
}: {
  metadata: PersonalTxMetadata
  updateMetadata: (updates: Partial<PersonalTxMetadata>) => void
}) {
  const { data: accounts = [], isLoading: isLoadingAccounts } = useAccounts()

  useEffect(() => {
    if (!metadata.accountId && accounts.length > 0) {
      updateMetadata({ accountId: accounts[0].id })
    }
  }, [accounts, metadata.accountId, updateMetadata])

  let accountsItems
  if (isLoadingAccounts) {
    accountsItems = [<SelectItem value="loading">Loading...</SelectItem>]
  } else {
    accountsItems = accounts.map((account) => (
      <SelectItem key={account.id} value={account.id}>
        {account.label}
      </SelectItem>
    ))
  }

  return (
    <Select
      value={metadata.accountId}
      onValueChange={(v) => updateMetadata({ accountId: v })}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select account" />
      </SelectTrigger>
      <SelectContent align="end" position="popper">
        {accountsItems}
      </SelectContent>
    </Select>
  )
}

function ToAccountInput({
  metadata,
  updateMetadata,
}: {
  metadata: PersonalTxMetadata
  updateMetadata: (updates: Partial<PersonalTxMetadata>) => void
}) {
  const { data: accounts = [], isLoading: isLoadingAccounts } = useAccounts()

  useEffect(() => {
    if (!metadata.toAccountId && accounts.length > 0) {
      updateMetadata({ toAccountId: accounts[0].id })
    }
  }, [accounts, metadata.toAccountId, updateMetadata])

  let accountsItems
  if (isLoadingAccounts) {
    accountsItems = [<SelectItem value="loading">Loading...</SelectItem>]
  } else {
    accountsItems = accounts.map((account) => (
      <SelectItem key={account.id} value={account.id}>
        {account.label}
      </SelectItem>
    ))
  }

  return (
    <Select
      value={metadata.toAccountId}
      onValueChange={(v) => updateMetadata({ toAccountId: v })}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select account" />
      </SelectTrigger>
      <SelectContent align="end" position="popper">
        {accountsItems}
      </SelectContent>
    </Select>
  )
}

function ChapterInput({
  metadata,
  updateMetadata,
}: {
  metadata: PersonalTxMetadata
  updateMetadata: (updates: Partial<PersonalTxMetadata>) => void
}) {
  const { data: chapters = [], isLoading: isLoadingChapters } = useChapters()

  useEffect(() => {
    if (!metadata.chapterId && chapters.length > 0) {
      updateMetadata({ chapterId: chapters[0].id })
    }
  }, [chapters, metadata.chapterId, updateMetadata])

  let chaptersItems
  if (isLoadingChapters) {
    chaptersItems = [<SelectItem value="loading">Loading...</SelectItem>]
  } else {
    chaptersItems = chapters.map((chapter) => (
      <SelectItem key={chapter.id} value={chapter.id}>
        {chapter.label}
      </SelectItem>
    ))
  }

  return (
    <Select
      value={metadata.chapterId}
      onValueChange={(v) => updateMetadata({ chapterId: v })}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select chapter" />
      </SelectTrigger>
      <SelectContent align="end" position="popper">
        {chaptersItems}
      </SelectContent>
    </Select>
  )
}

interface CategoryNode extends Category {
  children: Array<CategoryNode>
}

function buildCategoryTree(categories: Array<Category>): Array<CategoryNode> {
  const categoryMap = new Map<string, CategoryNode>()
  categories.forEach((cat) => categoryMap.set(cat.id, { ...cat, children: [] }))

  const tree: Array<CategoryNode> = []
  const subCategoryIds = new Set(categories.flatMap((cat) => cat.subCategories))

  categories.forEach((cat) => {
    const node = categoryMap.get(cat.id)!
    cat.subCategories.forEach((subId) => {
      const child = categoryMap.get(subId)
      if (child) node.children.push(child)
    })
    if (!subCategoryIds.has(cat.id)) {
      tree.push(node)
    }
  })
  return tree
}

function isAncestorOf(category: CategoryNode, targetId: string): boolean {
  if (category.children.some((child) => child.id === targetId)) return true
  return category.children.some((child) => isAncestorOf(child, targetId))
}

function RecursiveCategoryItem({
  category,
  onSelect,
  selectedId,
  level = 0,
}: {
  category: CategoryNode
  onSelect: (id: string) => void
  selectedId: string
  level?: number
}) {
  const isSelected = category.id === selectedId
  const isAncestor = isAncestorOf(category, selectedId)
  const [isExpanded, setIsExpanded] = useState(isAncestor)

  useEffect(() => {
    if (isAncestor) setIsExpanded(true)
  }, [isAncestor])

  const hasSubcategories = category.children.length > 0

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          'group relative flex items-stretch overflow-hidden rounded-md transition-all duration-200',
          isSelected
            ? 'bg-primary/10 text-primary ring-primary/20 ring-1 ring-inset'
            : 'hover:bg-accent/60 text-foreground/80 hover:text-foreground',
          level > 0 && 'mt-0.5',
        )}
        style={{ marginLeft: `${level * 0.75}rem` }}
      >
        <button
          type="button"
          className="flex flex-1 items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-all outline-none active:scale-[0.99]"
          onClick={() => onSelect(category.id)}
        >
          <category.icon
            className={cn(
              'size-4 shrink-0 transition-colors',
              isSelected ? 'text-foreground' : 'text-muted-foreground',
            )}
          />
          <span
            className={cn('flex-1 truncate', isSelected && 'font-semibold')}
          >
            {category.label}
          </span>
          {isSelected && (
            <CheckIcon className="text-foreground animate-in fade-in zoom-in size-4 shrink-0 duration-300" />
          )}
        </button>

        {hasSubcategories && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className={cn(
              'border-border/40 flex w-12 shrink-0 items-center justify-center border-l transition-all outline-none',
              'hover:bg-primary/5 active:bg-primary/10',
              isExpanded ? 'text-primary' : 'text-muted-foreground',
            )}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            aria-expanded={isExpanded}
          >
            <ChevronRightIcon
              className={cn(
                'size-4.5 transition-transform duration-300 ease-in-out',
                isExpanded && 'rotate-90',
              )}
            />
          </button>
        )}
      </div>

      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          isExpanded
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col py-0.5">
            {category.children.map((child) => (
              <RecursiveCategoryItem
                key={child.id}
                category={child}
                onSelect={onSelect}
                selectedId={selectedId}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function findCategoryPath(
  nodes: Array<CategoryNode>,
  targetId: string,
  path: Array<Category> = [],
): Array<Category> | null {
  for (const node of nodes) {
    if (node.id === targetId) return [...path, node]
    if (node.children.length > 0) {
      const result = findCategoryPath(node.children, targetId, [...path, node])
      if (result) return result
    }
  }
  return null
}

function CategoryInput({
  metadata,
  updateMetadata,
}: {
  metadata: PersonalTxMetadata
  updateMetadata: (updates: Partial<PersonalTxMetadata>) => void
}) {
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories()
  const [open, setOpen] = useState(false)

  const categoryTree = useMemo(
    () => buildCategoryTree(categories),
    [categories],
  )

  const selectedPath = useMemo(
    () =>
      metadata.categoryId
        ? findCategoryPath(categoryTree, metadata.categoryId)
        : null,
    [categoryTree, metadata.categoryId],
  )

  const selectedCategory = selectedPath?.[selectedPath.length - 1]

  useEffect(() => {
    if (!metadata.categoryId && categories.length > 0) {
      updateMetadata({ categoryId: categories[0].id })
    }
  }, [categories, metadata.categoryId, updateMetadata])

  if (isLoadingCategories) {
    return (
      <Button variant="outline" className="w-full justify-start" disabled>
        Loading...
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'group hover:bg-accent/50 h-11 w-full justify-between px-3 py-2 font-normal transition-all',
            selectedCategory && 'bg-accent/20 border-primary/20 shadow-sm',
          )}
        >
          {selectedCategory ? (
            <div className="flex items-center gap-3 overflow-hidden text-sm">
              <selectedCategory.icon className="text-foreground size-4 shrink-0" />
              <div className="flex flex-1 items-center gap-1.5 overflow-hidden">
                {selectedPath.map((c, i) => (
                  <span
                    key={c.id}
                    className="flex items-center gap-1.5 overflow-hidden"
                  >
                    <span
                      className={cn(
                        'truncate',
                        i === selectedPath.length - 1
                          ? 'text-foreground font-semibold'
                          : 'text-muted-foreground/80',
                      )}
                    >
                      {c.label}
                    </span>
                    {i < selectedPath.length - 1 && (
                      <ChevronRightIcon className="text-muted-foreground/40 size-3 shrink-0" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">Select category</span>
          )}
          <ChevronDownIcon className="text-muted-foreground size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="max-h-[350px] w-(--radix-popover-trigger-width) overflow-y-auto p-1.5"
        align="end"
        sideOffset={5}
      >
        <div className="flex flex-col gap-1">
          {categoryTree.map((cat) => (
            <RecursiveCategoryItem
              key={cat.id}
              category={cat}
              onSelect={(id) => {
                updateMetadata({ categoryId: id })
                setOpen(false)
              }}
              selectedId={metadata.categoryId}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
