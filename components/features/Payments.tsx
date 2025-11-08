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
  OutstandingInvoiceCard,
  type FilterGroup,
  type TableAction,
  useTableInstance,
  useFilterOptions,
  useNumericRangeStats,
  useTableFilters,
  usePagination,
} from '../shared';
import { 
  Tag, 
  CreditCard,
  TrendingUp,
  AlertCircle,
  Building2,
  Wallet,
  Filter,
  FileText,
  Eye
} from 'lucide-react';
import { payments, invoices, type Payment, type Invoice } from '../../data';
import { ColumnDef } from '@tanstack/react-table';
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';
import currency from 'currency.js';
import { DateRange } from '../shared';
import {
  PieChart,
  Pie,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';


// Utility to get CSS variable value
const getCSSVariable = (variable: string, fallback: string): string => {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
};

export function Payments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [outstandingInvoicesPage, setOutstandingInvoicesPage] = useState(0);
  const [outstandingInvoicesPerPage, setOutstandingInvoicesPerPage] = useState(5);
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: [],
    paymentMethod: [],
    client: [],
  });
  const [paymentDateRange, setPaymentDateRange] = useState<DateRange | undefined>();
  const [amountRange, setAmountRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Get theme colors from CSS variables
  const primaryColor = useMemo(() => getCSSVariable('--primary', '#f7d604'), []);
  const gold300 = useMemo(() => getCSSVariable('--gold-300', '#fcd34d'), []);
  const gold600 = useMemo(() => getCSSVariable('--gold-600', '#b39902'), []);
  const gold700 = useMemo(() => getCSSVariable('--gold-700', '#8a7602'), []);
  const gray400 = useMemo(() => getCSSVariable('--gray-400', '#9ca3af'), []);
  const gray500 = useMemo(() => getCSSVariable('--gray-500', '#6b7280'), []);
  const gray600 = useMemo(() => getCSSVariable('--gray-600', '#4b5563'), []);
  const gray700 = useMemo(() => getCSSVariable('--gray-700', '#374151'), []);

  // Use custom hooks
  const { tableInstance, handleTableReady } = useTableInstance();

  // Get filter options with counts
  const { options: filterOptionsData, counts: filterCounts } = useFilterOptions(payments, {
    status: (p) => p.status,
    paymentMethod: (p) => p.paymentMethod,
    client: (p) => p.clientName,
  });

  // Get amount range stats
  const amountStats = useNumericRangeStats(payments, (p) => p.amount);

  // Filter data using useTableFilters hook
  const filteredData = useTableFilters({
    data: payments,
    searchQuery,
    filters,
    dateRanges: {
      paymentDate: paymentDateRange,
    },
    numericRanges: {
      amount: amountRange,
    },
    searchFields: (p) => [
      p.paymentId,
      p.invoiceNumber,
      p.clientName,
      p.referenceNumber || '',
    ].filter(Boolean),
    filterFields: {
      status: (p) => p.status,
      paymentMethod: (p) => p.paymentMethod,
      client: (p) => p.clientName,
    },
    dateFields: {
      paymentDate: (p) => p.paymentDate,
    },
    numericFields: {
      amount: (p) => p.amount,
    },
  });

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

  // Outstanding balances - includes all unpaid invoices (including overdue), sorted by due date ascending
  const outstandingBalances = useMemo(() => {
    return invoices
      .filter((inv: Invoice) => {
        // Include all unpaid invoices (including overdue ones)
        return inv.status !== 'paid' && inv.status !== 'cancelled';
      })
      .sort((a: Invoice, b: Invoice) => {
        // Sort by due date ascending (earliest first)
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }, []);

  // Use pagination hook for outstanding balances
  const outstandingPagination = usePagination(outstandingBalances, {
    itemsPerPage: outstandingInvoicesPerPage,
    initialPage: outstandingInvoicesPage,
  });

  // Sync pagination state
  useEffect(() => {
    setOutstandingInvoicesPage(outstandingPagination.page);
  }, [outstandingPagination.page]);

  useEffect(() => {
    setOutstandingInvoicesPerPage(outstandingPagination.itemsPerPage);
  }, [outstandingPagination.itemsPerPage]);

  const displayedOutstandingBalances = outstandingPagination.paginatedData;

  // Chart 1: Payment Methods Distribution (RadialBarChart)
  const paymentMethodsData = useMemo(() => {
    const methodCounts: Record<string, { count: number; amount: number }> = {};
    
    payments.forEach((p: Payment) => {
      if (p.status === 'completed') {
        const method = p.paymentMethod;
        if (!methodCounts[method]) {
          methodCounts[method] = { count: 0, amount: 0 };
        }
        methodCounts[method].count++;
        methodCounts[method].amount += p.amount;
      }
    });

    const methodLabels: Record<string, string> = {
      'credit-card': 'Credit Card',
      'ach': 'ACH',
      'wire': 'Wire Transfer',
      'check': 'Check',
      'cash': 'Cash',
      'other': 'Other'
    };

    return Object.entries(methodCounts)
      .map(([method, data]) => ({
        name: methodLabels[method] || method,
        value: data.count,
        amount: data.amount,
        fill: method === 'credit-card' ? primaryColor :
              method === 'ach' ? gold600 :
              method === 'wire' ? gold700 :
              method === 'check' ? gray600 :
              method === 'cash' ? gray500 :
              gray400
      }))
      .sort((a, b) => b.value - a.value);
  }, [primaryColor, gold600, gold700, gray600, gray500, gray400]);

  // Chart 2: Payment Status Over Time (ComposedChart - Last 7 days)
  const paymentStatusOverTimeData = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = subDays(now, 6);
    const days = eachDayOfInterval({
      start: startOfDay(sevenDaysAgo),
      end: endOfDay(now),
    });

    return days.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      
      const completed = payments
        .filter(p => {
          const paymentDate = new Date(p.paymentDate);
          return p.status === 'completed' &&
                 paymentDate >= dayStart &&
                 paymentDate <= dayEnd;
        })
        .reduce((sum, p) => sum + p.amount, 0);

      const pending = payments
        .filter(p => {
          const paymentDate = new Date(p.paymentDate);
          return p.status === 'pending' &&
                 paymentDate >= dayStart &&
                 paymentDate <= dayEnd;
        })
        .reduce((sum, p) => sum + p.amount, 0);

      const failed = payments
        .filter(p => {
          const paymentDate = new Date(p.paymentDate);
          return p.status === 'failed' &&
                 paymentDate >= dayStart &&
                 paymentDate <= dayEnd;
        }).length;

      return {
        date: format(day, 'MMM dd'),
        completed,
        pending,
        failed,
        total: completed + pending
      };
    });
  }, []);

  // Chart 3: Top Clients by Revenue (Horizontal Bar Chart)
  const topClientsData = useMemo(() => {
    const clientRevenue: Record<string, number> = {};
    
    payments
      .filter((p: Payment) => p.status === 'completed')
      .forEach((p: Payment) => {
        if (!clientRevenue[p.clientName]) {
          clientRevenue[p.clientName] = 0;
        }
        clientRevenue[p.clientName] += p.amount;
      });

    return Object.entries(clientRevenue)
      .map(([name, revenue]) => ({
        name: name.length > 20 ? name.substring(0, 20) + '...' : name,
        fullName: name,
        revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        fill: index === 0 ? primaryColor :
              index === 1 ? gold600 :
              index === 2 ? gold700 :
              index === 3 ? gray600 :
              gray500
      }));
  }, [primaryColor, gold600, gold700, gray600, gray500]);


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
      meta: { essential: true },
      cell: ({ row }) => (
        <span className="font-semibold text-sm font-mono">{row.original.paymentId}</span>
      ),
    },
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice #',
      meta: { essential: false },
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 font-mono">{row.original.invoiceNumber}</span>
      ),
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
      accessorKey: 'paymentDate',
      header: 'Payment Date',
      meta: { headerAlign: 'center', cellAlign: 'center', essential: false },
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {format(new Date(row.original.paymentDate), 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      meta: { headerAlign: 'center', cellAlign: 'center', essential: false },
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {currency(row.original.amount).format()}
        </span>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Method',
      meta: { essential: false },
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
      meta: { essential: false },
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 font-mono">
          {row.original.referenceNumber || '—'}
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
          'completed': { type: 'success', label: 'Completed' },
          'pending': { type: 'pending', label: 'Pending' },
          'failed': { type: 'error', label: 'Failed' },
          'refunded': { type: 'warning', label: 'Refunded' },
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
        const primaryAction: TableAction = {
          label: 'View',
          icon: Eye,
          onClick: () => {
            console.log('View payment:', row.original.paymentId);
          },
        };

        return <TableActions primaryAction={primaryAction} />;
      },
    },
  ], []);

  // Build filter configuration using hook data
  const filterOptions = useMemo(() => ({
    clients: filterOptionsData.client || [],
    statusCounts: filterCounts.status || {},
    methodCounts: filterCounts.paymentMethod || {},
    clientCounts: filterCounts.client || {},
  }), [filterOptionsData, filterCounts]);

  // Filter configuration with dynamic counts
  const filterConfig: FilterGroup[] = useMemo(() => [
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'pending', label: 'Pending', count: filterOptions.statusCounts['pending'] || 0 },
        { value: 'completed', label: 'Completed', count: filterOptions.statusCounts['completed'] || 0 },
        { value: 'failed', label: 'Failed', count: filterOptions.statusCounts['failed'] || 0 },
        { value: 'refunded', label: 'Refunded', count: filterOptions.statusCounts['refunded'] || 0 },
        { value: 'cancelled', label: 'Cancelled', count: filterOptions.statusCounts['cancelled'] || 0 },
      ],
    },
    {
      id: 'paymentMethod',
      label: 'Payment Method',
      type: 'checkbox',
      searchable: true,
      options: [
        { value: 'check', label: 'Check', count: filterOptions.methodCounts['check'] || 0 },
        { value: 'ach', label: 'ACH', count: filterOptions.methodCounts['ach'] || 0 },
        { value: 'wire', label: 'Wire Transfer', count: filterOptions.methodCounts['wire'] || 0 },
        { value: 'credit-card', label: 'Credit Card', count: filterOptions.methodCounts['credit-card'] || 0 },
        { value: 'cash', label: 'Cash', count: filterOptions.methodCounts['cash'] || 0 },
        { value: 'other', label: 'Other', count: filterOptions.methodCounts['other'] || 0 },
      ],
    },
    {
      id: 'client',
      label: 'Client',
      type: 'checkbox',
      searchable: true,
      options: filterOptions.clients.map(client => ({
        value: client,
        label: client,
        count: filterOptions.clientCounts[client] || 0,
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
    
    if (paymentDateRange?.from) count += 1;
    if (amountRange?.min !== null || amountRange?.max !== null) count += 1;
    
    return count;
  }, [filters, paymentDateRange, amountRange]);

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-4 lg:space-y-6 bg-gray-50 min-h-screen">
      {/* Welcome Message */}
      <div className="mb-2">
        <p className="text-sm text-gray-600 font-medium leading-relaxed">Monitor payment transactions, track revenue, and manage financial records for your business.</p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Received"
          value={currency(financialSummary.totalReceived).format()}
          icon={Tag}
          tooltip="Total amount of payments received across all time."
        />
        <StatCard
          title="Pending Payments"
          value={currency(financialSummary.pendingPayments).format()}
          icon={CreditCard}
          tooltip="Payments currently being processed or awaiting confirmation."
        />
        <StatCard
          title="Outstanding Invoices"
          value={currency(financialSummary.outstandingInvoices).format()}
          icon={AlertCircle}
          tooltip="Total amount of invoices that have not yet been paid."
        />
        <StatCard
          title="This Month"
          value={currency(financialSummary.thisMonth).format()}
          change="Current month"
          trend="up"
          icon={TrendingUp}
          tooltip="Total revenue received during the current calendar month."
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart 1: Payment Methods Distribution (Pie Chart - Donut) */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-display font-semibold text-gray-900 tracking-tight">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={paymentMethodsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={false}
                    >
                      {paymentMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string, props: any) => [
                        `${value} payments (${currency(props.payload.amount).format()})`,
                        name
                      ]}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '8px 12px' }}
                      labelFormatter={(label) => `Method: ${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-shrink-0 w-48 pl-6">
                <div className="space-y-3">
                  {paymentMethodsData.map((entry, index) => {
                    const total = paymentMethodsData.reduce((sum, item) => sum + item.value, 0);
                    const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(0) : '0';
                    return (
                      <div key={index} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: entry.fill }}
                          />
                          <span className="text-sm text-gray-600 font-medium truncate">{entry.name}</span>
                        </div>
                        <span className="text-sm text-gray-900 font-semibold flex-shrink-0">
                          {entry.value} ({percentage}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Payment Status Over Time (ComposedChart) */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-display font-semibold text-gray-900 tracking-tight">Payment Status (7 Days)</CardTitle>
              <div className="text-xs px-3 py-1.5 bg-primary/10 text-gray-600 rounded-full font-display font-semibold">
                Total: <span className="text-gray-900">{currency(paymentStatusOverTimeData.reduce((sum, d) => sum + d.completed + d.pending, 0)).format()}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={paymentStatusOverTimeData} margin={{ top: 8, right: 45, left: -10, bottom: -5 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.35}/>
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gold300} stopOpacity={0.35}/>
                    <stop offset="95%" stopColor={gold300} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 500 }}
                  tickMargin={4}
                  axisLine={false}
                  tickLine={false}
                  height={30}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickMargin={6}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickMargin={6}
                  label={{ value: 'Failed Count', angle: -90, position: 'insideRight', fill: gray700, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'failed') {
                      return [value, 'Failed Count'];
                    }
                    return [`$${value.toLocaleString()}`, name === 'completed' ? 'Completed' : name === 'pending' ? 'Pending' : 'Total'];
                  }}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '8px 12px' }}
                  cursor={{ stroke: primaryColor, strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', color: gray700, paddingTop: '8px' }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar 
                  yAxisId="left" 
                  dataKey="completed" 
                  fill="url(#colorCompleted)" 
                  radius={[4, 4, 0, 0]} 
                  name="Completed"
                  label={{ position: 'top', fill: gray700, fontSize: 10, formatter: (value: number) => value > 0 ? `$${(value / 1000).toFixed(1)}k` : '' }}
                />
                <Bar 
                  yAxisId="left" 
                  dataKey="pending" 
                  fill="url(#colorPending)" 
                  radius={[4, 4, 0, 0]} 
                  name="Pending"
                  label={{ position: 'top', fill: gray700, fontSize: 10, formatter: (value: number) => value > 0 ? `$${(value / 1000).toFixed(1)}k` : '' }}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="failed" 
                  stroke={gray600} 
                  strokeWidth={2.5}
                  dot={{ fill: gray600, r: 4, strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 6, fill: gray600, stroke: 'white', strokeWidth: 2 }}
                  name="Failed Count"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 3: Top Clients by Revenue (Horizontal Bar Chart) */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-display font-semibold text-gray-900 tracking-tight">Top Clients by Revenue</CardTitle>
              <div className="text-xs px-3 py-1.5 bg-primary/10 text-gray-600 rounded-full font-display font-semibold">
                Top <span className="text-gray-900">5</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={topClientsData}
                layout="vertical"
                margin={{ top: 5, right: 50, left: 8, bottom: -5 }}
              >
                <defs>
                  {topClientsData.map((entry, index) => (
                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={entry.fill} stopOpacity={0.9}/>
                      <stop offset="100%" stopColor={entry.fill} stopOpacity={0.6}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 500 }}
                  tickMargin={4}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  axisLine={false}
                  tickLine={false}
                  height={30}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 500 }}
                  tickMargin={8}
                  width={80}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '8px 12px' }}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Bar 
                  dataKey="revenue" 
                  radius={[0, 6, 6, 0]}
                  label={{ 
                    position: 'right', 
                    fill: gray700, 
                    fontSize: 12, 
                    fontWeight: 600,
                    formatter: (value: number) => `$${(value / 1000).toFixed(1)}k`
                  }}
                >
                  {topClientsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Invoices Section */}
      {displayedOutstandingBalances.length > 0 && (
        <div className="space-y-4">
          {/* Enhanced Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-red-50/80 via-red-50/50 to-transparent rounded-xl border border-red-200/60 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-red-100/80 shadow-sm">
                <AlertCircle className="w-5 h-5 text-red-700" />
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-2xl font-display font-semibold text-gray-900 tracking-tight">
                    Outstanding Invoices
                  </h2>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">
                    Invoices requiring payment
                  </p>
                </div>
                <Badge variant="destructive" className="font-semibold shadow-sm min-w-[28px] justify-center">
                  {outstandingBalances.length}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Enhanced Card Container */}
          <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-4 lg:p-5">
              <div className="space-y-3 lg:space-y-4">
                {displayedOutstandingBalances.map((inv: Invoice) => (
                  <OutstandingInvoiceCard
                    key={inv.id}
                    invoice={inv}
                    onSendReminder={() => console.log('Send reminder for:', inv.invoiceNumber)}
                  />
                ))}
              </div>
              {outstandingBalances.length > outstandingPagination.itemsPerPage && (
                <InboxPagination
                  currentPage={outstandingPagination.page}
                  totalPages={outstandingPagination.totalPages}
                  itemsPerPage={outstandingPagination.itemsPerPage}
                  totalItems={outstandingPagination.totalItems}
                  onPageChange={outstandingPagination.setPage}
                  onItemsPerPageChange={(newItemsPerPage) => {
                    outstandingPagination.setItemsPerPage(newItemsPerPage);
                    outstandingPagination.setPage(0);
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
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
              <CardTitle className="flex items-center gap-2 text-lg font-display font-semibold text-gray-900 tracking-tight">
                Payment History
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
                  filename="payments"
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
                  storageKey="payments"
                  onTableReady={handleTableReady}
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

