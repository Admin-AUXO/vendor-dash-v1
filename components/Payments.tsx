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
  TableActions,
  type FilterGroup,
  type TableAction,
} from './shared';
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
import { payments, invoices, workOrders, type Payment, type Invoice } from '../data';
import { ColumnDef } from '@tanstack/react-table';
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';
import currency from 'currency.js';
import { DateRange } from 'react-day-picker';
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
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: [],
    paymentMethod: [],
    client: [],
  });
  const [paymentDateRange, setPaymentDateRange] = useState<DateRange | undefined>();
  const [amountRange, setAmountRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [tableInstance, setTableInstance] = useState<any>(null);

  // Get theme colors from CSS variables
  const primaryColor = useMemo(() => getCSSVariable('--primary', '#f7d604'), []);
  const gold300 = useMemo(() => getCSSVariable('--gold-300', '#fcd34d'), []);
  const gold600 = useMemo(() => getCSSVariable('--gold-600', '#b39902'), []);
  const gold700 = useMemo(() => getCSSVariable('--gold-700', '#8a7602'), []);
  const gray400 = useMemo(() => getCSSVariable('--gray-400', '#9ca3af'), []);
  const gray500 = useMemo(() => getCSSVariable('--gray-500', '#6b7280'), []);
  const gray600 = useMemo(() => getCSSVariable('--gray-600', '#4b5563'), []);
  const gray700 = useMemo(() => getCSSVariable('--gray-700', '#374151'), []);

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
    if (filters.client && Array.isArray(filters.client) && filters.client.length > 0) {
      data = data.filter((p: Payment) => filters.client.includes(p.clientName));
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

  // Display all outstanding balances without scrollbar
  const displayedOutstandingBalances = outstandingBalances;

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

  // Get filter options with counts
  const filterOptions = useMemo(() => {
    const clients = Array.from(new Set(payments.map(p => p.clientName))).sort();
    
    const statusCounts = payments.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const methodCounts = payments.reduce((acc, p) => {
      acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const clientCounts = payments.reduce((acc, p) => {
      acc[p.clientName] = (acc[p.clientName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      clients,
      statusCounts,
      methodCounts,
      clientCounts,
    };
  }, []);

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
        <p className="text-sm text-gray-600">Monitor payment transactions, track revenue, and manage financial records for your business.</p>
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
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={paymentMethodsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
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
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      labelFormatter={(label) => `Method: ${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-shrink-0 w-48 pl-6">
                <div className="space-y-3">
                  {paymentMethodsData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: entry.fill }}
                        />
                        <span className="text-sm text-gray-700 font-medium truncate">{entry.name}</span>
                      </div>
                      <span className="text-sm text-gray-900 font-bold flex-shrink-0">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Payment Status Over Time (ComposedChart) */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Payment Status (7 Days)</CardTitle>
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-gray-900">
                  Total: {currency(paymentStatusOverTimeData.reduce((sum, d) => sum + d.completed + d.pending, 0)).format()}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={paymentStatusOverTimeData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0.3}/>
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gold300} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={gold300} stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickMargin={8}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickMargin={8}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickMargin={8}
                  label={{ value: 'Failed Count', angle: -90, position: 'insideRight', fill: gray700, fontSize: 11 }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'failed') {
                      return [value, 'Failed Count'];
                    }
                    return [`$${value.toLocaleString()}`, name === 'completed' ? 'Completed' : name === 'pending' ? 'Pending' : 'Total'];
                  }}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  cursor={{ stroke: primaryColor, strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', color: gray700, paddingTop: '10px' }}
                  iconType="circle"
                  iconSize={10}
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
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Top Clients by Revenue</CardTitle>
              <div className="text-xs text-gray-600">
                Top <span className="font-semibold text-gray-900">5</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={topClientsData}
                layout="vertical"
                margin={{ top: 10, right: 60, left: 100, bottom: 5 }}
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
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickMargin={8}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
                  tickMargin={8}
                  width={95}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
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

      {/* Outstanding Balances - Table Format */}
      {displayedOutstandingBalances.length > 0 && (
        <Card>
          <div className="bg-red-100 border-b border-red-300 rounded-t-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="w-5 h-5 text-red-700" />
                  <span className="text-gray-900">Outstanding Balances</span>
                  <Badge variant="warning" className="bg-red-200 text-red-800 border-red-400 hover:bg-red-200">
                    {outstandingBalances.length}
                  </Badge>
                </CardTitle>
              </div>
              <p className="text-sm text-gray-700 mt-1">Invoices requiring payment</p>
            </CardHeader>
          </div>
          <CardContent className="p-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-center py-2 px-2 font-medium text-gray-700">Invoice #</th>
                    <th className="text-center py-2 px-2 font-medium text-gray-700">Client</th>
                    <th className="text-center py-2 px-2 font-medium text-gray-700">Invoice Date</th>
                    <th className="text-center py-2 px-2 font-medium text-gray-700">Due Date</th>
                    <th className="text-center py-2 px-2 font-medium text-gray-700">Days Overdue</th>
                    <th className="text-center py-2 px-2 font-medium text-gray-700">Work Order</th>
                    <th className="text-center py-2 px-2 font-medium text-gray-700">Amount</th>
                    <th className="text-center py-2 px-2 font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOutstandingBalances.map((inv: Invoice) => {
                    // Calculate days overdue for any unpaid invoice past due date
                    const today = new Date();
                    const dueDate = new Date(inv.dueDate);
                    const daysOverdue = inv.status !== 'paid' && dueDate < today
                      ? Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
                      : 0;
                    
                    return (
                      <tr
                        key={inv.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-2 px-2 text-center">
                          <span className="font-semibold font-mono">{inv.invoiceNumber}</span>
                        </td>
                        <td className="py-2 px-2 text-center text-gray-900">{inv.clientName}</td>
                        <td className="py-2 px-2 text-center text-gray-600">
                          {format(new Date(inv.issueDate), 'MMM dd, yyyy')}
                        </td>
                        <td className="py-2 px-2 text-center text-gray-600">
                          {format(new Date(inv.dueDate), 'MMM dd, yyyy')}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {daysOverdue > 0 ? (
                            <span className="text-red-600 font-semibold">{daysOverdue} days</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {inv.workOrderId ? (
                            <span className="font-mono text-gray-900">{workOrderLookup.get(inv.workOrderId) || inv.workOrderId}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-center font-semibold text-gray-900">
                          {currency(inv.total).format()}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-3 bg-red-600 hover:bg-red-700 text-white border-red-600"
                          >
                            Send Reminder
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
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
              <CardTitle className="flex items-center gap-2">
                Payment History
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

