import { X, Filter } from 'lucide-react';
import { Badge, Button } from '../../ui';
import { cn } from '../../ui/utils';

interface ActiveFilter {
  groupId: string;
  groupLabel: string;
  value: string;
  label: string;
}

interface FilterBarProps {
  activeFilters: ActiveFilter[];
  onRemoveFilter: (groupId: string, value: string) => void;
  onClearAll: () => void;
  resultCount?: number;
  totalCount?: number;
  onToggleFilters?: () => void;
  className?: string;
}

export function FilterBar({
  activeFilters,
  onRemoveFilter,
  onClearAll,
  resultCount,
  totalCount,
  onToggleFilters,
  className,
}: FilterBarProps) {
  if (activeFilters.length === 0 && !resultCount) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2 p-3 bg-gray-50 border border-border rounded-lg', className)}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {activeFilters.length > 0 && (
          <>
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-600 font-medium flex-shrink-0">Filters:</span>
            <div className="flex flex-wrap gap-2 flex-1">
              {activeFilters.map((filter, index) => (
                <Badge
                  key={`${filter.groupId}-${filter.value}-${index}`}
                  variant="secondary"
                  className="text-xs font-medium flex items-center gap-1.5 pr-1"
                >
                  <span className="text-gray-600">{filter.groupLabel}:</span>
                  <span>{filter.label}</span>
                  <button
                    onClick={() => onRemoveFilter(filter.groupId, filter.value)}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${filter.label} filter`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
        {resultCount !== undefined && totalCount !== undefined && (
          <span className="text-sm text-gray-600 whitespace-nowrap">
            <span className="font-medium">{resultCount}</span>
            {' '}of{' '}
            <span className="font-medium">{totalCount}</span>
            {' '}results
          </span>
        )}
        
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-7 text-xs"
          >
            Clear all
          </Button>
        )}
        
        {onToggleFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFilters}
            className="h-7 text-xs lg:hidden"
          >
            <Filter className="w-3 h-3 mr-1.5" />
            Filters
          </Button>
        )}
      </div>
    </div>
  );
}

