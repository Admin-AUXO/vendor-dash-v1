import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '../ui';
import { 
  StatCard, 
  FilterSystem,
  FilterPanelSlideIn,
  DataTable,
  StatusBadge,
  ExportButton,
  EmptyState,
  ColumnVisibilityToggle,
  TableActions,
  InboxPagination,
  InvoiceCard,
  PostSubmissionInvoiceCard,
  type FilterGroup,
  type TableAction,
  useTableInstance,
  useWorkOrderLookup,
  useFilterOptions,
  useNumericRangeStats,
  useTableFilters,
} from '../shared';
import { 
  FileText, 
  Tag, 
  Clock, 
  AlertCircle,
  Edit,
  Download,
  Send,
  Eye,
  Filter,
  Plus,
  Mail
} from 'lucide-react';
import { invoices, type Invoice } from '../../data';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import currency from 'currency.js';
import { DateRange } from '../shared';


export function Invoice() {
  const [searchQuery, setSearchQuery] = useState('');
  const [preSubmissionPage, setPreSubmissionPage] = useState(0);
  const [preSubmissionPerPage, setPreSubmissionPerPage] = useState(5);
  const [postSubmissionPage, setPostSubmissionPage] = useState(0);
  const [postSubmissionPerPage, setPostSubmissionPerPage] = useState(5);
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: [],
    client: [],
  });
  const [issueDateRange, setIssueDateRange] = useState<DateRange | undefined>();
  const [dueDateRange, setDueDateRange] = useState<DateRange | undefined>();
  const [amountRange, setAmountRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Use custom hooks for common patterns
  const { tableInstance, handleTableReady } = useTableInstance();
  const workOrderLookup = useWorkOrderLookup();

  // Get filter options with counts
  const { options: filterOptionsData, counts: filterCounts } = useFilterOptions(invoices, {
    status: (inv) => inv.status,
    client: (inv) => inv.clientName,
  });

  // Get amount range stats
  const amountStats = useNumericRangeStats(invoices, (inv) => inv.total);
  
  const filterOptions = useMemo(() => ({
    clients: filterOptionsData.client || [],
    statusCounts: filterCounts.status || {},
    clientCounts: filterCounts.client || {},
  }), [filterOptionsData, filterCounts]);

  // Filter data using useTableFilters hook
  const filteredData = useTableFilters({
    data: invoices,
    searchQuery,
    filters,
    dateRanges: {
      issueDate: issueDateRange,
      dueDate: dueDateRange,
    },
    numericRanges: {
      amount: amountRange,
    },
    searchFields: (inv) => {
      const workOrderDisplayId = inv.workOrderId ? workOrderLookup.get(inv.workOrderId) : null;
      return [
        inv.invoiceNumber,
        inv.clientName,
        workOrderDisplayId || '',
      ].filter(Boolean);
    },
    filterFields: {
      status: (inv) => inv.status,
      client: (inv) => inv.clientName,
    },
    dateFields: {
      issueDate: (inv) => inv.issueDate,
      dueDate: (inv) => inv.dueDate,
    },
    numericFields: {
      amount: (inv) => inv.total,
    },
  });

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

  // Separate invoices into pre-submission and post-submission
  const preSubmissionInvoices = useMemo(() => {
    return invoices.filter((inv: Invoice) => inv.status === 'draft');
  }, []);

  // Post-submission: only sent/viewed (follow-up emails), excluding overdue (moved to Payments page)
  const postSubmissionInvoices = useMemo(() => {
    return invoices.filter((inv: Invoice) => 
      ['sent', 'viewed'].includes(inv.status)
    );
  }, []);

  // Paginate pre-submission invoices
  const displayedPreSubmissionInvoices = useMemo(() => {
    const start = preSubmissionPage * preSubmissionPerPage;
    const end = start + preSubmissionPerPage;
    return preSubmissionInvoices.slice(start, end);
  }, [preSubmissionInvoices, preSubmissionPage, preSubmissionPerPage]);

  const preSubmissionTotalPages = Math.ceil(preSubmissionInvoices.length / preSubmissionPerPage);

  // Paginate post-submission invoices
  const displayedPostSubmissionInvoices = useMemo(() => {
    const start = postSubmissionPage * postSubmissionPerPage;
    const end = start + postSubmissionPerPage;
    return postSubmissionInvoices.slice(start, end);
  }, [postSubmissionInvoices, postSubmissionPage, postSubmissionPerPage]);

  const postSubmissionTotalPages = Math.ceil(postSubmissionInvoices.length / postSubmissionPerPage);

  // Reset pages when data changes
  useEffect(() => {
    const preSubmissionTotalPages = Math.ceil(preSubmissionInvoices.length / preSubmissionPerPage);
    if (preSubmissionTotalPages > 0 && preSubmissionPage >= preSubmissionTotalPages) {
      setPreSubmissionPage(Math.max(0, preSubmissionTotalPages - 1));
    }
  }, [preSubmissionInvoices.length, preSubmissionPerPage, preSubmissionPage]);

  useEffect(() => {
    const postSubmissionTotalPages = Math.ceil(postSubmissionInvoices.length / postSubmissionPerPage);
    if (postSubmissionTotalPages > 0 && postSubmissionPage >= postSubmissionTotalPages) {
      setPostSubmissionPage(Math.max(0, postSubmissionTotalPages - 1));
    }
  }, [postSubmissionInvoices.length, postSubmissionPerPage, postSubmissionPage]);



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
      meta: { headerAlign: 'center', cellAlign: 'center', essential: false },
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
      meta: { headerAlign: 'center', cellAlign: 'center', essential: false },
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
      meta: { essential: true, headerAlign: 'center', cellAlign: 'center' },
      cell: ({ row }) => {
        const invoice = row.original;
        const canEdit = invoice.status === 'draft' || invoice.status === 'sent' || invoice.status === 'viewed';
        const canSend = invoice.status === 'draft' || invoice.status === 'sent';
        const canDownload = invoice.status !== 'draft';

        const primaryAction: TableAction = {
          label: 'View',
          icon: Eye,
          onClick: () => {
            // Handle view action
            console.log('View invoice:', invoice.invoiceNumber);
          },
        };

        const secondaryActions: TableAction[] = [];
        
        if (canEdit) {
          secondaryActions.push({
            label: 'Edit',
            icon: Edit,
            onClick: () => {
              console.log('Edit invoice:', invoice.invoiceNumber);
            },
          });
        }

        if (canDownload) {
          secondaryActions.push({
            label: 'Download',
            icon: Download,
            onClick: () => {
              console.log('Download invoice:', invoice.invoiceNumber);
            },
          });
        }

        if (canSend && invoice.status !== 'paid' && invoice.status !== 'cancelled') {
          secondaryActions.push({
            label: 'Send',
            icon: Send,
            onClick: () => {
              console.log('Send invoice:', invoice.invoiceNumber);
            },
          });
        }

        return <TableActions primaryAction={primaryAction} secondaryActions={secondaryActions} />;
      },
    },
  ], [workOrderLookup]);

  // Filter configuration with dynamic counts
  const filterConfig: FilterGroup[] = useMemo(() => [
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'draft', label: 'Draft', count: filterOptions.statusCounts['draft'] || 0 },
        { value: 'sent', label: 'Sent', count: filterOptions.statusCounts['sent'] || 0 },
        { value: 'viewed', label: 'Viewed', count: filterOptions.statusCounts['viewed'] || 0 },
        { value: 'approved', label: 'Approved', count: filterOptions.statusCounts['approved'] || 0 },
        { value: 'paid', label: 'Paid', count: filterOptions.statusCounts['paid'] || 0 },
        { value: 'overdue', label: 'Overdue', count: filterOptions.statusCounts['overdue'] || 0 },
        { value: 'disputed', label: 'Disputed', count: filterOptions.statusCounts['disputed'] || 0 },
        { value: 'cancelled', label: 'Cancelled', count: filterOptions.statusCounts['cancelled'] || 0 },
      ],
    },
    {
      id: 'client',
      label: 'Client',
      type: 'checkbox',
      searchable: true,
      options: filterOptions.clients.map(name => ({
        value: name,
        label: name,
        count: filterOptions.clientCounts[name] || 0,
      })),
    },
  ], [filterOptions]);

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
      {/* Welcome Message */}
      <div className="mb-2">
        <p className="text-sm text-gray-600 font-medium leading-relaxed">Track invoices, monitor payment status, and manage billing for your service operations.</p>
      </div>

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
            tooltip="Total count of all invoices across all statuses. Click to view all."
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
            tooltip="Total amount received from paid invoices. Click to filter by paid invoices."
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
            tooltip="Total amount of invoices awaiting payment. Click to filter by pending invoices."
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
            tooltip="Total amount of invoices past their due date. Click to filter by overdue invoices."
          />
        </div>
      </div>

      {/* Pre-Submission and Post-Submission Invoices */}
      <div className="space-y-6 lg:space-y-8">
        {/* Pre-Submission Invoices Section */}
        <div className="space-y-4">
          {/* Enhanced Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-yellow-50/80 via-yellow-50/50 to-transparent rounded-xl border border-yellow-200/60 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-yellow-100/80 shadow-sm">
                <FileText className="w-5 h-5 text-yellow-700" />
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-2xl font-display font-semibold text-gray-900 tracking-tight">
                    Pre-Submission Invoices
                  </h2>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">
                    Draft invoices ready to be sent
                  </p>
                </div>
                <Badge variant="warning" className="font-semibold shadow-sm min-w-[28px] justify-center">
                {preSubmissionInvoices.length}
              </Badge>
            </div>
            </div>
            <Button 
              size="sm" 
              variant="default"
              className="bg-primary hover:bg-primary-hover text-gray-900 font-semibold shadow-md hover:shadow-lg border-primary hover:border-primary/20 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Draft
            </Button>
          </div>
          
          {/* Enhanced Card Container */}
          <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-4 lg:p-5">
              {preSubmissionInvoices.length > 0 ? (
                <>
                  <div className="space-y-3 lg:space-y-4">
                    {displayedPreSubmissionInvoices.map((invoice: Invoice) => (
                      <InvoiceCard
                        key={invoice.id}
                        invoice={invoice}
                        onViewDetails={() => console.log('View invoice:', invoice.invoiceNumber)}
                        onAction={() => console.log('Send invoice:', invoice.invoiceNumber)}
                        actionLabel="Send Invoice"
                        actionVariant="default"
                      />
                    ))}
                  </div>
                  {preSubmissionInvoices.length > preSubmissionPerPage && (
                    <InboxPagination
                      currentPage={preSubmissionPage}
                      totalPages={preSubmissionTotalPages}
                      itemsPerPage={preSubmissionPerPage}
                      totalItems={preSubmissionInvoices.length}
                      onPageChange={setPreSubmissionPage}
                      onItemsPerPageChange={(newItemsPerPage) => {
                        setPreSubmissionPerPage(newItemsPerPage);
                        setPreSubmissionPage(0);
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="py-8 lg:py-12">
                  <EmptyState
                    title="No pre-submission invoices"
                    description="Draft invoices ready to be sent will appear here. Create your first draft to get started."
                    variant="empty"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Post-Submission Invoices Section */}
        <div className="space-y-4">
          {/* Enhanced Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50/80 via-blue-50/50 to-transparent rounded-xl border border-blue-200/60 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-100/80 shadow-sm">
                <Mail className="w-5 h-5 text-blue-700" />
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-2xl font-display font-semibold text-gray-900 tracking-tight">
                    Post-Submission Invoices
                  </h2>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">
                    Sent invoices awaiting client response
                  </p>
                </div>
                <Badge variant="info" className="font-semibold shadow-sm min-w-[28px] justify-center">
              {postSubmissionInvoices.length}
            </Badge>
          </div>
            </div>
          </div>
          
          {/* Enhanced Card Container */}
          <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-4 lg:p-5">
              {postSubmissionInvoices.length > 0 ? (
                <>
                  <div className="space-y-3 lg:space-y-4">
                    {displayedPostSubmissionInvoices.map((invoice: Invoice) => (
                      <PostSubmissionInvoiceCard
                        key={invoice.id}
                        invoice={invoice}
                        onViewDetails={() => console.log('View invoice:', invoice.invoiceNumber)}
                        onAction={() => console.log('Follow up:', invoice.invoiceNumber)}
                        actionLabel="Follow Up"
                        actionVariant="default"
                      />
                    ))}
                  </div>
                  {postSubmissionInvoices.length > postSubmissionPerPage && (
                    <InboxPagination
                      currentPage={postSubmissionPage}
                      totalPages={postSubmissionTotalPages}
                      itemsPerPage={postSubmissionPerPage}
                      totalItems={postSubmissionInvoices.length}
                      onPageChange={setPostSubmissionPage}
                      onItemsPerPageChange={(newItemsPerPage) => {
                        setPostSubmissionPerPage(newItemsPerPage);
                        setPostSubmissionPage(0);
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="py-8 lg:py-12">
                  <EmptyState
                    title="No post-submission invoices"
                    description="Invoices that have been sent and are awaiting client response will appear here."
                    variant="empty"
                  />
                </div>
              )}
            </CardContent>
          </Card>
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
              <CardTitle className="flex items-center gap-2 text-lg font-display font-semibold text-gray-900 tracking-tight">
                All Invoices
                <Badge variant="warning" className="font-semibold">
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

