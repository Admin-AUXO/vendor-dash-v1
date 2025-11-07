import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DollarSign, TrendingUp, Calendar, Clock, ArrowUpRight, Settings, Download, FileText } from 'lucide-react';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { StatCard, PageHeader, SectionTitle, ActionButton } from './shared';

export function Payments() {
  const stats = [
    {
      title: 'Total Revenue (YTD)',
      value: '$187,450',
      change: '+24.5% from last year',
      icon: DollarSign
    },
    {
      title: 'This Month',
      value: '$42,580',
      change: '+12.5% from last month',
      icon: TrendingUp
    },
    {
      title: 'Pending Payments',
      value: '$23,680',
      change: '34 invoices awaiting',
      icon: Clock
    },
    {
      title: 'Avg. Payment Time',
      value: '8.5 days',
      change: '-1.2 days improvement',
      icon: Calendar
    }
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 18500, target: 16000 },
    { month: 'Feb', revenue: 21200, target: 18000 },
    { month: 'Mar', revenue: 19800, target: 19000 },
    { month: 'Apr', revenue: 24500, target: 20000 },
    { month: 'May', revenue: 22900, target: 21000 },
    { month: 'Jun', revenue: 28400, target: 23000 },
    { month: 'Jul', revenue: 31200, target: 25000 },
    { month: 'Aug', revenue: 29500, target: 26000 },
    { month: 'Sep', revenue: 33100, target: 28000 },
    { month: 'Oct', revenue: 35800, target: 30000 }
  ];

  const paymentMethods = [
    { method: 'ACH Transfer', count: 45, percentage: 52, color: '#FBBF24' },
    { method: 'Check', count: 28, percentage: 32, color: '#3B82F6' },
    { method: 'Wire Transfer', count: 12, percentage: 14, color: '#10B981' },
    { method: 'Credit Card', count: 2, percentage: 2, color: '#EF4444' }
  ];

  const weeklyPayments = [
    { day: 'Mon', amount: 5200 },
    { day: 'Tue', amount: 6800 },
    { day: 'Wed', amount: 5900 },
    { day: 'Thu', amount: 7200 },
    { day: 'Fri', amount: 8100 },
    { day: 'Sat', amount: 4200 },
    { day: 'Sun', amount: 3800 }
  ];

  const remittances = [
    {
      id: 'REM-1001',
      invoice: 'INV-2145',
      client: 'Green Property Management',
      amount: 850.00,
      method: 'ACH Transfer',
      submitted: '2025-01-06',
      processed: '2025-01-07',
      status: 'Processed',
      reference: 'ACH-20250107-001'
    },
    {
      id: 'REM-1002',
      invoice: 'INV-2142',
      client: 'Summit Rentals',
      amount: 680.00,
      method: 'Check',
      submitted: '2025-01-04',
      processed: '2025-01-05',
      status: 'Processed',
      reference: 'CHK-20250105-002'
    },
    {
      id: 'REM-1003',
      invoice: 'INV-2138',
      client: 'Metro Realty Group',
      amount: 1450.00,
      method: 'Wire Transfer',
      submitted: '2025-01-03',
      processed: '2025-01-04',
      status: 'Processed',
      reference: 'WIR-20250104-003'
    },
    {
      id: 'REM-1004',
      invoice: 'INV-2144',
      client: 'Metro Realty Group',
      amount: 1250.00,
      method: 'ACH Transfer',
      submitted: '2025-01-08',
      processed: null,
      status: 'Pending',
      reference: null
    },
    {
      id: 'REM-1005',
      invoice: 'INV-2143',
      client: 'Elite Properties LLC',
      amount: 2450.00,
      method: 'Check',
      submitted: '2025-01-07',
      processed: null,
      status: 'Pending',
      reference: null
    }
  ];

  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'Processed': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusStyle = (status: string): React.CSSProperties => {
    if (status === 'Pending') {
      return {
        backgroundColor: 'var(--yellow-100)',
        color: 'var(--yellow-700)'
      };
    }
    return {};
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <PageHeader 
        description="Track your earnings and payment history."
        actions={
          <>
            <ActionButton icon={Settings} variant="outline">Settings</ActionButton>
            <ActionButton icon={Download} variant="primary">Download Report</ActionButton>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Remittance Section */}
      <div className="mb-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <SectionTitle title="Remittance" icon={FileText} />
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {remittances.map((remittance) => (
                <div key={remittance.id} className="p-3.5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                          <h3 className="text-sm font-semibold text-gray-900 leading-tight">{remittance.id}</h3>
                          <Badge className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 leading-none">{remittance.invoice}</Badge>
                          <span 
                            className={`px-1.5 py-0.5 rounded-lg text-xs leading-none ${getStatusColor(remittance.status)}`}
                            style={getStatusStyle(remittance.status)}
                          >
                            {remittance.status}
                          </span>
                        </div>
                        <p className="text-gray-900 font-medium mb-1.5 text-sm leading-relaxed">{remittance.client}</p>
                        <div className="flex items-center gap-2.5 text-xs text-gray-600 flex-wrap leading-relaxed">
                          <span>Method: {remittance.method}</span>
                          <span>•</span>
                          <span>Submitted: {remittance.submitted}</span>
                          {remittance.processed && (
                            <>
                              <span>•</span>
                              <span>Processed: {remittance.processed}</span>
                            </>
                          )}
                          {remittance.reference && (
                            <>
                              <span>•</span>
                              <span>Ref: {remittance.reference}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 flex-shrink-0 self-start mt-0.5">
                      <div className="text-right">
                        <h3 className="text-base font-semibold text-gray-900 leading-tight">${remittance.amount.toFixed(2)}</h3>
                        {remittance.status === 'Pending' && (
                          <p className="text-xs leading-normal mt-0.5" style={{ color: 'var(--yellow-600)' }}>Awaiting processing</p>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        <button className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors" title="View">
                          <FileText className="w-4 h-4 text-gray-600" />
                        </button>
                        {remittance.reference && (
                          <button className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors" title="Download">
                            <Download className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Moved to Bottom, All in Same Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trend */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900 leading-tight">Revenue Trend</CardTitle>
              <Badge 
                variant="outline" 
                className="border-0 text-xs px-2 py-0.5"
                style={{ 
                  backgroundColor: 'var(--yellow-50)',
                  color: 'var(--yellow-700)'
                }}
              >
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +24.5%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => [`$${value}`, '']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#f7d604" strokeWidth={3} dot={{ r: 4, fill: '#f7d604' }} name="Revenue" />
                <Line type="monotone" dataKey="target" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: '#9CA3AF' }} name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Payments */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-900 leading-tight">Weekly Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyPayments}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => [`$${value}`, '']}
                />
                <Bar dataKey="amount" fill="#f7d604" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-900 leading-tight">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="percentage"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-3">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: method.color }}></div>
                    <span className="text-gray-600 text-xs">{method.method}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-900 text-xs font-medium">{method.count}</span>
                    <span className="text-gray-500 text-xs">({method.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
