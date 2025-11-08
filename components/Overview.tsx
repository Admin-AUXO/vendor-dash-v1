import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from './ui';
import { 
  StatCard, 
  Timeline,
  WorkOrderCard,
  useNavigation,
} from './shared';
import { 
  ClipboardList, 
  Tag, 
  FileText, 
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  metrics, 
  workOrders, 
  activities, 
  weeklyRevenueData, 
  serviceDistributionData,
  type WorkOrder,
  type Activity
} from '../data';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';

// Utility to get CSS variable value
const getCSSVariable = (variable: string, fallback: string): string => {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
};

export function Overview() {
  const { navigate } = useNavigation();
  
  // Get primary color from CSS variables
  const primaryColor = useMemo(() => getCSSVariable('--primary', '#f7d604'), []);

  // Get total count of urgent work orders
  const totalUrgentWorkOrders = useMemo(() => {
    return workOrders.filter((wo: WorkOrder) => wo.priority === 'urgent' || wo.priority === 'high').length;
  }, []);

  // Get urgent work orders - increase from 5 to 7 cards
  const urgentWorkOrders = useMemo(() => {
    return workOrders
      .filter((wo: WorkOrder) => wo.priority === 'urgent' || wo.priority === 'high')
      .slice(0, 7);
  }, []);

  // Format activities for timeline
  const timelineItems = useMemo(() => {
    return activities
      .slice(0, 10)
      .map((activity: Activity) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        timestamp: activity.timestamp,
        status: activity.type.includes('completed') || activity.type.includes('paid') ? 'success' as const :
                activity.type.includes('urgent') || activity.type.includes('overdue') ? 'error' as const :
                activity.type.includes('pending') || activity.type.includes('created') ? 'warning' as const :
                'info' as const,
      }));
  }, []);

  // Format revenue data for chart with average
  const revenueChartData = useMemo(() => {
    const data = weeklyRevenueData.map((item: { date: string; value: number }) => ({
      date: format(new Date(item.date), 'MMM dd'),
      revenue: item.value,
    }));
    const avg = data.reduce((sum, item) => sum + item.revenue, 0) / data.length;
    return { data, avg };
  }, []);

  // Format service distribution for bar chart
  const serviceChartData = useMemo(() => {
    return serviceDistributionData
      .map((item: { label: string; value: number }) => ({
        name: item.label,
        value: item.value,
      }))
      .sort((a, b) => b.value - a.value);
  }, []);

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-4 lg:space-y-6 bg-gray-50 min-h-screen">

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Active Work Orders"
          value={metrics.activeWorkOrders}
          change={`${metrics.pendingWorkOrders} pending`}
          trend="up"
          icon={ClipboardList}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${metrics.monthlyEarnings.toLocaleString()}`}
          change="+12% from last month"
          trend="up"
          icon={Tag}
        />
        <StatCard
          title="Outstanding Invoices"
          value={`$${metrics.outstandingInvoices.toLocaleString()}`}
          change={`${metrics.overdueInvoices} overdue`}
          trend={metrics.overdueInvoices > 0 ? "down" : "neutral"}
          icon={FileText}
        />
        <StatCard
          title="Completion Rate"
          value={`${metrics.completionRate}%`}
          change="On-time: 92%"
          trend="up"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Revenue Chart */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Weekly Revenue</CardTitle>
              <div className="text-sm text-gray-600">
                Avg: <span className="font-semibold text-gray-900">${Math.round(revenueChartData.avg).toLocaleString()}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={revenueChartData.data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickMargin={8}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickMargin={8}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  cursor={{ stroke: primaryColor, strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <ReferenceLine 
                  y={revenueChartData.avg} 
                  stroke="#9ca3af" 
                  strokeDasharray="5 5" 
                  label={{ value: 'Avg', position: 'right', fill: '#6b7280', fontSize: 12 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={primaryColor}
                  strokeWidth={2.5}
                  dot={{ fill: primaryColor, r: 4 }}
                  activeDot={{ r: 7, fill: primaryColor, stroke: '#fff', strokeWidth: 2 }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Distribution Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Service Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={serviceChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickMargin={8}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickMargin={8}
                />
                <Tooltip 
                  formatter={(value: number) => [value, 'Count']}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill={primaryColor}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Work Orders and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        {/* Urgent Work Orders */}
        <Card>
          <div className="bg-yellow-100 border-b border-yellow-300 rounded-t-xl">
            <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-700" />
                  <span className="text-gray-900">Urgent Work Orders</span>
                  <Badge variant="warning" className="bg-yellow-200 text-yellow-800 border-yellow-400 hover:bg-yellow-200">
                    {totalUrgentWorkOrders}
                  </Badge>
            </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('work-orders')}
                  className="text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-200"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
              <p className="text-sm text-gray-700 mt-1">Immediate attention required</p>
          </CardHeader>
          </div>
          <CardContent className="pt-4">
            {urgentWorkOrders.length > 0 ? (
                <div className="space-y-3">
                  {urgentWorkOrders.map((wo: WorkOrder) => (
                    <WorkOrderCard
                      key={wo.id}
                      workOrder={wo}
                      onClick={() => console.log('Navigate to work order:', wo.id)}
                    />
                  ))}
                </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No urgent work orders</p>
            )}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: 'var(--info)' }} />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline items={timelineItems} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

