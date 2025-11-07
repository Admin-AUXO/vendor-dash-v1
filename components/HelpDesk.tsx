import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Headphones, MessageSquare, CheckCircle2, Clock, AlertCircle, Send, Phone, Mail, FileText, BookOpen, DollarSign } from 'lucide-react';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard, PageHeader, ActionButton } from './shared';

export function HelpDesk() {
  const stats = [
    {
      title: 'Open Tickets',
      value: '8',
      change: '3 need response',
      icon: MessageSquare
    },
    {
      title: 'Resolved This Month',
      value: '42',
      change: '+12% from last month',
      icon: CheckCircle2,
      trend: 'up' as const
    },
    {
      title: 'Avg. Response Time',
      value: '2.4 hrs',
      change: '-0.8 hrs improvement',
      icon: Clock,
      trend: 'up' as const
    },
    {
      title: 'Customer Satisfaction',
      value: '96%',
      change: 'Based on 38 ratings',
      icon: Headphones
    }
  ];

  const weeklyTickets = [
    { day: 'Mon', open: 3, resolved: 5 },
    { day: 'Tue', open: 5, resolved: 7 },
    { day: 'Wed', open: 4, resolved: 6 },
    { day: 'Thu', open: 2, resolved: 8 },
    { day: 'Fri', open: 6, resolved: 5 },
    { day: 'Sat', open: 1, resolved: 2 },
    { day: 'Sun', open: 0, resolved: 1 }
  ];

  const tickets = [
    {
      id: 'TKT-1234',
      subject: 'Payment not received for INV-2145',
      client: 'Green Property Management',
      category: 'Billing',
      priority: 'High',
      status: 'Open',
      created: '2025-11-07 09:30 AM',
      lastUpdated: '2025-11-07 10:15 AM',
      messages: 3
    },
    {
      id: 'TKT-1233',
      subject: 'Question about work order WO-2341',
      client: 'Metro Realty Group',
      category: 'Work Order',
      priority: 'Medium',
      status: 'Waiting on Customer',
      created: '2025-11-06 02:45 PM',
      lastUpdated: '2025-11-07 08:20 AM',
      messages: 5
    },
    {
      id: 'TKT-1232',
      subject: 'Request for service quote - HVAC',
      client: 'Summit Rentals',
      category: 'Quote Request',
      priority: 'Low',
      status: 'Open',
      created: '2025-11-06 11:20 AM',
      lastUpdated: '2025-11-06 03:30 PM',
      messages: 2
    },
    {
      id: 'TKT-1231',
      subject: 'Invoice correction needed',
      client: 'Elite Properties LLC',
      category: 'Billing',
      priority: 'Medium',
      status: 'In Progress',
      created: '2025-11-05 04:15 PM',
      lastUpdated: '2025-11-06 09:45 AM',
      messages: 4
    }
  ];

  const knowledgeBase = [
    {
      category: 'Getting Started',
      icon: <BookOpen className="w-5 h-5 text-yellow-600" />,
      articles: [
        'How to accept and manage work orders',
        'Creating and sending invoices',
        'Setting up payment methods'
      ]
    },
    {
      category: 'Billing & Payments',
      icon: <DollarSign className="w-5 h-5 text-green-600" />,
      articles: [
        'Understanding payment timelines',
        'Handling invoice disputes',
        'Payment method options'
      ]
    },
    {
      category: 'Work Orders',
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      articles: [
        'Best practices for completing jobs',
        'Communicating with property managers',
        'Emergency service protocols'
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'bg-black text-white';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Resolved': return 'bg-black text-white';
      case 'Open': return 'bg-yellow-100 text-yellow-700';
      case 'In Progress': return 'bg-gray-100 text-gray-700';
      case 'Waiting on Customer': return 'bg-yellow-50 text-yellow-900';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <PageHeader 
        description="Get support and manage customer communications."
        actions={
          <ActionButton icon={MessageSquare} variant="primary">New Ticket</ActionButton>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Ticket Activity & Quick Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 text-base font-semibold leading-tight">Weekly Ticket Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyTickets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="open" fill="#FBBF24" radius={[8, 8, 0, 0]} name="Open" />
                <Bar dataKey="resolved" fill="#000000" radius={[8, 8, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-gray-600">Open</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-black"></div>
                <span className="text-gray-600">Resolved</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-900 text-base font-semibold leading-tight">Quick Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="flex items-start gap-2.5 p-3 bg-yellow-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm font-medium leading-tight">Phone Support</p>
                  <p className="text-gray-600 text-xs leading-normal mt-0.5">(800) 123-4567</p>
                  <p className="text-gray-500 text-xs leading-normal mt-0.5">Mon-Fri, 8AM-6PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm font-medium leading-tight">Email Support</p>
                  <p className="text-gray-600 text-xs leading-normal mt-0.5">support@vendor.com</p>
                  <p className="text-gray-500 text-xs leading-normal mt-0.5">24 hrs response</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-900 text-base font-semibold leading-tight">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Platform', 'Payments', 'API'].map((service) => (
                  <div key={service} className="flex items-center justify-between p-2.5 bg-yellow-50 rounded-lg">
                    <span className="text-gray-700 text-sm">{service}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                      <span className="text-yellow-700 text-xs">Operational</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Ticket Form */}
      <Card className="border-0 shadow-sm mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-900 text-base font-semibold leading-tight">Submit New Support Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              <div>
                <label className="text-gray-700 mb-2 block">Subject</label>
                <Input placeholder="Brief description of your issue" className="border-gray-300" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700 mb-2 block">Category</label>
                  <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white">
                    <option>Billing</option>
                    <option>Work Order</option>
                    <option>Technical Issue</option>
                    <option>Quote Request</option>
                    <option>Scheduling</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-700 mb-2 block">Priority</label>
                  <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-gray-700 mb-2 block">Description</label>
                <Textarea 
                  placeholder="Please provide detailed information about your issue..."
                  rows={4}
                  className="border-gray-300"
                />
              </div>
              <button className="w-full px-5 py-3 bg-yellow-400 text-black rounded-xl hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Submit Ticket
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <AlertCircle className="w-8 h-8 text-yellow-600 mb-3" />
                <h3 className="text-gray-900 mb-2">Before Submitting</h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-1 text-yellow-600" />
                    <span>Check the knowledge base</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-1 text-yellow-600" />
                    <span>Include relevant details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-1 text-yellow-600" />
                    <span>Attach screenshots if needed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Tickets */}
      <Card className="border-0 shadow-sm mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 text-base font-semibold leading-tight">My Support Tickets</CardTitle>
            <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm">
              <option>All Tickets</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-3.5 border border-gray-100 rounded-xl hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2.5 gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      <h3 className="text-gray-900 text-sm font-semibold leading-tight">{ticket.id}</h3>
                      <span className={`px-1.5 py-0.5 rounded-lg text-xs leading-none ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded-lg text-xs leading-none ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 leading-none">{ticket.category}</Badge>
                    </div>
                    <p className="text-gray-900 mb-1 text-sm font-medium leading-relaxed">{ticket.subject}</p>
                    <p className="text-gray-600 text-xs leading-normal">Client: {ticket.client}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors text-xs font-medium flex-shrink-0 self-start mt-0.5 leading-none">
                    View Ticket
                  </button>
                </div>
                <div className="flex items-center gap-4 text-gray-500 pt-2.5 border-t border-gray-100 text-xs leading-relaxed">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Created: {ticket.created}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{ticket.messages} messages</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Base */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-yellow-500" />
            <CardTitle className="text-gray-900 text-base font-semibold leading-tight">Knowledge Base</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {knowledgeBase.map((section, index) => (
              <div key={index} className="p-3.5 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    {section.icon}
                  </div>
                  <h3 className="text-gray-900 text-sm font-semibold leading-tight">{section.category}</h3>
                </div>
                <ul className="space-y-1.5">
                  {section.articles.map((article, idx) => (
                    <li key={idx}>
                      <button className="text-gray-600 hover:text-yellow-600 transition-colors text-left text-xs leading-relaxed">
                        • {article}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
