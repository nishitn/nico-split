import { cn } from '@/lib/utils'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Separator } from './separator'

export interface MonthNavigatorProps {
  currentMonth: number
  currentYear: number
  setMonthYear: (month: number, year: number) => void
}

export function MonthNavigator({
  currentMonth,
  currentYear,
  setMonthYear,
}: MonthNavigatorProps) {
  const [open, setOpen] = useState(false)
  const [year, setYear] = useState(currentYear)

  const today = new Date()
  const actualMonth = today.getMonth()
  const actualYear = today.getFullYear()

  useEffect(() => {
    if (open) {
      setYear(currentYear)
    }
  }, [open, currentYear])

  const months = [
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
    <div className="bg-muted flex w-full items-center justify-between gap-4 rounded-full p-2 xl:w-auto xl:justify-start">
      <button
        onClick={() => {
          const d = new Date(currentYear, currentMonth - 1)
          setMonthYear(d.getMonth(), d.getFullYear())
        }}
        className="bg-card hover:bg-card/50 text-card-foreground flex size-8 cursor-pointer items-center justify-center rounded-full shadow-sm xl:size-10"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="hover:bg-muted/50 group relative flex cursor-pointer items-center gap-2 px-4 py-2">
            <Calendar className="text-primary h-5 w-5" />
            <span className="text-foreground min-w-35 text-center text-lg font-bold">
              {months[currentMonth]} {currentYear}
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2" align="center">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setYear((y) => y - 1)}
                className="hover:bg-muted rounded-full p-2 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-lg font-bold">{year}</span>
              <button
                onClick={() => setYear((y) => y + 1)}
                className="hover:bg-muted rounded-full p-2 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-2">
              {months.map((m, i) => {
                const isSelected = currentMonth === i && currentYear === year
                const isActual = actualMonth === i && actualYear === year

                return (
                  <button
                    key={m}
                    onClick={() => {
                      setMonthYear(i, year)
                      setOpen(false)
                    }}
                    className={cn(
                      'relative rounded-xl py-3 text-sm font-semibold transition-all cursor-pointer active:scale-95',
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                        : isActual
                          ? 'bg-muted text-muted-foreground border-border border hover:text-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    {m.slice(0, 3)}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => {
                setMonthYear(actualMonth, actualYear)
                setOpen(false)
              }}
              className="bg-secondary hover:bg-secondary/80 cursor-pointer text-secondary-foreground rounded-lg py-2 text-xs font-bold transition-colors"
            >
              Go to Today
            </button>
          </div>
        </PopoverContent>
      </Popover>
      <button
        onClick={() => {
          const d = new Date(currentYear, currentMonth + 1)
          setMonthYear(d.getMonth(), d.getFullYear())
        }}
        className="bg-card hover:bg-card/50 text-card-foreground flex size-8 cursor-pointer items-center justify-center rounded-full shadow-sm xl:size-10"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
