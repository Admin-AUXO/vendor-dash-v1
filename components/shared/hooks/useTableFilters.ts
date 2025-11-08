import { useMemo } from 'react';
import { DateRange } from '../forms/DateRangePicker';

export interface FilterConfig<T> {
  data: T[];
  searchQuery: string;
  filters: Record<string, string | string[]>;
  dateRanges?: Record<string, DateRange | undefined>;
  numericRanges?: Record<string, { min: number | null; max: number | null }>;
  searchFields: (item: T) => string[];
  filterFields: Record<string, (item: T) => string | string[]>;
  dateFields?: Record<string, (item: T) => Date | string>;
  numericFields?: Record<string, (item: T) => number>;
}

/**
 * Custom hook for filtering data with search, filters, date ranges, and numeric ranges
 */
export function useTableFilters<T>(config: FilterConfig<T>) {
  const {
    data,
    searchQuery,
    filters,
    dateRanges = {},
    numericRanges = {},
    searchFields,
    filterFields,
    dateFields = {},
    numericFields = {},
  } = config;

  const filteredData = useMemo(() => {
    let result = data;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) => {
        const searchableFields = searchFields(item);
        return searchableFields.some((field) =>
          field.toLowerCase().includes(query)
        );
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && Array.isArray(value) && value.length > 0) {
        const getFieldValue = filterFields[key];
        if (getFieldValue) {
          result = result.filter((item) => {
            const fieldValue = getFieldValue(item);
            if (Array.isArray(fieldValue)) {
              return value.some((v) => fieldValue.includes(v));
            }
            return value.includes(fieldValue);
          });
        }
      }
    });

    // Apply date range filters
    Object.entries(dateRanges).forEach(([key, dateRange]) => {
      if (dateRange?.from) {
        const getDateValue = dateFields[key];
        if (getDateValue) {
          const from = dateRange.from!;
          const to = dateRange.to || dateRange.from!;
          result = result.filter((item) => {
            const dateValue = new Date(getDateValue(item));
            return dateValue >= from && dateValue <= to;
          });
        }
      }
    });

    // Apply numeric range filters
    Object.entries(numericRanges).forEach(([key, range]) => {
      if (range.min !== null || range.max !== null) {
        const getNumericValue = numericFields[key];
        if (getNumericValue) {
          const min = range.min ?? -Infinity;
          const max = range.max ?? Infinity;
          result = result.filter((item) => {
            const numericValue = getNumericValue(item);
            return numericValue >= min && numericValue <= max;
          });
        }
      }
    });

    return result;
  }, [
    data,
    searchQuery,
    filters,
    dateRanges,
    numericRanges,
    searchFields,
    filterFields,
    dateFields,
    numericFields,
  ]);

  return filteredData;
}

