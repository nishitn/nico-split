import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
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
import { CURRENCY_META, Currency } from '@/features/accounts/types'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

export interface RequiredFormData {
  amount: string
  currency: Currency
  date: Date
  note: string
}

export function AmountInput({
  formData,
  updateForm,
  currencySymbol,
}: {
  formData: RequiredFormData
  updateForm: (updates: Partial<RequiredFormData>) => void
  currencySymbol: string
}) {
  return (
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <span className="text-muted-foreground min-w-5 text-center text-sm font-semibold">
          {currencySymbol}
        </span>
      </InputGroupAddon>
      <InputGroupInput
        id="amount"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        autoFocus
        required
        value={formData.amount}
        onChange={(e) => updateForm({ amount: e.target.value })}
        className="text-base font-semibold"
      />
      <InputGroupAddon align="inline-end" className="pr-0">
        <Select
          value={formData.currency}
          onValueChange={(v) => updateForm({ currency: v as Currency })}
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
                <span className="font-mono font-semibold uppercase">{c}</span>
                <span className="text-muted-foreground ml-2 text-xs">
                  {CURRENCY_META[c].name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </InputGroupAddon>
    </InputGroup>
  )
}

export function DateInput({
  formData,
  updateForm,
}: {
  formData: RequiredFormData
  updateForm: (updates: Partial<RequiredFormData>) => void
}) {
  const handleDateSelect = (selectedDate: Date) => {
    // Preserve time when selecting a new date
    const [hours, minutes] = format(formData.date, 'HH:mm')
      .split(':')
      .map(Number)
    const newDate = new Date(selectedDate)
    if (!isNaN(hours) && !isNaN(minutes)) {
      newDate.setHours(hours, minutes, 0, 0)
    }
    updateForm({ date: newDate })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start bg-transparent text-left font-normal',
            !formData.date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formData.date ? (
            format(formData.date, 'PPP')
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          required
          selected={formData.date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export function TimeInput({
  formData,
  updateForm,
}: {
  formData: RequiredFormData
  updateForm: (updates: Partial<RequiredFormData>) => void
}) {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    const [hours, minutes] = newTime.split(':').map(Number)
    const newDate = new Date(formData.date)
    if (!isNaN(hours) && !isNaN(minutes)) {
      newDate.setHours(hours, minutes, 0, 0)
      updateForm({ date: newDate })
    }
  }

  return (
    <InputGroup>
      <Input
        id="time"
        type="time"
        value={format(formData.date, 'HH:mm')}
        onChange={handleTimeChange}
        className="h-full w-full bg-transparent px-2 font-semibold focus:outline-none"
      />
    </InputGroup>
  )
}
