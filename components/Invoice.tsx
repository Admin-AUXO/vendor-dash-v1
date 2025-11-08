import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from './ui';
import { 
  StatCard, 
  FilterSystem,
  FilterPanelSlideIn,
  DataTable,
  StatusBadge,
  ExportButton,
  EmptyState,
  ColumnVisibilityToggle,
  type FilterGroup,
} from './shared';
import { 
  FileText, 
  Tag, 
  Clock, 
  AlertCircle,
  Plus,
  Edit,
  Download,
  Send,
  Eye,
  Filter
} from 'lucide-react';
import { invoices, workOrders, type Invoice } from '../data';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import currency from 'currency.js';
import { DateRange } from 'react-day-picker';


export function Invoice() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: [],
    client: [],
  });
  const [issueDateRange, setIssueDateRange] = useState<DateRange | undefined>();
  const [dueDateRange, setDueDateRange] = useState<DateRange | undefined>();
  const [amountRange, setAmountRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [tableInstance, setTableInstance] = useState<any>(null);

  // Stable callback for table ready
  const handleTableReady = useCallback((table: any) => {
    setTableInstance(table);
  }, []);

  // Create work order lookup map (internal ID -> display ID)
  const workOrderLookup = useMemo(() => {
    const lookup = new Map<string, string>();
    workOrders.forEach(wo => {
      lookup.set(wo.id, wo.workOrderId);
    });
    return lookup;
  }, []);

  // Get unique client names for filter
  const clientNames = useMemo(() => {
    const unique = Array.from(new Set(invoices.map(inv => inv.clientName)));
    return unique.sort();
  }, []);

  // Get min and max amounts for range filter
  const amountStats = useMemo(() => {
    const amounts = invoices.map(inv => inv.total);
    return {
      min: Math.min(...amounts),
      max: Math.max(...amounts),
    };
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    let data = invoices;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (inv: Invoice) => {
          const workOrderDisplayId = inv.workOrderId ? workOrderLookup.get(inv.workOrderId) : null;
          return (
            inv.invoiceNumber.toLowerCase().includes(query) ||
            inv.clientName.toLowerCase().includes(query) ||
            (workOrderDisplayId && workOrderDisplayId.toLowerCase().includes(query))
          );
        }
      );
    }

    // Apply status filter
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      data = data.filter((inv: Invoice) => filters.status.includes(inv.status));
    }

    // Apply client filter
    if (filters.client && Array.isArray(filters.client) && filters.client.length > 0) {
      data = data.filter((inv: Invoice) => filters.client.includes(inv.clientName));
    }

    // Apply issue date range filter
    if (issueDateRange?.from) {
      data = data.filter((inv: Invoice) => {
        const issueDate = new Date(inv.issueDate);
        const from = issueDateRange.from!;
        const to = issueDateRange.to || issueDateRange.from!;
        return issueDate >= from && issueDate <= to;
      });
    }

    // Apply due date range filter
    if (dueDateRange?.from) {
      data = data.filter((inv: Invoice) => {
        const dueDate = new Date(inv.dueDate);
        const from = dueDateRange.from!;
        const to = dueDateRange.to || dueDateRange.from!;
        return dueDate >= from && dueDate <= to;
      });
    }

    // Apply amount range filter
    if (amountRange.min !== null || amountRange.max !== null) {
      data = data.filter((inv: Invoice) => {
        const amount = inv.total;
        const min = amountRange.min ?? -Infinity;
        const max = amountRange.max ?? Infinity;
        return amount >= min && amount <= max;
      });
    }

    return data;
  }, [searchQuery, filters, issueDateRange, dueDateRange, amountRange, workOrderLookup]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter((inv: Invoice) => inv.status === 'paid').length;
    const pending = invoices.filter((inv: Invoice) => inv.status === 'sent' || inv.status === 'viewed' || inv.status === 'approved').length;
    const overdue = invoices.filter((inv: Invoice) => inv.status === 'overdue').length;
    const paidAmount = invoices
      .filter((inv: Invoice) => inv.status === 'paid')
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);
    const pendingAmount = invoices
      .filter((inv: Invoice) => inv.status === 'sent' || inv.status === 'viewed' || inv.status === 'approved')
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);
    const overdueAmount = invoices
      .filter((inv: Invoice) => inv.status === 'overdue')
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);

    return { total, paid, pending, overdue, paidAmount, pendingAmount, overdueAmount };
  }, []);

  // Handle stat card click to filter by status
  const handleStatCardClick = (statusType: 'all' | 'paid' | 'pending' | 'overdue') => {
    if (statusType === 'all') {
      setFilters({ ...filters, status: [] });
    } else if (statusType === 'paid') {
      setFilters({ ...filters, status: ['paid'] });
    } else if (statusType === 'pending') {
      setFilters({ ...filters, status: ['sent', 'viewed', 'approved'] });
    } else if (statusType === 'overdue') {
      setFilters({ ...filters, status: ['overdue'] });
    }
  };


  // Define columns
  const columns: ColumnDef<Invoice>[] = useMemo(() => [
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice #',
      meta: { essential: true },
      cell: ({ row }) => (
        <span className="font-semibold text-sm font-mono">{row.original.invoiceNumber}</span>
      ),
    },
    {
      accessorKey: 'workOrderId',
      header: 'Work Order',
      meta: { essential: false },
      cell: ({ row }) => {
        const workOrderDisplayId = row.original.workOrderId 
          ? workOrderLookup.get(row.original.workOrderId) 
          : null;
        return (
          <span className="text-sm text-gray-900 font-mono">
            {workOrderDisplayId || 'N/A'}
          </span>
        );
      },
    },
    {
      accessorKey: 'clientName',
      header: 'Client',
      meta: { essential: false },
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.clientName}</span>
      ),
    },
    {
      id: 'dates',
      header: 'Dates',
      meta: { headerAlign: 'center', essential: false },
      cell: ({ row }) => {
        const issueDate = format(new Date(row.original.issueDate), 'MMM dd, yyyy');
        const dueDate = format(new Date(row.original.dueDate), 'MMM dd, yyyy');
        return (
          <div className="text-sm text-center">
            <div className="text-gray-900 font-medium">{issueDate}</div>
            <div className="text-gray-500 text-xs">Due: {dueDate}</div>
          </div>
        );
      },
    },
    {
      id: 'daysOverdue',
      header: 'Overdue',
      meta: { headerAlign: 'center', essential: false },
      cell: ({ row }) => {
        const invoice = row.original;
        if (invoice.status === 'overdue' || (invoice.status !== 'paid' && new Date(invoice.dueDate) < new Date())) {
          const dueDate = new Date(invoice.dueDate);
          const today = new Date();
          const diffTime = today.getTime() - dueDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > 0) {
            return (
              <span className="text-sm font-medium text-red-600">
                {diffDays} day{diffDays !== 1 ? 's' : ''}
              </span>
            );
          }
        }
        return <span className="text-sm text-gray-400">—</span>;
      },
    },
    {
      accessorKey: 'total',
      header: 'Amount',
      meta: { essential: false },
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {currency(row.original.total).format()}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { headerAlign: 'center', essential: true },
      cell: ({ row }) => {
        const status = row.original.status;
        const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending', label: string }> = {
          'paid': { type: 'success', label: 'Paid' },
          'approved': { type: 'success', label: 'Approved' },
          'sent': { type: 'info', label: 'Sent' },
          'viewed': { type: 'info', label: 'Viewed' },
          'draft': { type: 'pending', label: 'Draft' },
          'overdue': { type: 'error', label: 'Overdue' },
          'disputed': { type: 'warning', label: 'Disputed' },
          'cancelled': { type: 'error', label: 'Cancelled' },
        };
        const mapped = statusMap[status] || { type: 'pending' as const, label: status };
        return <div className="flex justify-center"><StatusBadge status={mapped.type} label={mapped.label} /></div>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      meta: { essential: true },
      cell: ({ row }) => {
        const invoice = row.original;
        const canEdit = invoice.status === 'draft' || invoice.status === 'sent' || invoice.status === 'viewed';
        const canSend = invoice.status === 'draft' || invoice.status === 'sent';
        const canDownload = invoice.status !== 'draft';

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8">
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            {canEdit && (
              <Button variant="ghost" size="sm" className="h-8">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
            {canDownload && (
              <Button variant="ghost" size="sm" className="h-8">
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            )}
            {canSend && invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
              <Button variant="ghost" size="sm" className="h-8">
                <Send className="w-4 h-4 mr-1" />
                Send
              </Button>
            )}
          </div>
        );
      },
    },
  ], [workOrderLookup]);

  // Filter configuration
  const filterConfig: FilterGroup[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'sent', label: 'Sent' },
        { value: 'viewed', label: 'Viewed' },
        { value: 'approved', label: 'Approved' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'disputed', label: 'Disputed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    {
      id: 'client',
      label: 'Client',
      type: 'checkbox',
      searchable: true,
      options: clientNames.map(name => ({ value: name, label: name })),
    },
  ];

  // Count active filters for badge
  const activeFilterCount = useMemo(() => {
    let count = Object.values(filters).reduce((acc, value) => {
      if (Array.isArray(value)) {
        return acc + value.length;
      }
      return acc + (value ? 1 : 0);
    }, 0);
    
    if (issueDateRange?.from) count += 1;
    if (dueDateRange?.from) count += 1;
    if (amountRange?.min !== null || amountRange?.max !== null) count += 1;
    
    return count;
  }, [filters, issueDateRange, dueDateRange, amountRange]);

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-4 lg:space-y-6 bg-gray-50 min-h-screen">
      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => handleStatCardClick('all')} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStatCardClick('all');
            }
          }}
          className="cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg h-full"
          role="button"
          tabIndex={0}
          aria-label="Filter by all invoices"
        >
          <StatCard
            title="Total Invoices"
            value={summaryStats.total.toString()}
            icon={FileText}
          />
        </div>
        <div 
          onClick={() => handleStatCardClick('paid')} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStatCardClick('paid');
            }
          }}
          className="cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg h-full"
          role="button"
          tabIndex={0}
          aria-label="Filter by paid invoices"
        >
          <StatCard
            title="Paid Amount"
            value={currency(summaryStats.paidAmount).format()}
            change={`${summaryStats.paid} paid`}
            icon={Tag}
          />
        </div>
        <div 
          onClick={() => handleStatCardClick('pending')} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStatCardClick('pending');
            }
          }}
          className="cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg h-full"
          role="button"
          tabIndex={0}
          aria-label="Filter by pending invoices"
        >
          <StatCard
            title="Pending Amount"
            value={currency(summaryStats.pendingAmount).format()}
            change={`${summaryStats.pending} pending`}
            icon={Clock}
          />
        </div>
        <div 
          onClick={() => handleStatCardClick('overdue')} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStatCardClick('overdue');
            }
          }}
          className="cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg h-full"
          role="button"
          tabIndex={0}
          aria-label="Filter by overdue invoices"
        >
          <StatCard
            title="Overdue Amount"
            value={currency(summaryStats.overdueAmount).format()}
            change={`${summaryStats.overdue} overdue`}
            trend={summaryStats.overdue > 0 ? "down" : "neutral"}
            icon={AlertCircle}
          />
        </div>
      </div>


      {/* Filter System - Mobile */}
      <div className="lg:hidden">
        <FilterSystem
          filters={filterConfig}
          filterValues={filters}
          onFilterChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={filteredData.length}
          totalCount={invoices.length}
          searchPlaceholder="Search invoices by number, client name, work order..."
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block space-y-4 lg:space-y-6">
          <div className="space-y-3">
            <FilterSystem
              filters={filterConfig}
              filterValues={filters}
              onFilterChange={setFilters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              resultCount={filteredData.length}
              totalCount={invoices.length}
              searchPlaceholder="Search invoices by number, client name, work order..."
              showSearchBar={true}
              showFilterBar={true}
            />
          </div>

          <Card>
            <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Invoices
                <Badge variant="warning" className="bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-100">
                  {filteredData.length}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterPanelOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
                <ExportButton
                  data={filteredData}
                  filename="invoices"
                />
                {tableInstance && (
                  <ColumnVisibilityToggle table={tableInstance} />
                )}
              </div>
            </div>
            </CardHeader>
            <CardContent>
              {filteredData.length > 0 ? (
                <DataTable
                  data={filteredData}
                  columns={columns}
                  pagination
                  pageSize={10}
                  searchable={false}
                  storageKey="invoices"
                  onTableReady={handleTableReady}
                />
              ) : (
                <EmptyState
                  title="No invoices found"
                  description="Try adjusting your search or filters"
                  variant="no-results"
                />
              )}
            </CardContent>
          </Card>
      </div>

      {/* Mobile Data Table */}
      <div className="lg:hidden mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Invoices ({filteredData.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredData.length > 0 ? (
              <DataTable
                data={filteredData}
                columns={columns}
                pagination
                pageSize={10}
                searchable={false}
              />
            ) : (
              <EmptyState
                title="No invoices found"
                description="Try adjusting your search or filters"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Slide-in Filter Panel */}
      <FilterPanelSlideIn
        filters={filterConfig}
        filterValues={filters}
        onFilterChange={setFilters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={filteredData.length}
        totalCount={invoices.length}
        searchPlaceholder="Search invoices by number, client name, work order..."
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        issueDateRange={issueDateRange}
        onIssueDateRangeChange={setIssueDateRange}
        dueDateRange={dueDateRange}
        onDueDateRangeChange={setDueDateRange}
        amountRange={amountRange}
        onAmountRangeChange={setAmountRange}
        amountStats={amountStats}
      />
    </div>
  );
}

