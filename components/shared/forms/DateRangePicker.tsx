import { useState, useMemo } from 'react';
import { Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../ui/utils';
import {
  Button,
  Calendar as CalendarComponent,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui';
import { RangeKeyDict } from 'react-date-range';

export interface DateRange {
  from?: Date | null | undefined;
  to?: Date | null | undefined;
}

interface DateRangePickerProps {
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: DateRange | undefined;
}

export function DateRangePicker({
  onDateRangeChange,
  className,
  placeholder = 'Pick a date range',
  disabled = false,
  value: controlledValue,
}: DateRangePickerProps) {
  const [internalDate, setInternalDate] = useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  
  // Use controlled value if provided, otherwise use internal state
  const date = controlledValue !== undefined ? controlledValue : internalDate;
  const isControlled = controlledValue !== undefined;

  // Convert DateRange to react-date-range format
  const ranges = useMemo(() => {
    if (!date?.from && !date?.to) {
      return [{ startDate: undefined, endDate: undefined, key: 'selection' }];
    }
    
    return [{
      startDate: date.from || undefined,
      endDate: date.to || undefined,
      key: 'selection' as const
    }];
  }, [date]);

  const handleDateChange = (ranges: RangeKeyDict) => {
    const selection = ranges.selection;
    let newRange: DateRange;

    // If both startDate and endDate are provided and they're the same,
    // react-date-range is indicating a single date selection (start of range)
    // Only set the start date in this case
    if (selection.startDate && selection.endDate) {
      const startTime = selection.startDate.getTime();
      const endTime = selection.endDate.getTime();
      
      if (startTime === endTime) {
        // Both dates are the same - this is a start date selection only
        newRange = {
          from: selection.startDate,
          to: undefined,
        };
      } else {
        // Different dates - both are set, range is complete
        newRange = {
          from: selection.startDate,
          to: selection.endDate,
        };
      }
    } else if (selection.startDate) {
      // Only startDate is set
      newRange = {
        from: selection.startDate,
        to: undefined,
      };
    } else {
      // No date selected (shouldn't happen, but handle it)
      newRange = {
        from: undefined,
        to: undefined,
      };
    }

    // If both dates are selected and different, close the picker
    if (newRange.from && newRange.to) {
      setIsOpen(false);
    }

    if (!isControlled) {
      setInternalDate(newRange);
    }
    onDateRangeChange(newRange);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalDate(undefined);
    }
    onDateRangeChange(undefined);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date?.from && 'text-muted-foreground'
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 !z-[10000]" 
          align="start"
          style={{ zIndex: 10000 }}
          onPointerDownOutside={(e) => {
            // Prevent closing when clicking outside if we're inside a modal/overlay
            const target = e.target as HTMLElement;
            if (target.closest('[data-filter-panel]')) {
              e.preventDefault();
            }
          }}
        >
          <div className="rdr-date-range-picker-wrapper">
            <CalendarComponent
              ranges={ranges}
              onChange={handleDateChange}
              months={2}
              direction="horizontal"
              weekStartsOn={1}
              showMonthAndYearPickers={true}
              showDateDisplay={false}
              mode="range"
            />
          </div>
        </PopoverContent>
      </Popover>
      {date && (date.from || date.to) && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="h-9 w-9"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
