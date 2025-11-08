import { DateRange, RangeKeyDict } from "react-date-range"
import { enGB, enUS } from "date-fns/locale"
import { cn } from "../utils"

// Import react-date-range styles
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

export interface CalendarProps {
  ranges?: Array<{
    startDate?: Date
    endDate?: Date
    key?: string
  }>
  onChange?: (ranges: RangeKeyDict) => void
  onRangeChange?: (ranges: RangeKeyDict) => void
  months?: number
  direction?: "horizontal" | "vertical"
  weekStartsOn?: 0 | 1 // 0 = Sunday, 1 = Monday
  showMonthAndYearPickers?: boolean
  showDateDisplay?: boolean
  className?: string
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  date?: Date
  onDateChange?: (date: Date) => void
  mode?: "single" | "range"
}

function Calendar({
  ranges = [],
  onChange,
  onRangeChange,
  months = 2,
  direction = "horizontal",
  weekStartsOn = 1, // Default to Monday
  showMonthAndYearPickers = true,
  showDateDisplay = false,
  className,
  minDate,
  maxDate,
  disabledDates,
  date,
  onDateChange,
  mode = "range",
  ...props
}: CalendarProps) {
  // Determine locale based on weekStartsOn
  // enGB starts on Monday (1), enUS starts on Sunday (0)
  const locale = weekStartsOn === 0 ? enUS : enGB

  // Handle single date mode
  if (mode === "single" && date && onDateChange) {
    const singleRange = [{
      startDate: date,
      endDate: date,
      key: "selection"
    }]

    return (
      <div className={cn("rdr-calendar-wrapper", className)}>
        <DateRange
          ranges={singleRange}
          onChange={(item: RangeKeyDict) => {
            if (item.selection.startDate) {
              onDateChange(item.selection.startDate)
            }
          }}
          months={1}
          direction={direction}
          locale={locale}
          showMonthAndYearPickers={showMonthAndYearPickers}
          showDateDisplay={showDateDisplay}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={disabledDates}
          {...props}
        />
      </div>
    )
  }

  // Handle range mode
  const handleChange = (item: RangeKeyDict) => {
    if (onRangeChange) {
      onRangeChange(item)
    }
    if (onChange) {
      onChange(item)
    }
  }

  return (
    <div className={cn("rdr-calendar-wrapper", className)}>
      <DateRange
        ranges={ranges}
        onChange={handleChange}
        months={months}
        direction={direction}
        locale={locale}
        showMonthAndYearPickers={showMonthAndYearPickers}
        showDateDisplay={showDateDisplay}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        retainEndDateOnFirstSelection={true}
        editableDateInputs={false}
        dragSelectionEnabled={true}
        rangeColors={['var(--primary)']}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
        {...props}
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
