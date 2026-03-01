import { Button } from '@/components/ui/button'
import { CurrencySpan } from '@/components/ui/currency-span'
import {
  NsAmount,
  NsCard,
  NsContent,
  NsIcon,
  NsMainRow,
  NsSubRow,
} from '@/components/ui/ns-card'
import { Separator } from '@/components/ui/separator'
import type { CategoryStat } from '@/features/categories/types'
import { CategoryType } from '@/features/categories/types'
import type { UUID } from 'crypto'
import { ChevronDown, ChevronUp } from 'lucide-react'

export interface CategoryRowProps {
  categoryStat: CategoryStat
  isExpanded: boolean
  onToggle: (id: UUID) => void
}

export function CategoryRow({
  categoryStat,
  isExpanded,
  onToggle,
}: CategoryRowProps) {
  const amountColor =
    categoryStat.category.type === CategoryType.EXPENSE
      ? 'text-expense'
      : 'text-income'

  const subCategories = categoryStat.subcategories || []
  const hasSubCategories = subCategories.length > 0

  const reducePadding = hasSubCategories ? 'flex-col' : ''

  return (
    <NsCard className={reducePadding}>
      <div className="flex w-full flex-row items-center gap-2">
        <NsIcon icon={categoryStat.category.icon} />
        <NsContent>
          <NsMainRow className="flex-1">
            <span className="text-card-foreground flex-1 truncate font-medium">
              {categoryStat.category.label}
            </span>
            <NsAmount amount={categoryStat.amount} className={amountColor} />
          </NsMainRow>
        </NsContent>
      </div>
      {hasSubCategories && (
        <div className="w-full">
          <Separator />
          <SubCategorySection
            categoryStat={categoryStat}
            isExpanded={isExpanded}
            onToggle={onToggle}
          />
        </div>
      )}
    </NsCard>
  )
}

export function SubCategorySection({
  categoryStat,
  isExpanded,
  onToggle,
}: CategoryRowProps) {
  const subCategories = categoryStat.subcategories || []

  return (
    <div>
      <ExpandButton
        categoryStat={categoryStat}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />
      {isExpanded && (
        <div>
          {subCategories.map((subCategoryStat) => (
            <SubCategoryRow
              key={subCategoryStat.category.id}
              subCategoryStat={subCategoryStat}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ExpandButton({
  categoryStat,
  isExpanded,
  onToggle,
}: CategoryRowProps) {
  return (
    <Button
      variant="ghost"
      onClick={() => onToggle(categoryStat.category.id)}
      className="text-muted-foreground hover:text-muted-foreground h-auto w-full cursor-pointer justify-between py-2 text-xs"
    >
      <span>{isExpanded ? 'Hide' : 'Show'} Breakdown</span>
      {isExpanded ? (
        <ChevronUp className="size-4" />
      ) : (
        <ChevronDown className="size-4" />
      )}
    </Button>
  )
}

export function SubCategoryRow({
  subCategoryStat,
}: {
  subCategoryStat: CategoryStat
}) {
  const Icon = subCategoryStat.category.icon
  const amountColor =
    subCategoryStat.category.type === CategoryType.EXPENSE
      ? 'text-expense'
      : 'text-income'

  return (
    <NsSubRow>
      <div className="flex flex-1 flex-row items-center gap-2 px-1">
        <Icon className="size-4" />
        <span className="text-muted-foreground">
          {subCategoryStat.category.label}
        </span>
      </div>
      <span className={amountColor}>
        <CurrencySpan amount={subCategoryStat.amount} />
      </span>
    </NsSubRow>
  )
}
