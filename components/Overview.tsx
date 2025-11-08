import { useMemo, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from './ui';
import { 
  StatCard, 
  Timeline,
  InboxWorkOrderCard,
  InboxPagination,
  useNavigation,
  DateRangePicker,
  type DateRange,
} from './shared';
import { 
  Wrench, 
  Tag, 
  FileText, 
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  MessageSquare,
  ClipboardCheck,
  Wallet,
  Receipt,
  Calendar
} from 'lucide-react';
import { 
  metrics, 
  workOrders, 
  activities, 
  payments,
  type WorkOrder,
  type Activity
} from '../data';
import { 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

// Utility to get CSS variable value
const getCSSVariable = (variable: string, fallback: string): string => {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
};

export function Overview() {
  const { navigate } = useNavigation();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  // Get theme colors from CSS variables - Yellow/Gold shades and Grey shades only
  const primaryColor = useMemo(() => getCSSVariable('--primary', '#f7d604'), []);
  const gold300 = useMemo(() => getCSSVariable('--gold-300', '#fcd34d'), []);
  const gold600 = useMemo(() => getCSSVariable('--gold-600', '#b39902'), []);
  const gold700 = useMemo(() => getCSSVariable('--gold-700', '#8a7602'), []);
  const gray400 = useMemo(() => getCSSVariable('--gray-400', '#9ca3af'), []);
  const gray500 = useMemo(() => getCSSVariable('--gray-500', '#6b7280'), []);
  const gray600 = useMemo(() => getCSSVariable('--gray-600', '#4b5563'), []);
  const gray700 = useMemo(() => getCSSVariable('--gray-700', '#374151'), []);

  // Pagination state for urgent work orders
  const [urgentWorkOrdersPage, setUrgentWorkOrdersPage] = useState(0);
  const [urgentWorkOrdersPerPage, setUrgentWorkOrdersPerPage] = useState(5);

  // Get total count of urgent work orders
  const totalUrgentWorkOrders = useMemo(() => {
    return workOrders.filter((wo: WorkOrder) => wo.priority === 'urgent' || wo.priority === 'high').length;
  }, []);

  // Get all urgent work orders
  const allUrgentWorkOrders = useMemo(() => {
    return workOrders.filter((wo: WorkOrder) => wo.priority === 'urgent' || wo.priority === 'high');
  }, []);

  // Get paginated urgent work orders
  const paginatedUrgentWorkOrders = useMemo(() => {
    const start = urgentWorkOrdersPage * urgentWorkOrdersPerPage;
    const end = start + urgentWorkOrdersPerPage;
    return {
      items: allUrgentWorkOrders.slice(start, end),
      totalPages: Math.ceil(allUrgentWorkOrders.length / urgentWorkOrdersPerPage),
      totalItems: allUrgentWorkOrders.length,
    };
  }, [allUrgentWorkOrders, urgentWorkOrdersPage, urgentWorkOrdersPerPage]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setUrgentWorkOrdersPage(page);
  }, []);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((itemsPerPage: number) => {
    setUrgentWorkOrdersPerPage(itemsPerPage);
    setUrgentWorkOrdersPage(0);
  }, []);

  // Timeline state for load more
  const [timelineItemsToShow, setTimelineItemsToShow] = useState(10);
  const timelineItemsPerLoad = 10;

  // Format all activities for timeline with appropriate icons
  const allTimelineItems = useMemo(() => {
    return activities.map((activity: Activity) => {
      let icon: typeof CheckCircle2 | undefined;
      let status: 'success' | 'warning' | 'error' | 'info' = 'info';
      
      if (activity.type.includes('work-order')) {
        icon = activity.type.includes('completed') ? ClipboardCheck : Wrench;
        status = activity.type.includes('completed') ? 'success' : 
                 activity.type.includes('urgent') ? 'error' : 'info';
      } else if (activity.type.includes('invoice')) {
        icon = Receipt;
        status = activity.type.includes('paid') ? 'success' :
                 activity.type.includes('overdue') ? 'error' : 'info';
      } else if (activity.type.includes('payment')) {
        icon = Wallet;
        status = 'success';
      } else if (activity.type.includes('bid')) {
        icon = Briefcase;
        status = activity.type.includes('accepted') ? 'success' :
                 activity.type.includes('rejected') ? 'error' : 'warning';
      } else if (activity.type.includes('ticket')) {
        icon = MessageSquare;
        status = activity.type.includes('resolved') ? 'success' : 'info';
      }
      
      return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      timestamp: activity.timestamp,
        icon,
        status,
      };
    });
  }, []);

  // Get displayed timeline items
  const timelineItems = useMemo(() => {
    return allTimelineItems.slice(0, timelineItemsToShow);
  }, [allTimelineItems, timelineItemsToShow]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    setTimelineItemsToShow(prev => Math.min(prev + timelineItemsPerLoad, allTimelineItems.length));
  }, [allTimelineItems.length]);

  const hasMoreTimelineItems = timelineItemsToShow < allTimelineItems.length;

  // Chart 1: Work Orders by Status (Pie Chart)
  const workOrdersByStatusData = useMemo(() => {
    const statusCounts: Record<string, number> = {
      'Pending': 0,
      'Assigned': 0,
      'In Progress': 0,
      'Completed': 0,
      'Cancelled': 0,
    };

    workOrders.forEach((wo: WorkOrder) => {
      const statusMap: Record<string, string> = {
        'pending': 'Pending',
        'assigned': 'Assigned',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled',
      };
      const statusLabel = statusMap[wo.status] || 'Pending';
      statusCounts[statusLabel]++;
    });

    return Object.entries(statusCounts)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, []);

  // Status colors using yellow/gold and grey shades
  const statusColors = useMemo(() => {
    return {
      'Pending': gray500,        // Medium grey
      'Assigned': gold300,       // Light yellow
      'In Progress': primaryColor, // Primary yellow
      'Completed': gray700,      // Dark grey
      'Cancelled': gray400,      // Light grey
    };
  }, [gray500, gold300, primaryColor, gray700, gray400]);

  // Chart 2: Monthly Revenue Trend (Area Chart) - Last 6 months
  const monthlyRevenueChartData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    const months = eachMonthOfInterval({
      start: startOfMonth(sixMonthsAgo),
      end: endOfMonth(now),
    });

    const data = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthRevenue = payments
        .filter(p => {
          const paymentDate = new Date(p.paymentDate);
          return p.status === 'completed' &&
                 paymentDate >= monthStart &&
                 paymentDate <= monthEnd;
        })
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        month: format(month, 'MMM yyyy'),
        revenue: monthRevenue,
      };
    });

    // Calculate average revenue
    const avgRevenue = data.reduce((sum, item) => sum + item.revenue, 0) / data.length;

    return { data, avgRevenue };
  }, []);

  // Chart 3: Work Orders by Priority (Bar Chart)
  const workOrdersByPriorityData = useMemo(() => {
    const priorityCounts: Record<string, number> = {
      'Urgent': 0,
      'High': 0,
      'Medium': 0,
      'Low': 0,
    };

    workOrders.forEach((wo: WorkOrder) => {
      const priorityLabel = wo.priority.charAt(0).toUpperCase() + wo.priority.slice(1);
      if (priorityCounts.hasOwnProperty(priorityLabel)) {
        priorityCounts[priorityLabel]++;
      }
    });

    return Object.entries(priorityCounts)
      .map(([name, value]) => ({ 
        name, 
        value,
        color: name === 'Urgent' ? gold700 :  // Darkest yellow for urgent
               name === 'High' ? gold600 :     // Dark yellow for high
               name === 'Medium' ? primaryColor : // Primary yellow for medium
               gray600                         // Dark grey for low
      }))
      .sort((a, b) => {
        const order = { 'Urgent': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        return (order[a.name as keyof typeof order] ?? 99) - (order[b.name as keyof typeof order] ?? 99);
      });
  }, [gold700, gold600, primaryColor, gray600]);

  // Calculate revenue percentage change from last month
  const revenueChange = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthEarnings = payments
      .filter(p => {
        const paymentDate = new Date(p.paymentDate);
        return p.status === 'completed' && 
               paymentDate.getMonth() === currentMonth &&
               paymentDate.getFullYear() === currentYear;
      })
      .reduce((sum, p) => sum + p.amount, 0);

    const lastMonthEarnings = payments
      .filter(p => {
        const paymentDate = new Date(p.paymentDate);
        return p.status === 'completed' && 
               paymentDate.getMonth() === lastMonth &&
               paymentDate.getFullYear() === lastMonthYear;
      })
      .reduce((sum, p) => sum + p.amount, 0);

    if (lastMonthEarnings === 0) return null;
    const change = ((currentMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100;
    return Math.round(change);
  }, []);

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-4 lg:space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section with Date Range Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium leading-relaxed">Monitor your service operations, track performance metrics, and stay on top of urgent work orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">Date Range:</span>
          </div>
          <DateRangePicker
            onDateRangeChange={setDateRange}
            value={dateRange}
            placeholder="Select date range"
            className="w-[280px]"
          />
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Active Work Orders"
          value={metrics.activeWorkOrders}
          change={`${metrics.pendingWorkOrders} pending`}
          trend="up"
          icon={Wrench}
          tooltip="Work orders currently in progress, including pending, assigned, or active statuses."
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${metrics.monthlyEarnings.toLocaleString()}`}
          change={revenueChange !== null 
            ? `${revenueChange >= 0 ? '+' : ''}${revenueChange}% from last month`
            : 'No previous data'}
          trend={revenueChange !== null ? (revenueChange >= 0 ? "up" : "down") : "neutral"}
          icon={Tag}
          tooltip="Total revenue this month from completed work orders and paid invoices."
        />
        <StatCard
          title="Outstanding Invoices"
          value={`$${metrics.outstandingInvoices.toLocaleString()}`}
          change={`${metrics.overdueInvoices} overdue`}
          trend={metrics.overdueInvoices > 0 ? "down" : "neutral"}
          icon={FileText}
          tooltip="Total amount of unpaid invoices across all statuses."
        />
        <StatCard
          title="Completion Rate"
          value={`${metrics.completionRate}%`}
          change={`On-time: ${metrics.onTimeCompletionRate}%`}
          trend="up"
          icon={TrendingUp}
          tooltip="Percentage of work orders completed successfully, including on-time completions."
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart 1: Work Orders by Status (Pie Chart) */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-display font-semibold text-gray-900 tracking-tight">Work Orders by Status</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={workOrdersByStatusData}
                  cx="38%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={75}
                  innerRadius={25}
                  fill={gray500}
                  dataKey="value"
                  label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                >
                  {workOrdersByStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[entry.name as keyof typeof statusColors] || primaryColor} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value} work orders`, name]}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '8px 12px' }}
                  labelFormatter={(label) => `Status: ${label}`}
                />
                <Legend 
                  verticalAlign="middle" 
                  align="right"
                  layout="vertical"
                  formatter={(value) => {
                    const dataEntry = workOrdersByStatusData.find(d => d.name === value);
                    return `${value} (${dataEntry?.value || 0})`;
                  }}
                  wrapperStyle={{ 
                    fontSize: '12px', 
                    color: gray700,
                    paddingLeft: '16px',
                    lineHeight: '22px'
                  }}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Monthly Revenue Trend (Area Chart) */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-display font-semibold text-gray-900 tracking-tight">Monthly Revenue Trend</CardTitle>
              <div className="text-xs px-3 py-1.5 bg-primary/10 text-gray-600 rounded-full font-display font-semibold">
                Avg: <span className="text-gray-900">${Math.round(monthlyRevenueChartData.avgRevenue).toLocaleString()}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyRevenueChartData.data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.35}/>
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 500 }}
                  tickMargin={6}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickMargin={6}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '8px 12px' }}
                  cursor={{ stroke: primaryColor, strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <ReferenceLine 
                  y={monthlyRevenueChartData.avgRevenue} 
                  stroke={gray600} 
                  strokeWidth={1.5}
                  strokeDasharray="5 5" 
                  label={{ 
                    value: 'Avg', 
                    position: 'right', 
                    fill: gray700, 
                    fontSize: 11,
                    fontWeight: 600,
                    offset: 3
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={primaryColor}
                  strokeWidth={2.5}
                  fill="url(#colorRevenue)"
                  dot={{ fill: primaryColor, r: 2.5, strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 5, fill: primaryColor, stroke: 'white', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 3: Work Orders by Priority (Bar Chart) */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-display font-semibold text-gray-900 tracking-tight">Work Orders by Priority</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={workOrdersByPriorityData} margin={{ top: 5, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
                  tickMargin={6}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickMargin={6}
                  hide
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value} work orders`, 'Count']}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '8px 12px' }}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  labelFormatter={(label) => `Priority: ${label}`}
                />
                <Bar 
                  dataKey="value" 
                  radius={[6, 6, 0, 0]}
                  label={{ 
                    position: 'top', 
                    fill: gray700, 
                    fontSize: 11,
                    fontWeight: 600,
                    formatter: (value: number) => value > 0 ? value : '',
                    offset: 4
                  }}
                >
                  {workOrdersByPriorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Work Orders and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        {/* Urgent Work Orders */}
        <Card className="overflow-hidden border-l-4 border-l-yellow-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="bg-gradient-to-r from-yellow-50 via-yellow-50/90 to-yellow-100/50 border-b border-yellow-200">
            <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-display font-semibold text-gray-900 tracking-tight">
                  <div className="p-1.5 rounded-lg bg-yellow-200/50">
                    <AlertTriangle className="w-5 h-5 text-yellow-700" />
                  </div>
                  <span>Urgent Work Orders</span>
                  <Badge variant="warning" className="bg-yellow-500 text-gray-900 border-yellow-600 hover:bg-yellow-600 font-bold shadow-md hover:shadow-lg">
                    {totalUrgentWorkOrders}
                  </Badge>
            </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('work-orders')}
                className="text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-yellow-200/70 hover:shadow-sm"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </div>
              <p className="text-sm text-gray-600 mt-2 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-600 animate-pulse"></span>
                Immediate attention required
              </p>
          </CardHeader>
          </div>
          <CardContent className="pt-4">
            {paginatedUrgentWorkOrders.items.length > 0 ? (
              <div className="space-y-4" style={{ maxHeight: '750px', display: 'flex', flexDirection: 'column' }}>
                <div className="space-y-3 overflow-y-auto pr-2 flex-1" style={{ minHeight: 0 }}>
                  {paginatedUrgentWorkOrders.items.map((wo: WorkOrder) => (
                    <InboxWorkOrderCard
                      key={wo.id}
                      workOrder={wo}
                      onViewDetails={() => console.log('Navigate to work order:', wo.id)}
                    />
                  ))}
                </div>
                {/* Pagination Controls */}
                <div className="flex-shrink-0">
                  <InboxPagination
                    currentPage={urgentWorkOrdersPage}
                    totalPages={paginatedUrgentWorkOrders.totalPages}
                    itemsPerPage={urgentWorkOrdersPerPage}
                    totalItems={paginatedUrgentWorkOrders.totalItems}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 text-center py-8 font-medium">No urgent work orders</p>
            )}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-50/50 via-blue-50/30 to-transparent border-b border-gray-100">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-200/50">
                <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-lg font-display font-semibold text-gray-900 tracking-tight">
                  Recent Activity
                </span>
              </div>
              <Badge variant="info" className="font-semibold">
                {timelineItems.length}
              </Badge>
            </CardTitle>
            <p className="text-xs text-gray-600 mt-2 ml-12 font-medium">
              Latest updates and events
            </p>
          </CardHeader>
          <CardContent className="pt-4 px-4">
            <div className="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ maxHeight: '680px' }}>
              <Timeline items={timelineItems} />
              {hasMoreTimelineItems && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoadMore}
                    className="w-full hover:bg-primary hover:text-gray-900 hover:border-primary transition-all duration-200 font-medium hover:shadow-sm"
                  >
                    Load More ({allTimelineItems.length - timelineItemsToShow} remaining)
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

