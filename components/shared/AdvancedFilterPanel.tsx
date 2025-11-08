import { useState } from 'react';
import { Search, X, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  type?: 'checkbox' | 'radio' | 'select';
  searchable?: boolean;
}

export interface AdvancedFilterPanelProps {
  filters: FilterGroup[];
  filterValues: Record<string, string | string[]>;
  onFilterChange: (filters: Record<string, string | string[]>) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  resultCount?: number;
  totalCount?: number;
  className?: string;
  variant?: 'sidebar' | 'drawer';
  hideHeader?: boolean;
}

export function AdvancedFilterPanel({
  filters,
  filterValues,
  onFilterChange,
  searchQuery = '',
  onSearchChange,
  resultCount,
  totalCount,
  className,
  variant = 'sidebar',
  hideHeader = false,
}: AdvancedFilterPanelProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [filterSearchQueries, setFilterSearchQueries] = useState<Record<string, string>>({});

  const toggleGroup = (groupId: string) => {
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

  const handleCheckboxChange = (groupId: string, optionValue: string, checked: boolean) => {
    const currentValues = (filterValues[groupId] as string[]) || [];
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter((v) => v !== optionValue);
    
    const updatedFilters = { ...filterValues, [groupId]: newValues };
    onFilterChange(updatedFilters);
  };

  const handleSelectChange = (groupId: string, value: string) => {
    const updatedFilters = { ...filterValues, [groupId]: value };
    onFilterChange(updatedFilters);
  };

  const clearFilter = (groupId: string) => {
    const filter = filters.find((f) => f.id === groupId);
    const defaultValue = filter?.type === 'checkbox' ? [] : '';
    const updatedFilters = { ...filterValues, [groupId]: defaultValue };
    onFilterChange(updatedFilters);
  };

  const clearAllFilters = () => {
    const defaultValues = Object.fromEntries(
      filters.map((f) => [f.id, f.type === 'checkbox' ? [] : ''])
    );
    onFilterChange(defaultValues);
  };

  const hasActiveFilters = Object.values(filterValues).some((v) =>
    Array.isArray(v) ? v.length > 0 : v !== ''
  );

  const getFilteredOptions = (group: FilterGroup): FilterOption[] => {
    const searchQuery = filterSearchQueries[group.id]?.toLowerCase() || '';
    if (!searchQuery || !group.searchable) {
      return group.options;
    }
    return group.options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery) ||
      option.value.toLowerCase().includes(searchQuery)
    );
  };

  const getActiveFilterCount = (groupId: string): number => {
    const value = filterValues[groupId];
    return Array.isArray(value) ? value.length : value ? 1 : 0;
  };

  return (
    <div className={cn('flex flex-col h-full bg-white', className)}>
      {/* Header */}
      {!hideHeader && (
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>

          {/* Main Search Bar */}
          {onSearchChange && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-10 h-9"
              />
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
        </div>
      )}

      {/* Filter Groups */}
      <ScrollArea className={cn("flex-1", variant === 'drawer' ? "h-[calc(85vh-200px)]" : hideHeader ? "max-h-none" : "max-h-[calc(100vh-300px)]")}>
        <div className={cn("space-y-4", hideHeader ? "" : "p-4")}>
          {filters.map((filter) => {
            const isExpanded = expandedGroups.has(filter.id);
            const activeCount = getActiveFilterCount(filter.id);
            const filteredOptions = getFilteredOptions(filter);

            return (
              <div key={filter.id} className="space-y-2">
                <button
                  onClick={() => toggleGroup(filter.id)}
                  className="w-full flex items-center justify-between text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>{filter.label}</span>
                    {activeCount > 0 && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                        {activeCount}
                      </Badge>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="space-y-3 pl-2 border-l-2 border-gray-100">
                    {/* Search within filter options */}
                    {filter.searchable && filteredOptions.length > 5 && (
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder={`Search ${filter.label.toLowerCase()}...`}
                          value={filterSearchQueries[filter.id] || ''}
                          onChange={(e) =>
                            setFilterSearchQueries((prev) => ({
                              ...prev,
                              [filter.id]: e.target.value,
                            }))
                          }
                          className="pl-8 pr-8 h-8 text-sm"
                        />
                        {filterSearchQueries[filter.id] && (
                          <button
                            type="button"
                            onClick={() =>
                              setFilterSearchQueries((prev) => {
                                const next = { ...prev };
                                delete next[filter.id];
                                return next;
                              })
                            }
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Filter Options */}
                    {filter.type === 'checkbox' ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                          filteredOptions.map((option) => {
                            const checked = (filterValues[filter.id] as string[])?.includes(option.value) || false;
                            return (
                              <label
                                key={option.value}
                                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors group"
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(checked) =>
                                    handleCheckboxChange(filter.id, option.value, checked as boolean)
                                  }
                                />
                                <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                                {option.count !== undefined && (
                                  <span className="text-xs text-gray-500 group-hover:text-gray-700">
                                    ({option.count})
                                  </span>
                                )}
                              </label>
                            );
                          })
                        ) : (
                          <div className="text-sm text-gray-500 py-2 text-center">
                            No options found
                          </div>
                        )}
                      </div>
                    ) : (
                      <select
                        value={(filterValues[filter.id] as string) || ''}
                        onChange={(e) => handleSelectChange(filter.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                      >
                        <option value="">All</option>
                        {filteredOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label} {option.count !== undefined ? `(${option.count})` : ''}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Clear filter button */}
                    {activeCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearFilter(filter.id)}
                        className="h-7 text-xs text-gray-600 hover:text-gray-900"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear {filter.label}
                      </Button>
                    )}
                  </div>
                )}
                <Separator className="mt-4" />
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

