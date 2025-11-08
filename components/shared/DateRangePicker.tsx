import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { Calendar as CalendarComponent } from '../ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';

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

  const handleDateChange = (range: DateRange | undefined) => {
    if (!isControlled) {
      setInternalDate(range);
    }
    onDateRangeChange(range);
    if (range?.from && range?.to) {
      setIsOpen(false);
    }
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
              !date && 'text-muted-foreground'
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
            // This prevents the backdrop from closing the filter panel
            const target = e.target as HTMLElement;
            // Don't close if clicking within the filter panel area
            if (target.closest('[data-filter-panel]')) {
              e.preventDefault();
            }
          }}
        >
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
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

