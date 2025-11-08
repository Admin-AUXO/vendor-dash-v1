import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { cn } from '../ui/utils';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  type?: 'checkbox' | 'radio' | 'select';
  value?: string | string[];
}

interface FilterPanelProps {
  filters: FilterGroup[];
  onFilterChange: (filters: Record<string, string | string[]>) => void;
  className?: string;
  collapsible?: boolean;
}

export function FilterPanel({ filters, onFilterChange, className, collapsible = true }: FilterPanelProps) {
  // Start with all groups collapsed by default to save space
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>(
    Object.fromEntries(filters.map((f) => [f.id, f.value || (f.type === 'checkbox' ? [] : '')]))
  );

  const toggleGroup = (groupId: string) => {
    if (!collapsible) return;
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const handleFilterChange = (groupId: string, value: string | string[]) => {
    const newValues = { ...filterValues, [groupId]: value };
    setFilterValues(newValues);
    onFilterChange(newValues);
  };

  const handleCheckboxChange = (groupId: string, optionValue: string, checked: boolean) => {
    const currentValues = (filterValues[groupId] as string[]) || [];
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter((v) => v !== optionValue);
    handleFilterChange(groupId, newValues);
  };

  const clearFilter = (groupId: string) => {
    const filter = filters.find((f) => f.id === groupId);
    const defaultValue = filter?.type === 'checkbox' ? [] : '';
    handleFilterChange(groupId, defaultValue);
  };

  const clearAllFilters = () => {
    const defaultValues = Object.fromEntries(
      filters.map((f) => [f.id, f.type === 'checkbox' ? [] : ''])
    );
    setFilterValues(defaultValues);
    onFilterChange(defaultValues);
  };

  const hasActiveFilters = Object.values(filterValues).some((v) =>
    Array.isArray(v) ? v.length > 0 : v !== ''
  );

  return (
    <div className={cn('bg-white border border-border rounded-lg p-3 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-display font-semibold text-gray-900 tracking-tight">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-primary hover:text-primary-hover font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3">
        {filters.map((filter) => {
          const isExpanded = expandedGroups.has(filter.id);
          const hasValue = Array.isArray(filterValues[filter.id])
            ? (filterValues[filter.id] as string[]).length > 0
            : filterValues[filter.id] !== '';

          return (
            <div key={filter.id} className="border-b border-border last:border-b-0 pb-3 last:pb-0">
              <button
                onClick={() => toggleGroup(filter.id)}
                className={cn(
                  'w-full flex items-center justify-between text-sm font-medium text-gray-900 mb-2',
                  !collapsible && 'cursor-default'
                )}
              >
                <span>{filter.label}</span>
                {collapsible &&
                  (isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ))}
              </button>

              {isExpanded && (
                <div className="space-y-2">
                  {filter.type === 'checkbox' ? (
                    <div className="space-y-1.5">
                      {filter.options.map((option) => {
                        const checked = (filterValues[filter.id] as string[])?.includes(option.value) || false;
                        return (
                          <label
                            key={option.value}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => handleCheckboxChange(filter.id, option.value, e.target.checked)}
                              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  ) : filter.type === 'radio' ? (
                    <div className="space-y-1.5">
                      {filter.options.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                        >
                          <input
                            type="radio"
                            name={filter.id}
                            value={option.value}
                            checked={filterValues[filter.id] === option.value}
                            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <select
                      value={filterValues[filter.id] as string}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">All</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {hasValue && (
                    <button
                      onClick={() => clearFilter(filter.id)}
                      className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mt-1"
                    >
                      <X className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

