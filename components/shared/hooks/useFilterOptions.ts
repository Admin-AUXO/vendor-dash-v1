import { useMemo } from 'react';

/**
 * Calculate filter options with counts from data
 */
export function useFilterOptions<T>(
  data: T[],
  fieldGetters: Record<string, (item: T) => string | string[]>
) {
  return useMemo(() => {
    const options: Record<string, string[]> = {};
    const counts: Record<string, Record<string, number>> = {};

    Object.entries(fieldGetters).forEach(([fieldKey, getValue]) => {
      const uniqueValues = new Set<string>();
      const fieldCounts: Record<string, number> = {};

      data.forEach((item) => {
        const value = getValue(item);
        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (v) {
              uniqueValues.add(v);
              fieldCounts[v] = (fieldCounts[v] || 0) + 1;
            }
          });
        } else if (value) {
          uniqueValues.add(value);
          fieldCounts[value] = (fieldCounts[value] || 0) + 1;
        }
      });

      options[fieldKey] = Array.from(uniqueValues).sort();
      counts[fieldKey] = fieldCounts;
    });

    return { options, counts };
  }, [data, fieldGetters]);
}

/**
 * Calculate numeric range stats (min/max) from data
 */
export function useNumericRangeStats<T>(
  data: T[],
  fieldGetter: (item: T) => number
) {
  return useMemo(() => {
    if (data.length === 0) {
      return { min: 0, max: 0 };
    }

    const values = data.map(fieldGetter);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [data, fieldGetter]);
}

