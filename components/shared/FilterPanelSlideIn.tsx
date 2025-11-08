import { useMemo, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Filter, Calendar, Tag, DollarSign, TrendingUp, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { AdvancedFilterPanel, type FilterGroup } from './AdvancedFilterPanel';
import { DateRangePicker, DateRange } from './DateRangePicker';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import currency from 'currency.js';
import { cn } from '../ui/utils';

export interface FilterPanelSlideInProps {
  filters: FilterGroup[];
  filterValues: Record<string, string | string[]>;
  onFilterChange: (filters: Record<string, string | string[]>) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
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
  onSearchChange: _onSearchChange,
  resultCount,
  totalCount,
  searchPlaceholder: _searchPlaceholder,
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
    let count = 0;
    
    // Count filter values (checkboxes and selects)
    Object.values(filterValues).forEach((value) => {
      if (Array.isArray(value)) {
        // For checkbox filters (arrays), count each selected option
        count += value.length;
      } else if (value && value !== '' && value !== null && value !== undefined) {
        // For select/radio filters (strings), count if not empty
        // Explicitly exclude empty strings, null, and undefined
        count += 1;
      }
    });
    
    // Count date range filters - each date range with a 'from' date counts as 1 filter
    if (issueDateRange?.from) count += 1;
    if (dueDateRange?.from) count += 1;
    if (paymentDateRange?.from) count += 1;
    
    // Count amount range filter - counts as 1 filter if either min or max is set (not null)
    // Note: 0 is a valid value for min/max, so we check for !== null, not truthiness
    if (amountRange && (amountRange.min !== null || amountRange.max !== null)) {
      count += 1;
    }
    
    // Count budget range filter - counts as 1 filter if either min or max is set (not null)
    // Note: 0 is a valid value for min/max, so we check for !== null, not truthiness
    if (budgetRange && (budgetRange.min !== null || budgetRange.max !== null)) {
      count += 1;
    }
    
    return count;
  }, [filterValues, issueDateRange, dueDateRange, paymentDateRange, amountRange, budgetRange]);

  // Clear all filters function
  const handleClearAllFilters = useCallback(() => {
    // Clear all filter values (set to default empty state)
    const defaultFilterValues = Object.fromEntries(
      filters.map((f) => [f.id, f.type === 'checkbox' ? [] : ''])
    );
    onFilterChange(defaultFilterValues);
    
    // Clear all date ranges
    if (onIssueDateRangeChange) onIssueDateRangeChange(undefined);
    if (onDueDateRangeChange) onDueDateRangeChange(undefined);
    if (onPaymentDateRangeChange) onPaymentDateRangeChange(undefined);
    
    // Clear amount range
    if (onAmountRangeChange) onAmountRangeChange({ min: null, max: null });
    
    // Clear budget range
    if (onBudgetRangeChange) onBudgetRangeChange({ min: null, max: null });
  }, [filters, onFilterChange, onIssueDateRangeChange, onDueDateRangeChange, onPaymentDateRangeChange, onAmountRangeChange, onBudgetRangeChange]);

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
        onClick={(e) => {
          // Don't close if clicking on popover/calendar elements
          const target = e.target as HTMLElement;
          if (
            target.closest('[data-filter-panel]') ||
            target.closest('[data-radix-popper-content-wrapper]') ||
            target.closest('[role="dialog"]') ||
            target.closest('[data-radix-portal]')
          ) {
            return;
          }
          onClose();
        }}
        aria-hidden="true"
        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      {/* Slide-in Panel - full viewport height, starts at very left of screen */}
      <div
        data-filter-panel
        className={cn(
          'fixed w-[570px] bg-white shadow-2xl z-[9999] transition-transform duration-300 ease-in-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ 
          height: '100vh',
          top: 0,
          left: 0, // Start at very left of screen
          maxHeight: '100vh',
        }}
        onClick={(e) => {
          // Prevent clicks inside the panel from closing it
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="flex flex-col border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Filter className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-base font-display font-semibold text-gray-900 tracking-tight">Filters</h2>
                {activeFilterCount > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
                  </p>
                )}
              </div>
              {activeFilterCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="h-6 px-2.5 bg-primary text-primary-foreground border-primary/30 font-semibold shadow-sm"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
              aria-label="Close filters panel"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          {activeFilterCount > 0 && (
            <div className="px-5 pb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAllFilters}
                className="w-full h-9 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-200"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="p-5 space-y-5">
            {/* Result Count - Prominent Display */}
            {resultCount !== undefined && totalCount !== undefined && (
              <div className="px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">{resultCount}</span>
                    <span className="text-sm text-gray-500">of</span>
                    <span className="text-lg font-semibold text-gray-700">{totalCount}</span>
                    <span className="text-sm text-gray-500">results</span>
                  </div>
                  {resultCount < totalCount && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      Filtered
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Category Filters Section (Status, Priority, etc.) */}
            {filters.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Categories</h3>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <AdvancedFilterPanel
                    filters={filters}
                    filterValues={filterValues}
                    onFilterChange={onFilterChange}
                    searchQuery={searchQuery || ''}
                    onSearchChange={undefined}
                    resultCount={undefined}
                    totalCount={undefined}
                    variant="sidebar"
                    className="border-0 shadow-none bg-transparent"
                    hideHeader={true}
                  />
                </div>
              </div>
            )}

            {/* Date Range Filters Section */}
            {(onIssueDateRangeChange || onDueDateRangeChange || onPaymentDateRangeChange) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Date Ranges</h3>
                </div>
                <Card className="border-gray-200 shadow-sm">
                  <CardContent 
                    className="p-4 space-y-4"
                    onClick={(e) => {
                      // Prevent clicks on date pickers from propagating to backdrop
                      e.stopPropagation();
                    }}
                  >
                    {onIssueDateRangeChange && (
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            Issue Date
                          </label>
                          {issueDateRange?.from && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onIssueDateRangeChange(undefined)}
                              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Clear
                            </Button>
                          )}
                        </div>
                        <DateRangePicker
                          onDateRangeChange={onIssueDateRangeChange}
                          placeholder="Select issue date range"
                          value={issueDateRange}
                          className="w-full"
                        />
                      </div>
                    )}
                    {onDueDateRangeChange && onIssueDateRangeChange && (
                      <Separator className="my-1" />
                    )}
                    {onDueDateRangeChange && (
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            Due Date
                          </label>
                          {dueDateRange?.from && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDueDateRangeChange(undefined)}
                              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Clear
                            </Button>
                          )}
                        </div>
                        <DateRangePicker
                          onDateRangeChange={onDueDateRangeChange}
                          placeholder="Select due date range"
                          value={dueDateRange}
                          className="w-full"
                        />
                      </div>
                    )}
                    {onPaymentDateRangeChange && (onIssueDateRangeChange || onDueDateRangeChange) && (
                      <Separator className="my-1" />
                    )}
                    {onPaymentDateRangeChange && (
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            Payment Date
                          </label>
                          {paymentDateRange?.from && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onPaymentDateRangeChange(undefined)}
                              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Clear
                            </Button>
                          )}
                        </div>
                        <DateRangePicker
                          onDateRangeChange={onPaymentDateRangeChange}
                          placeholder="Select payment date range"
                          value={paymentDateRange}
                          className="w-full"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Amount Range Filter Section */}
            {onAmountRangeChange && amountStats && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Amount Range</h3>
                </div>
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-600 mb-1.5 block">Minimum</label>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={amountRange?.min ?? ''}
                          onChange={(e) => {
                            const value = e.target.value === '' ? null : (isNaN(parseFloat(e.target.value)) ? null : parseFloat(e.target.value));
                            const currentRange = amountRange || { min: null, max: null };
                            onAmountRangeChange({ ...currentRange, min: value });
                          }}
                          className="h-9 text-sm"
                          min={0}
                          step="0.01"
                        />
                      </div>
                      <div className="pt-6 px-1">
                        <span className="text-sm text-gray-400 font-medium">to</span>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-600 mb-1.5 block">Maximum</label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Max"
                            value={amountRange?.max ?? ''}
                            onChange={(e) => {
                              const value = e.target.value === '' ? null : (isNaN(parseFloat(e.target.value)) ? null : parseFloat(e.target.value));
                              const currentRange = amountRange || { min: null, max: null };
                              onAmountRangeChange({ ...currentRange, max: value });
                            }}
                            className="h-9 text-sm"
                            min={0}
                            step="0.01"
                          />
                          {(amountRange?.min !== null || amountRange?.max !== null) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onAmountRangeChange?.({ min: null, max: null })}
                              className="h-9 w-9 p-0 flex-shrink-0 mt-6"
                              aria-label="Clear amount range"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Available range:</span>
                        <span className="font-medium text-gray-700">
                          {currency(amountStats.min).format()} - {currency(amountStats.max).format()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Budget Range Filter Section */}
            {onBudgetRangeChange && budgetStats && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Budget Range</h3>
                </div>
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-600 mb-1.5 block">Minimum</label>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={budgetRange?.min ?? ''}
                          onChange={(e) => {
                            const value = e.target.value === '' ? null : (isNaN(parseFloat(e.target.value)) ? null : parseFloat(e.target.value));
                            const currentRange = budgetRange || { min: null, max: null };
                            onBudgetRangeChange({ ...currentRange, min: value });
                          }}
                          className="h-9 text-sm"
                          min={0}
                          step="100"
                        />
                      </div>
                      <div className="pt-6 px-1">
                        <span className="text-sm text-gray-400 font-medium">to</span>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-600 mb-1.5 block">Maximum</label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Max"
                            value={budgetRange?.max ?? ''}
                            onChange={(e) => {
                              const value = e.target.value === '' ? null : (isNaN(parseFloat(e.target.value)) ? null : parseFloat(e.target.value));
                              const currentRange = budgetRange || { min: null, max: null };
                              onBudgetRangeChange({ ...currentRange, max: value });
                            }}
                            className="h-9 text-sm"
                            min={0}
                            step="100"
                          />
                          {(budgetRange?.min !== null || budgetRange?.max !== null) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onBudgetRangeChange?.({ min: null, max: null })}
                              className="h-9 w-9 p-0 flex-shrink-0 mt-6"
                              aria-label="Clear budget range"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Available range:</span>
                        <span className="font-medium text-gray-700">
                          {currency(budgetStats.min).format()} - {currency(budgetStats.max).format()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  // Render to document.body using portal to escape any container constraints
  return createPortal(filterPanelContent, document.body);
}

