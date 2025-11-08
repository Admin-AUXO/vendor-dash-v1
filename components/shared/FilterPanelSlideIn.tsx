import { useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { AdvancedFilterPanel, type FilterGroup } from './AdvancedFilterPanel';
import { DateRangePicker } from './DateRangePicker';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DateRange } from 'react-day-picker';
import currency from 'currency.js';
import { cn } from '../ui/utils';

export interface FilterPanelSlideInProps {
  filters: FilterGroup[];
  filterValues: Record<string, string | string[]>;
  onFilterChange: (filters: Record<string, string | string[]>) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount?: number;
  totalCount?: number;
  searchPlaceholder?: string;
  isOpen: boolean;
  onClose: () => void;
  // Date range filters
  issueDateRange?: DateRange | undefined;
  onIssueDateRangeChange?: (range: DateRange | undefined) => void;
  dueDateRange?: DateRange | undefined;
  onDueDateRangeChange?: (range: DateRange | undefined) => void;
  paymentDateRange?: DateRange | undefined;
  onPaymentDateRangeChange?: (range: DateRange | undefined) => void;
  // Amount range filter
  amountRange?: { min: number | null; max: number | null } | undefined;
  onAmountRangeChange?: (range: { min: number | null; max: number | null }) => void;
  amountStats?: { min: number; max: number };
  // Budget range filter (for Marketplace)
  budgetRange?: { min: number | null; max: number | null } | undefined;
  onBudgetRangeChange?: (range: { min: number | null; max: number | null }) => void;
  budgetStats?: { min: number; max: number };
}

export function FilterPanelSlideIn({
  filters,
  filterValues,
  onFilterChange,
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
  searchPlaceholder,
  isOpen,
  onClose,
  issueDateRange,
  onIssueDateRangeChange,
  dueDateRange,
  onDueDateRangeChange,
  paymentDateRange,
  onPaymentDateRangeChange,
  amountRange,
  onAmountRangeChange,
  amountStats,
  budgetRange,
  onBudgetRangeChange,
  budgetStats,
}: FilterPanelSlideInProps) {
  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = Object.values(filterValues).reduce((acc, value) => {
      if (Array.isArray(value)) {
        return acc + value.length;
      }
      return acc + (value ? 1 : 0);
    }, 0);
    
    // Count date range filters
    if (issueDateRange?.from) count += 1;
    if (dueDateRange?.from) count += 1;
    if (paymentDateRange?.from) count += 1;
    
    // Count amount range filter
    if (amountRange?.min !== null || amountRange?.max !== null) count += 1;
    
    // Count budget range filter
    if (budgetRange?.min !== null || budgetRange?.max !== null) count += 1;
    
    return count;
  }, [filterValues, issueDateRange, dueDateRange, paymentDateRange, amountRange, budgetRange]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const filterPanelContent = (
    <>
      {/* Backdrop - covers entire viewport including header */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      {/* Slide-in Panel - full viewport height, starts at very left of screen */}
      <div
        className={cn(
          'fixed w-[380px] bg-white shadow-2xl z-[9999] transition-transform duration-300 ease-in-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ 
          height: '100vh',
          top: 0,
          left: 0, // Start at very left of screen
          maxHeight: '100vh',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gray-50">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            aria-label="Close filters panel"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Search Bar */}
            {onSearchChange && (
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder || "Search..."}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary pl-10"
                />
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Result Count */}
            {resultCount !== undefined && totalCount !== undefined && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{resultCount}</span>
                {' '}of{' '}
                <span className="font-medium">{totalCount}</span>
                {' '}results
              </div>
            )}

            {/* Filter Groups without header */}
            <AdvancedFilterPanel
              filters={filters}
              filterValues={filterValues}
              onFilterChange={onFilterChange}
              searchQuery={searchQuery}
              onSearchChange={undefined}
              resultCount={undefined}
              totalCount={undefined}
              variant="sidebar"
              className="border-0 shadow-none bg-transparent"
              hideHeader={true}
            />

            {/* Date Range Filters */}
            {(onIssueDateRangeChange || onDueDateRangeChange || onPaymentDateRangeChange) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Date Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {onIssueDateRangeChange && (
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">
                        Issue Date
                      </label>
                      <DateRangePicker
                        onDateRangeChange={onIssueDateRangeChange}
                        placeholder="Select issue date range"
                        value={issueDateRange}
                      />
                    </div>
                  )}
                  {onDueDateRangeChange && (
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">
                        Due Date
                      </label>
                      <DateRangePicker
                        onDateRangeChange={onDueDateRangeChange}
                        placeholder="Select due date range"
                        value={dueDateRange}
                      />
                    </div>
                  )}
                  {onPaymentDateRangeChange && (
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">
                        Payment Date
                      </label>
                      <DateRangePicker
                        onDateRangeChange={onPaymentDateRangeChange}
                        placeholder="Select payment date range"
                        value={paymentDateRange}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Amount Range Filter */}
            {onAmountRangeChange && amountStats && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Amount Range</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={amountRange?.min ?? ''}
                        onChange={(e) => {
                          const value = e.target.value === '' ? null : (isNaN(parseFloat(e.target.value)) ? null : parseFloat(e.target.value));
                          const currentRange = amountRange || { min: null, max: null };
                          onAmountRangeChange({ ...currentRange, min: value });
                        }}
                        className="h-8 text-xs"
                        min={0}
                        step="0.01"
                      />
                      <span className="text-xs text-gray-500">to</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={amountRange?.max ?? ''}
                        onChange={(e) => {
                          const value = e.target.value === '' ? null : (isNaN(parseFloat(e.target.value)) ? null : parseFloat(e.target.value));
                          const currentRange = amountRange || { min: null, max: null };
                          onAmountRangeChange({ ...currentRange, max: value });
                        }}
                        className="h-8 text-xs"
                        min={0}
                        step="0.01"
                      />
                      {(amountRange?.min !== null || amountRange?.max !== null) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAmountRangeChange?.({ min: null, max: null })}
                          className="h-8 w-8 p-0"
                          aria-label="Clear amount range"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Range: {currency(amountStats.min).format()} - {currency(amountStats.max).format()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Budget Range Filter */}
            {onBudgetRangeChange && budgetStats && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Budget Range</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={budgetRange?.min ?? ''}
                        onChange={(e) => {
                          const value = e.target.value === '' ? null : (isNaN(parseFloat(e.target.value)) ? null : parseFloat(e.target.value));
                          const currentRange = budgetRange || { min: null, max: null };
                          onBudgetRangeChange({ ...currentRange, min: value });
                        }}
                        className="h-8 text-xs"
                        min={0}
                        step="100"
                      />
                      <span className="text-xs text-gray-500">to</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={budgetRange?.max ?? ''}
                        onChange={(e) => {
                          const value = e.target.value === '' ? null : (isNaN(parseFloat(e.target.value)) ? null : parseFloat(e.target.value));
                          const currentRange = budgetRange || { min: null, max: null };
                          onBudgetRangeChange({ ...currentRange, max: value });
                        }}
                        className="h-8 text-xs"
                        min={0}
                        step="100"
                      />
                      {(budgetRange?.min !== null || budgetRange?.max !== null) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onBudgetRangeChange?.({ min: null, max: null })}
                          className="h-8 w-8 p-0"
                          aria-label="Clear budget range"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Range: {currency(budgetStats.min).format()} - {currency(budgetStats.max).format()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );

  // Render to document.body using portal to escape any container constraints
  return createPortal(filterPanelContent, document.body);
}

