import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from './ui';
import { 
  StatCard, 
  FilterSystem,
  FilterPanelSlideIn,
  DataTable,
  StatusBadge,
  ExportButton,
  EmptyState,
  type FilterGroup,
} from './shared';
import { 
  DollarSign, 
  CreditCard,
  TrendingUp,
  AlertCircle,
  Building2,
  Wallet,
  ArrowRight,
  Filter,
  FileText
} from 'lucide-react';
import { payments, invoices, type Payment, type Invoice } from '../data';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import currency from 'currency.js';
import { DateRange } from 'react-day-picker';
import { useNavigation } from './shared/NavigationContext';


export function Payments() {
  const { navigate } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: [],
    paymentMethod: [],
  });
  const [paymentDateRange, setPaymentDateRange] = useState<DateRange | undefined>();
  const [amountRange, setAmountRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Get min and max amounts for range filter
  const amountStats = useMemo(() => {
    const amounts = payments.map(p => p.amount);
    return {
      min: Math.min(...amounts),
      max: Math.max(...amounts),
    };
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    let data = payments;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (p: Payment) =>
          p.paymentId.toLowerCase().includes(query) ||
          p.invoiceNumber.toLowerCase().includes(query) ||
          p.clientName.toLowerCase().includes(query) ||
          (p.referenceNumber && p.referenceNumber.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      data = data.filter((p: Payment) => filters.status.includes(p.status));
    }
    if (filters.paymentMethod && Array.isArray(filters.paymentMethod) && filters.paymentMethod.length > 0) {
      data = data.filter((p: Payment) => filters.paymentMethod.includes(p.paymentMethod));
    }

    // Apply date range filter
    if (paymentDateRange?.from) {
      data = data.filter((p: Payment) => {
        const paymentDate = new Date(p.paymentDate);
        const from = paymentDateRange.from!;
        const to = paymentDateRange.to || paymentDateRange.from!;
        return paymentDate >= from && paymentDate <= to;
      });
    }

    // Apply amount range filter
    if (amountRange.min !== null || amountRange.max !== null) {
      data = data.filter((p: Payment) => {
        const amount = p.amount;
        const min = amountRange.min ?? -Infinity;
        const max = amountRange.max ?? Infinity;
        return amount >= min && amount <= max;
      });
    }

    return data;
  }, [searchQuery, filters, paymentDateRange, amountRange]);

  // Calculate financial summary
  const financialSummary = useMemo(() => {
    const totalReceived = payments
      .filter((p: Payment) => p.status === 'completed')
      .reduce((sum: number, p: Payment) => sum + p.amount, 0);
    const pendingPayments = payments
      .filter((p: Payment) => p.status === 'pending')
      .reduce((sum: number, p: Payment) => sum + p.amount, 0);
    const outstandingInvoices = invoices
      .filter((inv: Invoice) => inv.status !== 'paid' && inv.status !== 'cancelled')
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);
    const thisMonth = payments
      .filter((p: Payment) => {
        const paymentDate = new Date(p.paymentDate);
        const now = new Date();
        return p.status === 'completed' && 
               paymentDate.getMonth() === now.getMonth() &&
               paymentDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum: number, p: Payment) => sum + p.amount, 0);

    return { totalReceived, pendingPayments, outstandingInvoices, thisMonth };
  }, []);

  // Outstanding balances
  const outstandingBalances = useMemo(() => {
    return invoices
      .filter((inv: Invoice) => inv.status !== 'paid' && inv.status !== 'cancelled')
      .sort((a: Invoice, b: Invoice) => {
        const aOverdue = a.status === 'overdue' ? 1 : 0;
        const bOverdue = b.status === 'overdue' ? 1 : 0;
        if (aOverdue !== bOverdue) return bOverdue - aOverdue;
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      });
  }, []);

  const displayedOutstandingBalances = outstandingBalances.slice(0, 5);
  const hasMoreOutstanding = outstandingBalances.length > 5;


  // Payment method icon mapping
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit-card':
        return CreditCard;
      case 'check':
        return FileText;
      case 'ach':
        return Building2;
      case 'wire':
        return Building2;
      case 'cash':
        return Wallet;
      default:
        return CreditCard;
    }
  };

  // Define columns
  const columns: ColumnDef<Payment>[] = useMemo(() => [
    {
      accessorKey: 'paymentId',
      header: 'Payment ID',
      cell: ({ row }) => (
        <span className="font-semibold text-sm font-mono">{row.original.paymentId}</span>
      ),
    },
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice #',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 font-mono">{row.original.invoiceNumber}</span>
      ),
    },
    {
      accessorKey: 'clientName',
      header: 'Client',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.clientName}</span>
      ),
    },
    {
      accessorKey: 'paymentDate',
      header: 'Payment Date',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {format(new Date(row.original.paymentDate), 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {currency(row.original.amount).format()}
        </span>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Method',
      cell: ({ row }) => {
        const Icon = getPaymentMethodIcon(row.original.paymentMethod);
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-900 capitalize">
              {row.original.paymentMethod.replace('-', ' ')}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'referenceNumber',
      header: 'Reference #',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 font-mono">
          {row.original.referenceNumber || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending', label: string }> = {
          'completed': { type: 'success', label: 'Completed' },
          'pending': { type: 'pending', label: 'Pending' },
          'failed': { type: 'error', label: 'Failed' },
          'refunded': { type: 'warning', label: 'Refunded' },
          'cancelled': { type: 'error', label: 'Cancelled' },
        };
        const mapped = statusMap[status] || { type: 'pending' as const, label: status };
        return <StatusBadge status={mapped.type} label={mapped.label} />;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            View
          </Button>
        </div>
      ),
    },
  ], []);

  // Filter configuration
  const filterConfig: FilterGroup[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
        { value: 'failed', label: 'Failed' },
        { value: 'refunded', label: 'Refunded' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    {
      id: 'paymentMethod',
      label: 'Payment Method',
      type: 'checkbox',
      searchable: true,
      options: [
        { value: 'check', label: 'Check' },
        { value: 'ach', label: 'ACH' },
        { value: 'wire', label: 'Wire Transfer' },
        { value: 'credit-card', label: 'Credit Card' },
        { value: 'cash', label: 'Cash' },
        { value: 'other', label: 'Other' },
      ],
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
    
    if (paymentDateRange?.from) count += 1;
    if (amountRange?.min !== null || amountRange?.max !== null) count += 1;
    
    return count;
  }, [filters, paymentDateRange, amountRange]);

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-4 lg:space-y-6 bg-gray-50 min-h-screen">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Received"
          value={currency(financialSummary.totalReceived).format()}
          icon={DollarSign}
        />
        <StatCard
          title="Pending Payments"
          value={currency(financialSummary.pendingPayments).format()}
          icon={CreditCard}
        />
        <StatCard
          title="Outstanding Invoices"
          value={currency(financialSummary.outstandingInvoices).format()}
          icon={AlertCircle}
        />
        <StatCard
          title="This Month"
          value={currency(financialSummary.thisMonth).format()}
          change="Current month"
          trend="up"
          icon={TrendingUp}
        />
      </div>


      {/* Outstanding Balances - Table Format */}
      {displayedOutstandingBalances.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                Outstanding Balances
              </CardTitle>
              {hasMoreOutstanding && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('invoice')}
                  className="text-sm"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium text-gray-700">Invoice #</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-700">Client</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-700">Due Date</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-700">Status</th>
                    <th className="text-right py-2 px-2 font-medium text-gray-700">Amount</th>
                    <th className="text-right py-2 px-2 font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOutstandingBalances.map((inv: Invoice) => (
                    <tr
                      key={inv.id}
                      className="border-b hover:bg-gray-50"
                      style={inv.status === 'overdue' ? {
                        backgroundColor: 'var(--status-error-light)'
                      } : {}}
                    >
                      <td className="py-2 px-2">
                        <span className="font-semibold font-mono">{inv.invoiceNumber}</span>
                      </td>
                      <td className="py-2 px-2 text-gray-900">{inv.clientName}</td>
                      <td className="py-2 px-2 text-gray-600">
                        {format(new Date(inv.dueDate), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-2 px-2">
                        <StatusBadge 
                          status={
                            inv.status === 'paid' ? 'success' :
                            inv.status === 'overdue' ? 'error' :
                            inv.status === 'approved' ? 'success' :
                            inv.status === 'sent' || inv.status === 'viewed' ? 'info' :
                            'pending'
                          }
                          label={inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                        />
                      </td>
                      <td className="py-2 px-2 text-right font-semibold text-gray-900">
                        {currency(inv.total).format()}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <Button variant="ghost" size="sm" className="h-8">
                          Send Reminder
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter System - Mobile */}
      <div className="lg:hidden">
        <FilterSystem
          filters={filterConfig}
          filterValues={filters}
          onFilterChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={filteredData.length}
          totalCount={payments.length}
          searchPlaceholder="Search payments by ID, invoice number, client name..."
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
              totalCount={payments.length}
              searchPlaceholder="Search payments by ID, invoice number, client name..."
              showSearchBar={true}
              showFilterBar={true}
            />
          </div>

          <Card>
            <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payment History ({filteredData.length})</CardTitle>
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
                  filename="payments"
                />
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
                />
              ) : (
                <EmptyState
                  title="No payments found"
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
            <CardTitle>Payment History ({filteredData.length})</CardTitle>
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
                title="No payments found"
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
        totalCount={payments.length}
        searchPlaceholder="Search payments by ID, invoice number, client name..."
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        paymentDateRange={paymentDateRange}
        onPaymentDateRangeChange={setPaymentDateRange}
        amountRange={amountRange}
        onAmountRangeChange={setAmountRange}
        amountStats={amountStats}
      />
    </div>
  );
}

