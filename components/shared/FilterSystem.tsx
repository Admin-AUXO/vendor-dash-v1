import { useState, useMemo } from 'react';
import { Filter, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/sheet';
import { AdvancedFilterPanel, type FilterGroup } from './AdvancedFilterPanel';
import { FilterBar } from './FilterBar';
import { SearchBar } from './SearchBar';
import { cn } from '../ui/utils';

export interface FilterSystemProps {
  filters: FilterGroup[];
  filterValues: Record<string, string | string[]>;
  onFilterChange: (filters: Record<string, string | string[]>) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount?: number;
  totalCount?: number;
  searchPlaceholder?: string;
  className?: string;
  showSearchBar?: boolean;
  showFilterBar?: boolean;
}

export function FilterSystem({
  filters,
  filterValues,
  onFilterChange,
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
  searchPlaceholder = 'Search...',
  className,
  showSearchBar = true,
  showFilterBar = true,
}: FilterSystemProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Get active filters for display
  const activeFilters = useMemo(() => {
    const active: Array<{
      groupId: string;
      groupLabel: string;
      value: string;
      label: string;
    }> = [];

    filters.forEach((group) => {
      const value = filterValues[group.id];
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((val) => {
          const option = group.options.find((opt) => opt.value === val);
          if (option) {
            active.push({
              groupId: group.id,
              groupLabel: group.label,
              value: val,
              label: option.label,
            });
          }
        });
      } else if (value && typeof value === 'string') {
        const option = group.options.find((opt) => opt.value === value);
        if (option) {
          active.push({
            groupId: group.id,
            groupLabel: group.label,
            value: value,
            label: option.label,
          });
        }
      }
    });

    return active;
  }, [filters, filterValues]);

  const handleRemoveFilter = (groupId: string, value: string) => {
    const currentValue = filterValues[groupId];
    if (Array.isArray(currentValue)) {
      const newValue = currentValue.filter((v) => v !== value);
      onFilterChange({ ...filterValues, [groupId]: newValue });
    } else {
      onFilterChange({ ...filterValues, [groupId]: '' });
    }
  };

  const handleClearAll = () => {
    const defaultValues = Object.fromEntries(
      filters.map((f) => [f.id, f.type === 'checkbox' ? [] : ''])
    );
    onFilterChange(defaultValues);
    onSearchChange('');
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Search Bar and Mobile Filter Button */}
      {showSearchBar && (
        <div className="flex gap-3">
          <div className="flex-1">
            <SearchBar
              placeholder={searchPlaceholder}
              onSearch={onSearchChange}
              value={searchQuery}
              onChange={onSearchChange}
            />
          </div>
          <Drawer open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="default" className="lg:hidden">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFilters.length > 0 && (
                  <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh]">
              <DrawerHeader className="border-b">
                <DrawerTitle>Filters</DrawerTitle>
              </DrawerHeader>
              <AdvancedFilterPanel
                filters={filters}
                filterValues={filterValues}
                onFilterChange={(newFilters) => {
                  onFilterChange(newFilters);
                  // Optionally close drawer after applying filters on mobile
                  // setMobileDrawerOpen(false);
                }}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                resultCount={resultCount}
                totalCount={totalCount}
                variant="drawer"
              />
            </DrawerContent>
          </Drawer>
        </div>
      )}

      {/* Active Filters Bar */}
      {showFilterBar && (
        <FilterBar
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAll}
          resultCount={resultCount}
          totalCount={totalCount}
          onToggleFilters={() => setMobileDrawerOpen(true)}
        />
      )}
    </div>
  );
}

// Separate component for desktop sidebar
export function FilterSidebar({
  filters,
  filterValues,
  onFilterChange,
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
  className,
}: Omit<FilterSystemProps, 'showSearchBar' | 'showFilterBar' | 'searchPlaceholder'>) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(filterValues).reduce((count, value) => {
      if (Array.isArray(value)) {
        return count + value.length;
      }
      return count + (value ? 1 : 0);
    }, 0);
  }, [filterValues]);

  return (
    <div className={cn('sticky top-4 transition-all duration-200', className)}>
      <div className="border border-border rounded-lg shadow-sm bg-white overflow-hidden">
        {!isCollapsed ? (
          <>
            <div className="flex items-center justify-between p-3 border-b border-border bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2" id="filters-heading">
                <Filter className="w-4 h-4" aria-hidden="true" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 text-xs text-gray-500">({activeFilterCount})</span>
                )}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(true)}
                className="h-8 w-8 p-0"
                aria-label="Collapse filters sidebar"
                aria-expanded="true"
                aria-controls="filter-panel"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
            <div id="filter-panel" role="region" aria-labelledby="filters-heading">
              <AdvancedFilterPanel
                filters={filters}
                filterValues={filterValues}
                onFilterChange={onFilterChange}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                resultCount={resultCount}
                totalCount={totalCount}
                variant="sidebar"
                className="border-0 shadow-none"
              />
            </div>
          </>
        ) : (
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(false)}
              className="w-full justify-center h-10"
              aria-label={`Expand filters sidebar${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ''}`}
              aria-expanded="false"
              aria-controls="filter-panel"
            >
              <Filter className="w-4 h-4" aria-hidden="true" />
              {activeFilterCount > 0 && (
                <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

