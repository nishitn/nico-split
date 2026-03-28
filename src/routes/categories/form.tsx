import { createFileRoute, useNavigate } from '@tanstack/react-router'
import * as React from 'react'
import { z } from 'zod'

import { AppLayout } from '@/components/layout/app-layout'
import { FormSection } from '@/components/layout/form-section'
import { Button } from '@/components/ui/button'
import { FormNavButton } from '@/components/ui/form-nav-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CategoryType } from '@/features/categories/types'
import { cn } from '@/lib/utils'
import {
  Briefcase,
  Car,
  CheckIcon,
  ChevronDownIcon,
  CircleDollarSign,
  Coffee,
  Film,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  LucideIcon,
  PiggyBank,
  Plane,
  Receipt,
  SearchIcon,
  Shirt,
  ShoppingBag,
  TrendingDownIcon,
  TrendingUpIcon,
  Utensils,
  Wallet,
  Wrench,
} from 'lucide-react'

const searchSchema = z.object({
  id: z.string().optional(),
})

export const Route = createFileRoute('/categories/form')({
  component: CategoryFormPage,
  validateSearch: searchSchema,
})

interface CategoryIconOption {
  value: string
  label: string
  icon: LucideIcon
  keywords: string[]
}

const CATEGORY_ICON_OPTIONS: CategoryIconOption[] = [
  {
    value: 'utensils',
    label: 'Food',
    icon: Utensils,
    keywords: ['food', 'meal', 'meals', 'restaurant', 'dining', 'lunch', 'dinner', 'breakfast', 'snack', 'groceries'],
  },
  {
    value: 'coffee',
    label: 'Coffee',
    icon: Coffee,
    keywords: ['coffee', 'tea', 'cafe'],
  },
  {
    value: 'car',
    label: 'Travel',
    icon: Car,
    keywords: ['travel', 'transport', 'taxi', 'uber', 'cab', 'fuel', 'gas', 'petrol', 'commute', 'car', 'parking'],
  },
  {
    value: 'plane',
    label: 'Trips',
    icon: Plane,
    keywords: ['trip', 'trips', 'flight', 'vacation', 'holiday'],
  },
  {
    value: 'home',
    label: 'Home',
    icon: Home,
    keywords: ['home', 'house', 'rent', 'mortgage', 'apartment'],
  },
  {
    value: 'wrench',
    label: 'Bills',
    icon: Wrench,
    keywords: ['bill', 'bills', 'repair', 'maintenance', 'utility', 'utilities', 'electricity', 'water', 'internet'],
  },
  {
    value: 'film',
    label: 'Entertainment',
    icon: Film,
    keywords: ['movie', 'movies', 'film', 'cinema', 'entertainment', 'show', 'netflix'],
  },
  {
    value: 'gamepad-2',
    label: 'Gaming',
    icon: Gamepad2,
    keywords: ['game', 'gaming', 'playstation', 'xbox', 'steam'],
  },
  {
    value: 'wallet',
    label: 'Wallet',
    icon: Wallet,
    keywords: ['wallet', 'cash', 'money', 'balance'],
  },
  {
    value: 'landmark',
    label: 'Savings',
    icon: Landmark,
    keywords: ['saving', 'savings', 'bank', 'deposit', 'emergency'],
  },
  {
    value: 'piggy-bank',
    label: 'Investments',
    icon: PiggyBank,
    keywords: ['investment', 'investments', 'mutual', 'stocks', 'sip', 'portfolio'],
  },
  {
    value: 'circle-dollar-sign',
    label: 'Salary',
    icon: CircleDollarSign,
    keywords: ['salary', 'income', 'pay', 'paycheck', 'bonus', 'earning', 'earnings', 'revenue'],
  },
  {
    value: 'shopping-bag',
    label: 'Shopping',
    icon: ShoppingBag,
    keywords: ['shopping', 'shop', 'purchase', 'amazon', 'buy'],
  },
  {
    value: 'shirt',
    label: 'Clothing',
    icon: Shirt,
    keywords: ['clothing', 'clothes', 'fashion', 'shirt', 'dress', 'apparel'],
  },
  {
    value: 'gift',
    label: 'Gifts',
    icon: Gift,
    keywords: ['gift', 'gifts', 'present', 'donation', 'charity'],
  },
  {
    value: 'heart-pulse',
    label: 'Health',
    icon: HeartPulse,
    keywords: ['health', 'medical', 'medicine', 'doctor', 'hospital', 'fitness', 'gym', 'pharmacy'],
  },
  {
    value: 'graduation-cap',
    label: 'Education',
    icon: GraduationCap,
    keywords: ['education', 'school', 'college', 'course', 'tuition', 'study', 'books'],
  },
  {
    value: 'briefcase',
    label: 'Work',
    icon: Briefcase,
    keywords: ['work', 'office', 'business', 'client', 'freelance'],
  },
  {
    value: 'receipt',
    label: 'Taxes',
    icon: Receipt,
    keywords: ['tax', 'taxes', 'gst', 'invoice', 'receipt', 'accounting'],
  },
]

