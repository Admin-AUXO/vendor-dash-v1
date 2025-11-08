import { useState } from 'react';
import { Search, X, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Input, Checkbox, ScrollArea, Badge, Button } from '../../ui';
import { cn } from '../../ui/utils';

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
  // Auto-expand first filter group for better UX
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(filters.length > 0 ? [filters[0].id] : [])
  );
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
  
  // Expand all groups with active filters
  const expandActiveGroups = () => {
    const activeGroupIds = new Set<string>();
    filters.forEach((filter) => {
      const value = filterValues[filter.id];
      if (Array.isArray(value) ? value.length > 0 : value) {
        activeGroupIds.add(filter.id);
      }
    });
    setExpandedGroups(activeGroupIds);
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
              <h2 className="text-lg font-display font-semibold text-gray-900 tracking-tight">Filters</h2>
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
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{resultCount}</span>
                {' '}of{' '}
                <span className="font-medium text-gray-700">{totalCount}</span>
                {' '}results
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={expandActiveGroups}
                  className="h-7 text-xs text-primary hover:text-primary-hover"
                >
                  Expand Active
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Filter Groups */}
      <ScrollArea className={cn("flex-1", variant === 'drawer' ? "h-[calc(85vh-200px)]" : hideHeader ? "max-h-none" : "max-h-[calc(100vh-300px)]")}>
        <div className={cn("space-y-1", hideHeader ? "p-3" : "p-4")}>
          {filters.map((filter, index) => {
            const isExpanded = expandedGroups.has(filter.id);
            const activeCount = getActiveFilterCount(filter.id);
            const filteredOptions = getFilteredOptions(filter);

            return (
              <div key={filter.id} className={cn("space-y-0", index > 0 && "border-t border-gray-100 pt-1")}>
                <button
                  onClick={() => toggleGroup(filter.id)}
                  className={cn(
                    "w-full flex items-center justify-between text-sm font-medium transition-all duration-200 rounded-lg px-3 py-2.5",
                    "hover:bg-gray-50/80 active:bg-gray-100",
                    isExpanded && "bg-primary/5 border border-primary/20",
                    activeCount > 0 && "text-primary font-semibold"
                  )}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="truncate">{filter.label}</span>
                    {activeCount > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="h-5 px-2 text-xs bg-primary text-primary-foreground border-primary/30 font-semibold shadow-sm flex-shrink-0"
                      >
                        {activeCount}
                      </Badge>
                    )}
                    {filteredOptions.length > 0 && activeCount === 0 && (
                      <span className="text-xs text-gray-400 font-normal flex-shrink-0">
                        ({filteredOptions.length})
                      </span>
                    )}
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="space-y-3 mt-2 ml-1 pl-4 border-l-2 border-primary/30 bg-gradient-to-r from-primary/5 to-transparent rounded-r-lg py-3 pr-3">
                    {/* Search within filter options */}
                    {filter.searchable && filteredOptions.length > 5 && (
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
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
                          className="pl-9 pr-9 h-9 text-sm bg-white border-gray-200 focus:border-primary shadow-sm"
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
                            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Filter Options */}
                    {filter.type === 'checkbox' ? (
                      <div className="space-y-1.5 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-1.5">
                        {filteredOptions.length > 0 ? (
                          filteredOptions.map((option) => {
                            const checked = (filterValues[filter.id] as string[])?.includes(option.value) || false;
                            return (
                              <label
                                key={option.value}
                                className={cn(
                                  "flex items-center gap-3 cursor-pointer p-2.5 rounded-lg transition-all duration-150 group",
                                  "hover:bg-white hover:shadow-sm hover:border hover:border-gray-200",
                                  checked && "bg-primary/10 border border-primary/30 shadow-sm"
                                )}
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(checked) =>
                                    handleCheckboxChange(filter.id, option.value, checked as boolean)
                                  }
                                  className={cn(
                                    "transition-all",
                                    checked ? "border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary" : "border-gray-300"
                                  )}
                                />
                                <span className={cn(
                                  "text-sm flex-1 transition-colors",
                                  checked ? "text-gray-900 font-semibold" : "text-gray-700 group-hover:text-gray-900"
                                )}>
                                  {option.label}
                                </span>
                                {option.count !== undefined && (
                                  <span className={cn(
                                    "text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 transition-colors",
                                    checked 
                                      ? "bg-primary text-primary-foreground" 
                                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                                  )}>
                                    {option.count}
                                  </span>
                                )}
                              </label>
                            );
                          })
                        ) : (
                          <div className="text-sm text-gray-500 py-6 text-center bg-gray-50 rounded-lg border border-gray-200">
                            <p className="mb-2">No options found</p>
                            {filterSearchQueries[filter.id] && (
                              <button
                                onClick={() =>
                                  setFilterSearchQueries((prev) => {
                                    const next = { ...prev };
                                    delete next[filter.id];
                                    return next;
                                  })
                                }
                                className="text-primary hover:underline font-medium text-xs"
                              >
                                Clear search
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <select
                        value={(filterValues[filter.id] as string) || ''}
                        onChange={(e) => handleSelectChange(filter.id, e.target.value)}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white shadow-sm transition-all"
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
                        className="h-8 text-xs text-gray-600 hover:text-gray-900 hover:bg-white/80 w-full justify-start border border-gray-200 hover:border-gray-300 rounded-lg transition-all"
                      >
                        <X className="w-3.5 h-3.5 mr-2" />
                        Clear {filter.label}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

