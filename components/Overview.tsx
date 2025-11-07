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
    { id: 'WO-2341', property: 'Sunset Apartments #201', issue: 'Plumbing Emergency', priority: 'Urgent', time: '2 hours ago', category: 'Plumbing' },
    { id: 'WO-2338', property: 'Oak Street Complex #15', issue: 'HVAC Not Working', priority: 'High', time: '4 hours ago', category: 'HVAC' },
    { id: 'WO-2335', property: 'Riverside Tower #802', issue: 'Electrical Outlet Repair', priority: 'Medium', time: '6 hours ago', category: 'Electrical' }
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
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Welcome Message */}
      <div className="mb-8">
        <p className="text-gray-600 mb-2">Welcome back! Here's what's happening with your service operations today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} trend={stat.trend as 'up' | 'down' | 'neutral'} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Revenue */}
        <Card className="lg:col-span-2 border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 text-lg font-bold mb-1">Weekly Revenue</CardTitle>
                <p className="text-gray-500 text-sm">This week's performance</p>
              </div>
              <Badge 
                variant="outline" 
                className="px-3 py-1"
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
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={240}>
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
          <CardHeader className="pb-4 border-b border-gray-100">
            <div>
              <CardTitle className="text-gray-900 text-lg font-bold mb-1">Service Distribution</CardTitle>
              <p className="text-gray-500 text-sm">By category</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={240}>
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
            <div className="grid grid-cols-2 gap-3 mt-6">
              {serviceDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium text-sm">{item.name}</p>
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
        className="shadow-md mb-8 bg-white"
        style={{ borderLeft: '4px solid var(--yellow-400)' }}
      >
        <CardHeader 
          className="pb-4 border-b"
          style={{ 
            background: 'linear-gradient(to right, var(--yellow-50), rgba(254, 247, 195, 0.5))',
            borderBottomColor: 'var(--yellow-200)'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: 'var(--yellow-400)' }}
            >
              <AlertCircle className="w-5 h-5 text-black" />
            </div>
            <div>
              <CardTitle className="text-gray-900 font-bold">Urgent Work Orders</CardTitle>
              <p className="text-gray-600 text-sm">Immediate attention required</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {urgentWorkOrders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-5 bg-white border-2 border-gray-100 rounded-xl hover:shadow-lg transition-all"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--yellow-200)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '';
                }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: 'var(--yellow-50)' }}
                  >
                    <Wrench 
                      className="w-7 h-7" 
                      style={{ color: 'var(--yellow-600)' }} 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-900 font-semibold">{order.id}</span>
                      <Badge variant={order.priority === 'Urgent' ? 'destructive' : 'default'} className="text-xs font-medium">
                        {order.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{order.category}</Badge>
                    </div>
                    <p className="text-gray-900 font-medium mb-2">{order.issue}</p>
                    <div className="flex items-center gap-3 text-gray-500 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{order.property}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{order.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  className="px-6 py-3 text-black rounded-xl transition-colors font-medium shadow-sm hover:shadow-md"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Work Order Trends */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div>
              <CardTitle className="text-gray-900 text-lg font-bold mb-1">Work Order Trends</CardTitle>
              <p className="text-gray-500 text-sm">6 months overview</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={280}>
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
          <CardHeader className="pb-4 border-b border-gray-100">
            <div>
              <CardTitle className="text-gray-900 text-lg font-bold mb-1">Top Clients Performance</CardTitle>
              <p className="text-gray-500 text-sm">Completion rates</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-5">
              {topClients.map((client, index) => (
                <div key={index} className="space-y-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: 'var(--yellow-100)' }}
                      >
                        <span 
                          className="font-bold"
                          style={{ color: 'var(--yellow-700)' }}
                        >
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-900 font-semibold">{client.name}</p>
                        <p className="text-gray-500 text-sm">{client.orders} work orders</p>
                      </div>
                    </div>
                    <span 
                      className="font-bold text-lg"
                      style={{ color: 'var(--yellow-600)' }}
                    >
                      {client.completion}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-3 rounded-full transition-all shadow-sm"
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Scheduled Jobs */}
        <Card className="lg:col-span-2 border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
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
                  <CardTitle className="text-gray-900 text-lg font-bold">Upcoming Scheduled Jobs</CardTitle>
                  <p className="text-gray-500 text-sm">Next appointments</p>
                </div>
              </div>
              <button 
                className="font-medium text-sm transition-colors"
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
          <CardContent className="pt-6">
            <div className="space-y-4">
              {upcomingJobs.map((job, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all border border-gray-100">
                  <div 
                    className="flex flex-col items-center justify-center bg-white rounded-xl p-4 min-w-[80px] border-2 shadow-sm"
                    style={{ borderColor: 'var(--yellow-200)' }}
                  >
                    <span className="text-gray-900 font-bold text-sm">{job.date}</span>
                    <span 
                      className="font-semibold"
                      style={{ color: 'var(--yellow-600)' }}
                    >
                      {job.time}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold mb-2">{job.service}</p>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{job.property}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 font-medium">{job.client}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardHeader className="pb-4 border-b border-gray-100">
            <CardTitle className="text-gray-900 text-lg font-bold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <button 
                className="w-full px-4 py-3.5 text-black rounded-xl transition-all flex items-center gap-3 font-medium shadow-sm hover:shadow-md"
                style={{ backgroundColor: 'var(--yellow-400)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--yellow-500)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--yellow-400)';
                }}
              >
                <ClipboardList className="w-5 h-5" />
                <span>View All Work Orders</span>
              </button>
              <button className="w-full px-4 py-3.5 bg-black text-white rounded-xl hover:bg-gray-900 transition-all flex items-center gap-3 font-medium shadow-sm hover:shadow-md">
                <FileText className="w-5 h-5" />
                <span>Create Invoice</span>
              </button>
              <button className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-3 font-medium">
                <CheckCircle2 className="w-5 h-5" />
                <span>Complete Job</span>
              </button>
              <button className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-3 font-medium">
                <Briefcase className="w-5 h-5" />
                <span>Browse Jobs</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
