import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileText, DollarSign, Clock, CheckCircle2, Send, Download, Eye, Filter, Plus } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StatCard, PageHeader, SectionTitle, ActionButton, ListItem } from './shared';
import type { ListItemData } from './shared';

export function Invoice() {
  const stats = [
    {
      title: 'Total Invoices',
      value: '234',
      change: '+12 this month',
      icon: FileText
    },
    {
      title: 'Paid Invoices',
      value: '$87,450',
      change: '182 invoices',
      icon: CheckCircle2
    },
    {
      title: 'Pending Payment',
      value: '$23,680',
      change: '34 invoices',
      icon: Clock
    },
    {
      title: 'Overdue',
      value: '$4,250',
      change: '8 invoices',
      icon: DollarSign
    }
  ];

  const monthlyInvoices = [
    { month: 'Jun', paid: 15200, pending: 4200 },
    { month: 'Jul', paid: 18900, pending: 5100 },
    { month: 'Aug', paid: 16400, pending: 3800 },
    { month: 'Sep', paid: 21000, pending: 6200 },
    { month: 'Oct', paid: 24500, pending: 4900 },
    { month: 'Nov', paid: 19200, pending: 7100 }
  ];

  const invoiceTimeline = [
    { day: '1-5', count: 8 },
    { day: '6-10', count: 12 },
    { day: '11-15', count: 15 },
    { day: '16-20', count: 18 },
    { day: '21-25', count: 14 },
    { day: '26-30', count: 10 }
  ];

  const statusDistribution = [
    { name: 'Paid', value: 182, color: '#10B981' },
    { name: 'Sent', value: 34, color: '#3B82F6' },
    { name: 'Draft', value: 10, color: '#6B7280' },
    { name: 'Overdue', value: 8, color: '#EF4444' }
  ];

  const invoices = [
    { 
      id: 'INV-2145', 
      client: 'Green Property Management',
      property: 'Sunset Apartments #201',
      workOrder: 'WO-2320',
      service: 'Door Lock Repair',
      amount: 850.00,
      issueDate: '2025-11-05',
      dueDate: '2025-11-20',
      status: 'Paid',
      paidDate: '2025-11-06'
    },
    { 
      id: 'INV-2144', 
      client: 'Metro Realty Group',
      property: 'Riverside Tower #802',
      workOrder: 'WO-2318',
      service: 'Electrical Outlet Installation',
      amount: 1250.00,
      issueDate: '2025-11-04',
      dueDate: '2025-11-19',
      status: 'Sent',
      paidDate: null
    },
    { 
      id: 'INV-2143', 
      client: 'Elite Properties LLC',
      property: 'Oak Street Complex #15',
      workOrder: 'WO-2315',
      service: 'HVAC Repair & Maintenance',
      amount: 2450.00,
      issueDate: '2025-11-03',
      dueDate: '2025-11-18',
      status: 'Sent',
      paidDate: null
    },
    { 
      id: 'INV-2142', 
      client: 'Summit Rentals',
      property: 'Cedar Heights #701',
      workOrder: 'WO-2312',
      service: 'Plumbing Repair - Kitchen Sink',
      amount: 680.00,
      issueDate: '2025-11-02',
      dueDate: '2025-11-17',
      status: 'Paid',
      paidDate: '2025-11-04'
    },
    { 
      id: 'INV-2141', 
      client: 'Urban Living Properties',
      property: 'Downtown Lofts #305',
      workOrder: 'WO-2308',
      service: 'Appliance Installation',
      amount: 1850.00,
      issueDate: '2025-10-28',
      dueDate: '2025-11-12',
      status: 'Overdue',
      paidDate: null
    }
  ];

  const preSubmissionInvoices = [
    {
      id: 'INV-2150',
      client: 'Coastal Properties',
      property: 'Beachfront Condo #402',
      workOrder: 'WO-2335',
      service: 'Bathroom Renovation',
      amount: 5500.00,
      created: '2025-01-08',
      status: 'Draft'
    },
    {
      id: 'INV-2149',
      client: 'Peak Real Estate',
      property: 'Mountain View #301',
      workOrder: 'WO-2334',
      service: 'Roof Leak Repair',
      amount: 1800.00,
      created: '2025-01-07',
      status: 'Draft'
    },
    {
      id: 'INV-2148',
      client: 'Garden Properties',
      property: 'Garden Plaza #205',
      workOrder: 'WO-2333',
      service: 'HVAC Installation',
      amount: 3200.00,
      created: '2025-01-06',
      status: 'Draft'
    }
  ];

  const postSubmissionInvoices = [
    {
      id: 'INV-2147',
      client: 'Downtown Realty',
      property: 'City Center #101',
      workOrder: 'WO-2332',
      service: 'Electrical Panel Upgrade',
      amount: 2100.00,
      sent: '2025-01-05',
      dueDate: '2025-01-20',
      status: 'Sent'
    },
    {
      id: 'INV-2146',
      client: 'Elite Properties LLC',
      property: 'Oak Street Complex #15',
      workOrder: 'WO-2331',
      service: 'Window Replacement',
      amount: 3200.00,
      sent: '2025-01-04',
      dueDate: '2025-01-19',
      status: 'Sent'
    },
    {
      id: 'INV-2145',
      client: 'Green Property Management',
      property: 'Sunset Apartments #201',
      workOrder: 'WO-2330',
      service: 'Door Lock Repair',
      amount: 850.00,
      sent: '2025-01-03',
      dueDate: '2025-01-18',
      status: 'Paid',
      paidDate: '2025-01-06'
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-700';
      case 'Sent': return 'bg-blue-100 text-blue-700';
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'Overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <PageHeader 
        description="Create, manage, and track all your service invoices."
        actions={<ActionButton icon={Plus} variant="primary">Create Invoice</ActionButton>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Pre-submission Section */}
      <div className="mb-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <SectionTitle title="Pre-submission" icon={FileText} />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {preSubmissionInvoices.map((invoice) => {
                const listData: ListItemData = {
                  id: invoice.id,
                  title: invoice.service,
                  badges: [
                    { label: invoice.workOrder, variant: 'outline', className: 'bg-gray-100 text-gray-700' },
                    { label: invoice.status, className: getStatusColor(invoice.status) }
                  ],
                  metadata: [
                    { value: invoice.client },
                    { value: invoice.property },
                    { value: `Created: ${invoice.created}` }
                  ],
                  amount: invoice.amount,
                  actionButtons: (
                    <>
                      <button className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors" title="Edit">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        className="px-3 py-1.5 text-black rounded-lg transition-colors text-xs font-medium leading-none"
                        style={{ backgroundColor: 'var(--yellow-400)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--yellow-500)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--yellow-400)';
                        }}
                      >
                        Submit
                      </button>
                    </>
                  )
                };

                return (
                  <div key={invoice.id} className="border border-gray-200 rounded-xl hover:shadow-md transition-all overflow-hidden">
                    <ListItem
                      data={listData}
                      icon={FileText}
                      iconBgColor="bg-gray-50"
                      iconColor="text-gray-600"
                      compact
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Post-submission Section */}
      <div className="mb-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <SectionTitle title="Post-submission" icon={FileText} />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {postSubmissionInvoices.map((invoice) => {
                const metadata = [
                  { value: invoice.client },
                  { value: invoice.property },
                  { value: `Sent: ${invoice.sent}` },
                  { value: `Due: ${invoice.dueDate}`, highlight: true }
                ];
                if (invoice.paidDate) {
                  metadata.push({ value: `Paid: ${invoice.paidDate}`, highlight: true });
                }

                const listData: ListItemData = {
                  id: invoice.id,
                  title: invoice.service,
                  badges: [
                    { label: invoice.workOrder, variant: 'outline', className: 'bg-gray-100 text-gray-700' },
                    { label: invoice.status, className: getStatusColor(invoice.status) }
                  ],
                  metadata,
                  amount: invoice.amount,
                  actionButtons: (
                    <>
                      <button className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors" title="Download">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </>
                  )
                };

                return (
                  <div key={invoice.id} className="border border-gray-200 rounded-xl hover:shadow-md transition-all overflow-hidden">
                    <ListItem
                      data={listData}
                      icon={FileText}
                      iconBgColor="bg-blue-50"
                      iconColor="text-blue-600"
                      compact
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Invoices Section - Refined Layout */}
      <div className="mb-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <SectionTitle title="All Invoices" icon={FileText} />
              <div className="flex gap-2">
                <ActionButton icon={Filter} variant="outline" className="text-sm">Filter</ActionButton>
                <ActionButton icon={Download} variant="secondary" className="text-sm">Export</ActionButton>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invoices.map((invoice) => {
                const metadata = [
                  { value: invoice.client },
                  { value: invoice.property },
                  { value: `Due: ${invoice.dueDate}`, highlight: true }
                ];
                if (invoice.paidDate) {
                  metadata.push({ value: `Paid: ${invoice.paidDate}`, highlight: true });
                }

                const listData: ListItemData = {
                  id: invoice.id,
                  title: invoice.service,
                  badges: [
                    { label: invoice.workOrder, variant: 'outline', className: 'bg-gray-100 text-gray-700' },
                    { label: invoice.status, className: getStatusColor(invoice.status) }
                  ],
                  metadata,
                  amount: invoice.amount,
                  amountLabel: `Issued: ${invoice.issueDate}`,
                  actionButtons: (
                    <>
                      <button className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors" title="Download">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                      {invoice.status !== 'Paid' && (
                        <button 
                          className="px-3 py-1.5 text-black rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium leading-none"
                          style={{ backgroundColor: 'var(--yellow-400)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--yellow-500)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--yellow-400)';
                          }}
                        >
                          <Send className="w-3.5 h-3.5" />
                          Send
                        </button>
                      )}
                    </>
                  )
                };

                return (
                  <div key={invoice.id} className="border border-gray-200 rounded-xl hover:shadow-md transition-all overflow-hidden">
                    <ListItem
                      data={listData}
                      icon={FileText}
                      iconBgColor="bg-gray-50"
                      iconColor="text-gray-600"
                      compact
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Moved to Bottom, All in Same Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Revenue */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-900 leading-tight">Monthly Invoice Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyInvoices}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => [`$${value}`, '']}
                />
                <Bar dataKey="paid" fill="#f7d604" radius={[8, 8, 0, 0]} name="Paid" />
                <Bar dataKey="pending" fill="#9CA3AF" radius={[8, 8, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: 'var(--yellow-400)' }}
                ></div>
                <span className="text-gray-600 text-sm">Paid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-gray-600 text-sm">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Timeline */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-900 leading-tight">Invoice Generation Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={invoiceTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => [`${value}`, 'Invoices']}
                />
                <Line type="monotone" dataKey="count" stroke="#f7d604" strokeWidth={3} dot={{ r: 5, fill: '#f7d604' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-900 leading-tight">Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, 'Invoices']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-3">
              {statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600 text-xs">{item.name}</span>
                  </div>
                  <span className="text-gray-900 text-xs font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
