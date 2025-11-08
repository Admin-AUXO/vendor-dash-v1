import { useState, useMemo, useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { TableSkeleton } from './TableSkeleton';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  pagination?: boolean;
  pageSize?: number;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  enableVirtualScrolling?: boolean;
  virtualScrollingThreshold?: number;
  storageKey?: string; // Key for localStorage persistence
  onTableReady?: (table: ReturnType<typeof useReactTable<TData>>) => void; // Callback to get table instance
}

export function DataTable<TData>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  pagination = true,
  pageSize = 10,
  className,
  emptyMessage = 'No data available',
  loading = false,
  enableVirtualScrolling = false,
  virtualScrollingThreshold = 50,
  storageKey,
  onTableReady,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Get essential column IDs
  const essentialColumnIds = useMemo(() => {
    return columns
      .filter((col) => {
        const meta = col.meta as any;
        return meta?.essential === true;
      })
      .map((col) => col.id || (col as any).accessorKey)
      .filter((id): id is string => !!id);
  }, [columns]);

  // Initialize column visibility state (load once on mount)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    if (!storageKey || typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(`table-columns-${storageKey}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load column visibility from localStorage:', error);
    }
    return {};
  });

  // Wrapper for setColumnVisibility that prevents hiding essential columns
  const setColumnVisibilitySafe = useMemo(() => {
    return (updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => {
      setColumnVisibility((prev) => {
        const newState = typeof updater === 'function' ? updater(prev) : updater;
        // Ensure essential columns are never hidden
        const safeState = { ...newState };
        essentialColumnIds.forEach((colId) => {
          if (safeState[colId] === false) {
            delete safeState[colId]; // Remove hidden state for essential columns
          }
        });
        return safeState;
      });
    };
  }, [essentialColumnIds]);

  // Ensure essential columns are visible on mount and when columns change
  useEffect(() => {
    setColumnVisibility((prev) => {
      const updated = { ...prev };
      let changed = false;
      essentialColumnIds.forEach((colId) => {
        if (updated[colId] === false) {
          delete updated[colId];
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [essentialColumnIds]);

  // Save column visibility to localStorage when it changes
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        // Filter out essential columns from saved state (they're always visible)
        const stateToSave = { ...columnVisibility };
        essentialColumnIds.forEach((colId) => {
          delete stateToSave[colId];
        });
        localStorage.setItem(`table-columns-${storageKey}`, JSON.stringify(stateToSave));
      } catch (error) {
        console.warn('Failed to save column visibility to localStorage:', error);
      }
    }
  }, [columnVisibility, storageKey, essentialColumnIds]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibilitySafe,
    globalFilterFn: 'includesString',
    initialState: {
      pagination: {
        pageSize,
      },
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
  });

  // Expose table instance to parent via callback (only when table changes, not on every render)
  useEffect(() => {
    if (onTableReady) {
      onTableReady(table);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]); // Only depend on table, not onTableReady to avoid loops

  // Get filtered and sorted rows
  const { rows } = table.getRowModel();
  
  // Determine if virtual scrolling should be used
  const shouldUseVirtualScrolling = useMemo(() => {
    if (!enableVirtualScrolling || pagination) return false;
    return rows.length >= virtualScrollingThreshold;
  }, [enableVirtualScrolling, pagination, rows.length, virtualScrollingThreshold]);

  // Virtual scrolling setup (always call hook to follow React rules)
  const rowVirtualizer = useVirtualizer({
    count: shouldUseVirtualScrolling ? rows.length : 0,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 48, // Estimated row height in pixels
    overscan: 10,
  });

  const handleSearch = (query: string) => {
    setGlobalFilter(query);
    onSearch?.(query);
  };

  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;
  const pageSizeOptions = [10, 25, 50, 100];

  // Show skeleton while loading
  if (loading) {
    return <TableSkeleton rows={pageSize} columns={columns.length} className={className} />;
  }

  return (
    <div className={cn('space-y-4', className)}>
      {searchable && (
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm px-3 py-2 text-sm border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <div className="text-sm text-gray-500">
            {table.getFilteredRowModel().rows.length} of {data.length} results
          </div>
        </div>
      )}

      <div className="border border-border rounded-lg overflow-hidden">
        <div 
          ref={tableContainerRef}
          className={cn(
            'overflow-x-auto',
            shouldUseVirtualScrolling && 'overflow-y-auto',
            shouldUseVirtualScrolling && 'max-h-[600px]'
          )}
        >
          <table className="w-full">
            <thead className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDirection = header.column.getIsSorted();
                    const headerAlign = (header.column.columnDef.meta as any)?.headerAlign || 'left';
                    const textAlignClass = headerAlign === 'center' ? 'text-center' : headerAlign === 'right' ? 'text-right' : 'text-left';

                    return (
                      <th
                        key={header.id}
                        className={cn(
                          'px-4 py-3 text-xs font-display font-semibold text-gray-700 uppercase tracking-wider bg-muted',
                          textAlignClass,
                          canSort && 'cursor-pointer select-none hover:bg-gray-100'
                        )}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        role="columnheader"
                        aria-sort={
                          sortDirection === 'asc' ? 'ascending' :
                          sortDirection === 'desc' ? 'descending' :
                          'none'
                        }
                      >
                        <div className={cn('flex items-center gap-2', headerAlign === 'center' ? 'justify-center' : headerAlign === 'right' ? 'justify-end' : 'justify-start')}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span className="text-gray-400">
                              {sortDirection === 'asc' ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : sortDirection === 'desc' ? (
                                <ArrowDown className="w-4 h-4" />
                              ) : (
                                <ArrowUpDown className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody 
              className="bg-white divide-y divide-border"
              style={shouldUseVirtualScrolling ? {
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
              } : undefined}
            >
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              ) : shouldUseVirtualScrolling ? (
                rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <tr
                      key={row.id}
                      className="group hover:bg-muted transition-colors"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const cellAlign = (cell.column.columnDef.meta as any)?.cellAlign || (cell.column.columnDef.meta as any)?.headerAlign || 'left';
                        const textAlignClass = cellAlign === 'center' ? 'text-center' : cellAlign === 'right' ? 'text-right' : 'text-left';
                        return (
                          <td key={cell.id} className={cn('px-4 py-3 text-sm text-gray-900', textAlignClass)} role="gridcell">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="group hover:bg-muted transition-colors"
                  >
                      {row.getVisibleCells().map((cell) => {
                        const cellAlign = (cell.column.columnDef.meta as any)?.cellAlign || (cell.column.columnDef.meta as any)?.headerAlign || 'left';
                        const textAlignClass = cellAlign === 'center' ? 'text-center' : cellAlign === 'right' ? 'text-right' : 'text-left';
                        return (
                          <td key={cell.id} className={cn('px-4 py-3 text-sm text-gray-900', textAlignClass)} role="gridcell">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && !shouldUseVirtualScrolling && pageCount > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="px-2 py-1 text-sm border border-input-border rounded focus:ring-2 focus:ring-primary"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Page {currentPage + 1} of {pageCount}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!canPreviousPage}
                className="h-8 w-8 p-0"
                aria-label="Go to first page"
              >
                <ChevronsLeft className="w-4 h-4" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!canPreviousPage}
                className="h-8 w-8 p-0"
                aria-label="Go to previous page"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!canNextPage}
                className="h-8 w-8 p-0"
                aria-label="Go to next page"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(pageCount - 1)}
                disabled={!canNextPage}
                className="h-8 w-8 p-0"
                aria-label="Go to last page"
              >
                <ChevronsRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