function getBestMatchingIcon(name: string) {
  const normalizedName = name.trim().toLowerCase()
  if (!normalizedName) return CATEGORY_ICON_OPTIONS[0].value

  const tokens = normalizedName.split(/[\s/-]+/).filter(Boolean)

  let bestOption = CATEGORY_ICON_OPTIONS[0]
  let bestScore = 0

  for (const option of CATEGORY_ICON_OPTIONS) {
    let score = 0

    if (normalizedName === option.label.toLowerCase()) score += 120
    if (normalizedName.includes(option.label.toLowerCase())) score += 60

    for (const keyword of option.keywords) {
      if (normalizedName === keyword) score += 120
      else if (normalizedName.includes(keyword)) score += 50
      if (tokens.includes(keyword)) score += 30
    }

    if (score > bestScore) {
      bestScore = score
      bestOption = option
    }
  }

  return bestOption.value
}

function CategoryFormPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const isEditing = !!search.id

  const [name, setName] = React.useState('')
  const [type, setType] = React.useState<CategoryType>(CategoryType.EXPENSE)
  const [iconName, setIconName] = React.useState('utensils')

  React.useEffect(() => {
    setIconName(getBestMatchingIcon(name))
  }, [name])

  const selectedIcon =
    CATEGORY_ICON_OPTIONS.find((option) => option.value === iconName) ??
    CATEGORY_ICON_OPTIONS[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ to: '/categories' })
  }

  return (
    <AppLayout
      routeTitle={isEditing ? 'Edit Category' : 'New Category'}
      routeSubtitle="Make every category feel easy to spot at a glance"
    >
      <div className="pb-20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 md:gap-10">
          <FormSection>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-[96px_minmax(0,1fr)] items-start gap-3 md:grid-cols-[104px_minmax(0,1fr)] md:gap-4">
                <CategoryIconPicker
                  selectedIcon={selectedIcon}
                  iconName={iconName}
                  setIconName={setIconName}
                />

                <div className="flex flex-col gap-3">
                  <Label htmlFor="category-name" className="text-base font-semibold">
                    Category Label
                  </Label>
                  <Input
                    id="category-name"
                    placeholder="e.g. Food, Rent, Salary"
                    autoFocus
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-base font-semibold">Type</p>
                <div className="flex gap-2">
                  <FormNavButton
                    onClick={() => setType(CategoryType.EXPENSE)}
                    isSelected={type === CategoryType.EXPENSE}
                    className="flex-row py-3"
                    color="expense"
                  >
                    <TrendingDownIcon className="size-5" />
                    Expense
                  </FormNavButton>
                  <FormNavButton
                    onClick={() => setType(CategoryType.INCOME)}
                    isSelected={type === CategoryType.INCOME}
                    className="flex-row py-3"
                    color="income"
                  >
                    <TrendingUpIcon className="size-5" />
                    Income
                  </FormNavButton>
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
                onClick={() => navigate({ to: '/categories' })}
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

function CategoryIconPicker({
  selectedIcon,
  iconName,
  setIconName,
}: {
  selectedIcon: CategoryIconOption
  iconName: string
  setIconName: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const filteredOptions = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return CATEGORY_ICON_OPTIONS

    return CATEGORY_ICON_OPTIONS.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    )
  }, [query])

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setQuery('')
        }
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
              <selectedIcon.icon className="size-7" />
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
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === iconName
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setIconName(option.value)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors',
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'hover:bg-muted/70 border-border bg-card text-foreground',
                    )}
                  >
                    <div
                      className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-xl border',
                        isSelected
                          ? 'border-primary/30 bg-primary/10'
                          : 'border-border bg-background',
                      )}
                    >
                      <option.icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{option.label}</p>
                    </div>
                    {isSelected ? (
                      <CheckIcon className="size-4 shrink-0" />
                    ) : null}
                  </button>
                )
              })
            ) : (
              <div className="text-muted-foreground col-span-full rounded-xl border border-dashed px-4 py-6 text-center text-sm">
                No icons match that search yet.
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
