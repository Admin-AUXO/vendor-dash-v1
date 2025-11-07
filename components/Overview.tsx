import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ClipboardList, FileText, DollarSign, TrendingUp, AlertCircle, Clock, CheckCircle2, Calendar, Briefcase, Wrench, MapPin } from 'lucide-react';
import { Badge } from './ui/badge';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { StatCard } from './shared';

export function Overview() {
  const stats = [
    {
      title: 'Active Work Orders',
      value: '24',
      change: '+3 new today',
      trend: 'up',
      icon: ClipboardList
    },
    {
      title: 'Pending Invoices',
      value: '12',
      change: '$18,450 unpaid',
      trend: 'neutral',
      icon: FileText
    },
    {
      title: 'Monthly Revenue',
      value: '$42,580',
      change: '+12.5% from last month',
      trend: 'up',
      icon: DollarSign
    },
    {
      title: 'Completion Rate',
      value: '94.2%',
      change: '+2.1% improvement',
      trend: 'up',
      icon: TrendingUp
    }
  ];

  const weeklyRevenue = [
    { day: 'Mon', amount: 5200 },
    { day: 'Tue', amount: 6800 },
    { day: 'Wed', amount: 5900 },
    { day: 'Thu', amount: 7200 },
    { day: 'Fri', amount: 8100 },
    { day: 'Sat', amount: 4200 },
    { day: 'Sun', amount: 3800 }
  ];

  const workOrderTrend = [
    { month: 'Jun', completed: 45, pending: 12 },
    { month: 'Jul', completed: 52, pending: 15 },
    { month: 'Aug', completed: 48, pending: 10 },
    { month: 'Sep', completed: 61, pending: 14 },
    { month: 'Oct', completed: 58, pending: 11 },
    { month: 'Nov', completed: 65, pending: 13 }
  ];

  const serviceDistribution = [
    { name: 'Plumbing', value: 35, color: '#f7d604' },
    { name: 'HVAC', value: 28, color: '#000000' },
    { name: 'Electrical', value: 22, color: '#9CA3AF' },
    { name: 'Other', value: 15, color: '#E5E7EB' }
  ];

  const urgentWorkOrders = [
    { id: 'WO-2341', property: 'Sunset Apartments #201', issue: 'Plumbing Emergency', priority: 'Urgent', time: '2 hours ago', category: 'Plumbing', estimatedCost: '$850', client: 'Green Property', contact: 'John Doe', phone: '(555) 123-4567' },
    { id: 'WO-2338', property: 'Oak Street Complex #15', issue: 'HVAC Not Working', priority: 'High', time: '4 hours ago', category: 'HVAC', estimatedCost: '$1,250', client: 'Metro Realty', contact: 'Jane Smith', phone: '(555) 234-5678' },
    { id: 'WO-2335', property: 'Riverside Tower #802', issue: 'Electrical Outlet Repair', priority: 'Medium', time: '6 hours ago', category: 'Electrical', estimatedCost: '$680', client: 'Summit Rentals', contact: 'Mike Johnson', phone: '(555) 345-6789' }
  ];

  const upcomingJobs = [
    { date: 'Nov 7', time: '9:00 AM', property: 'Maple Gardens #12', service: 'HVAC Maintenance', client: 'Green Property' },
    { date: 'Nov 7', time: '2:00 PM', property: 'Downtown Lofts #305', service: 'Appliance Install', client: 'Metro Realty' },
    { date: 'Nov 8', time: '10:00 AM', property: 'Parkview Estates', service: 'Lawn Maintenance', client: 'Elite Properties' },
    { date: 'Nov 8', time: '3:00 PM', property: 'Cedar Heights #701', service: 'Painting', client: 'Summit Rentals' }
  ];

  const topClients = [
    { name: 'Green Property Management', orders: 28, completion: 96 },
    { name: 'Metro Realty Group', orders: 22, completion: 92 },
    { name: 'Elite Properties LLC', orders: 18, completion: 98 },
    { name: 'Summit Rentals', orders: 15, completion: 94 }
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-full">
      {/* Welcome Message */}
      <div className="mb-6">
        <p className="text-gray-600 text-sm">Welcome back! Here's what's happening with your service operations today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} trend={stat.trend as 'up' | 'down' | 'neutral'} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Weekly Revenue */}
        <Card className="lg:col-span-2 border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 text-base font-semibold mb-1 leading-tight">Weekly Revenue</CardTitle>
                <p className="text-gray-500 text-xs leading-normal">This week's performance</p>
              </div>
              <Badge 
                variant="outline" 
                className="px-2 py-0.5 text-xs"
                style={{ 
                  backgroundColor: 'var(--yellow-50)',
                  color: 'var(--yellow-700)',
                  borderColor: 'var(--yellow-200)'
                }}
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="amount" fill="#f7d604" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Distribution */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div>
              <CardTitle className="text-gray-900 text-base font-semibold mb-1 leading-tight">Service Distribution</CardTitle>
              <p className="text-gray-500 text-xs leading-normal">By category</p>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value}%`, 'Jobs']} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {serviceDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium text-xs">{item.name}</p>
                    <p className="text-gray-500 text-xs">{item.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Work Orders Alert */}
      <Card 
        className="shadow-md mb-6 bg-white"
        style={{ borderLeft: '4px solid var(--yellow-400)' }}
      >
        <CardHeader 
          className="pb-3 border-b"
          style={{ 
            background: 'linear-gradient(to right, var(--yellow-50), rgba(254, 247, 195, 0.5))',
            borderBottomColor: 'var(--yellow-200)'
          }}
        >
          <div className="flex items-center gap-2.5">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: 'var(--yellow-400)' }}
            >
              <AlertCircle className="w-5 h-5 text-black" />
            </div>
            <div>
              <CardTitle className="text-gray-900 font-semibold text-base leading-tight">Urgent Work Orders</CardTitle>
              <p className="text-gray-600 text-xs">Immediate attention required</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {urgentWorkOrders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-3.5 bg-white border-2 border-gray-100 rounded-xl hover:shadow-lg transition-all"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--yellow-200)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '';
                }}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: 'var(--yellow-50)' }}
                  >
                    <Wrench 
                      className="w-5 h-5" 
                      style={{ color: 'var(--yellow-600)' }} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      <span className="text-gray-900 font-semibold text-sm leading-tight">{order.id}</span>
                      <Badge variant={order.priority === 'Urgent' ? 'destructive' : 'default'} className="text-xs font-medium px-1.5 py-0.5 leading-none">
                        {order.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 leading-none">{order.category}</Badge>
                    </div>
                    <p className="text-gray-900 font-medium mb-1.5 text-sm leading-relaxed">{order.issue}</p>
                    <div className="flex items-center gap-2 text-gray-600 text-xs flex-wrap leading-relaxed">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{order.property}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{order.time}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="font-medium text-gray-700">{order.estimatedCost}</span>
                      <span className="text-gray-400">•</span>
                      <span>{order.client}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="px-4 py-2 text-black rounded-lg transition-colors font-medium text-sm shadow-sm hover:shadow-md flex-shrink-0 self-start mt-0.5"
                  style={{ backgroundColor: 'var(--yellow-400)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--yellow-500)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--yellow-400)';
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Work Order Trends & Top Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Work Order Trends */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div>
              <CardTitle className="text-gray-900 text-base font-semibold mb-1 leading-tight">Work Order Trends</CardTitle>
              <p className="text-gray-500 text-xs leading-normal">6 months overview</p>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={workOrderTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#f7d604" strokeWidth={3} dot={{ r: 5, fill: '#f7d604' }} name="Completed" />
                <Line type="monotone" dataKey="pending" stroke="#9CA3AF" strokeWidth={3} dot={{ r: 5, fill: '#9CA3AF' }} name="Pending" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Clients Performance */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div>
              <CardTitle className="text-gray-900 text-base font-semibold mb-1 leading-tight">Top Clients Performance</CardTitle>
              <p className="text-gray-500 text-xs leading-normal">Completion rates</p>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {topClients.map((client, index) => (
                <div key={index} className="space-y-2.5 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
                        style={{ backgroundColor: 'var(--yellow-100)' }}
                      >
                        <span 
                          className="font-semibold text-sm leading-none"
                          style={{ color: 'var(--yellow-700)' }}
                        >
                          #{index + 1}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-gray-900 font-semibold text-sm truncate leading-tight mb-0.5">{client.name}</p>
                        <p className="text-gray-500 text-xs leading-normal">{client.orders} work orders</p>
                      </div>
                    </div>
                    <span 
                      className="font-semibold text-base flex-shrink-0 leading-tight"
                      style={{ color: 'var(--yellow-600)' }}
                    >
                      {client.completion}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-2 rounded-full transition-all shadow-sm"
                      style={{ 
                        width: `${client.completion}%`,
                        background: 'linear-gradient(to right, var(--yellow-400), var(--yellow-500))'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Jobs & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Scheduled Jobs */}
        <Card className="lg:col-span-2 border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--yellow-50)' }}
                >
                  <Calendar 
                    className="w-5 h-5" 
                    style={{ color: 'var(--yellow-600)' }} 
                  />
                </div>
                <div>
                  <CardTitle className="text-gray-900 text-base font-semibold leading-tight">Upcoming Scheduled Jobs</CardTitle>
                  <p className="text-gray-500 text-xs leading-normal mt-0.5">Next appointments</p>
                </div>
              </div>
              <button 
                className="font-medium text-xs transition-colors"
                style={{ color: 'var(--yellow-600)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--yellow-700)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--yellow-600)';
                }}
              >
                View All →
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2.5">
              {upcomingJobs.map((job, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all border border-gray-100">
                  <div 
                    className="flex flex-col items-center justify-center bg-white rounded-xl p-2.5 min-w-[70px] border-2 shadow-sm flex-shrink-0"
                    style={{ borderColor: 'var(--yellow-200)' }}
                  >
                    <span className="text-gray-900 font-semibold text-xs leading-tight">{job.date}</span>
                    <span 
                      className="font-semibold text-xs"
                      style={{ color: 'var(--yellow-600)' }}
                    >
                      {job.time}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold mb-1 text-sm">{job.service}</p>
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{job.property}</span>
                    </div>
                    <p className="text-gray-600 font-medium text-xs mt-0.5">{job.client}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-gray-900 text-base font-semibold leading-tight">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <button 
                className="w-full px-3 py-2.5 text-black rounded-xl transition-all flex items-center gap-2 font-medium text-sm shadow-sm hover:shadow-md"
                style={{ backgroundColor: 'var(--yellow-400)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--yellow-500)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--yellow-400)';
                }}
              >
                <ClipboardList className="w-4 h-4" />
                <span>View All Work Orders</span>
              </button>
              <button className="w-full px-3 py-2.5 bg-black text-white rounded-xl hover:bg-gray-900 transition-all flex items-center gap-2 font-medium text-sm shadow-sm hover:shadow-md">
                <FileText className="w-4 h-4" />
                <span>Create Invoice</span>
              </button>
              <button className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 font-medium text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Job</span>
              </button>
              <button className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 font-medium text-sm">
                <Briefcase className="w-4 h-4" />
                <span>Browse Jobs</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
