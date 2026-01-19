import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface MonthYearPickerProps {
  month: number
  year: number
  onChange: (month: number, year: number) => void
}

export function MonthYearPicker({
  month,
  year,
  onChange,
}: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const currentDate = new Date(year, month)

  const handlePreviousMonth = () => {
    if (month === 0) {
      onChange(11, year - 1)
    } else {
      onChange(month - 1, year)
    }
  }

  const handleNextMonth = () => {
    if (month === 11) {
      onChange(0, year + 1)
    } else {
      onChange(month + 1, year)
    }
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePreviousMonth}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-[180px] justify-start text-left font-normal',
              !currentDate && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {monthNames[month]} {year}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="grid gap-4 p-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground text-xs font-semibold">
                  Year
                </span>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onChange(month, year - 1)}
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium">{year}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onChange(month, year + 1)}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground text-xs font-semibold">
                  Month
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {monthNames.map((m, i) => (
                    <Button
                      key={m}
                      variant={month === i ? 'default' : 'ghost'}
                      size="sm"
                      className="h-6 px-1 text-[10px]"
                      onClick={() => {
                        onChange(i, year)
                        setIsOpen(false)
                      }}
                    >
                      {m.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextMonth}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
