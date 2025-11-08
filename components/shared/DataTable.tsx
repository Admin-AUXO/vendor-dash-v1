import { useState, useMemo, useRef } from 'react';
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
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const tableContainerRef = useRef<HTMLDivElement>(null);

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
    },
  });

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

                    return (
                      <th
                        key={header.id}
                        className={cn(
                          'px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-muted',
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
                        <div className="flex items-center gap-2">
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
                      className="hover:bg-muted transition-colors"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-sm text-gray-900" role="gridcell">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-muted transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm text-gray-900" role="gridcell">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
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

