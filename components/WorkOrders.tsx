import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Wrench, 
  MapPin, 
  User, 
  DollarSign, 
  Filter, 
  Download,
  Inbox,
  FileCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  X,
  Edit2,
  Save,
  ChevronRight
} from 'lucide-react';
import { Badge } from './ui/badge';
import { StatCard, PageHeader, SectionTitle, ActionButton, SlidingTabs } from './shared';

type WorkOrderStatus = 'awaiting' | 'my-orders' | 'rejected' | 'in-progress' | 'validation';

interface WorkOrder {
  id: string;
  property: string;
  address: string;
  issue: string;
  category: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: WorkOrderStatus;
  created: string;
  client: string;
  estimatedCost: string;
  completion?: number;
  description?: string;
  assignedTo?: string;
  dueDate?: string;
}

export function WorkOrders() {
  const [inboxTab, setInboxTab] = useState<'awaiting' | 'my-orders' | 'rejected'>('awaiting');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<WorkOrder>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Generate 20 sample work orders for each inbox tab
  const generateSampleOrders = (status: WorkOrderStatus, count: number): WorkOrder[] => {
    const orders: WorkOrder[] = [];
    const categories = ['Plumbing', 'HVAC', 'Electrical', 'General', 'Roofing'];
    const priorities: ('Urgent' | 'High' | 'Medium' | 'Low')[] = ['Urgent', 'High', 'Medium', 'Low'];
    const properties = [
      'Sunset Apartments', 'Cedar Heights', 'Riverside Tower', 'Oak Street Complex', 
      'Maple Gardens', 'Pine Valley', 'Ocean View', 'Mountain View', 'Garden Plaza', 'City Center'
    ];
    const clients = [
      'Green Property Management', 'Summit Rentals', 'Metro Realty Group', 
      'Elite Properties LLC', 'Urban Living Corp', 'Coastal Properties', 'Peak Real Estate'
    ];
    const issues = [
      'Plumbing Emergency - Water Leak', 'HVAC System Maintenance', 'Electrical Outlet Repair',
      'Kitchen Sink Drainage Issue', 'Window Replacement Request', 'Roof Leak Repair',
      'Bathroom Renovation', 'Appliance Installation', 'Paint Job', 'Flooring Replacement'
    ];

    for (let i = 0; i < count; i++) {
      orders.push({
        id: `WO-${2300 + i}`,
        property: `${properties[i % properties.length]} #${100 + i}`,
        address: `${100 + i} Main St`,
        issue: issues[i % issues.length],
        category: categories[i % categories.length],
        priority: priorities[i % priorities.length],
        status,
        created: `2025-01-${String(10 + i % 20).padStart(2, '0')}`,
        client: clients[i % clients.length],
        estimatedCost: `$${(Math.floor(Math.random() * 2000) + 200).toFixed(0)}`
      });
    }
    return orders;
  };

  const stats = [
    {
      title: 'Total Work Orders',
      value: '156',
      change: '+8 this week',
      icon: ClipboardList
    },
    {
      title: 'In Progress',
      value: '24',
      change: 'Actively working',
      icon: Clock
    },
    {
      title: 'Completed This Month',
      value: '89',
      change: '+15% from last month',
      icon: CheckCircle2
    },
    {
      title: 'Avg. Completion Time',
      value: '2.3 days',
      change: '-0.5 days improvement',
      icon: Calendar
    }
  ];

  const [awaitingResponse] = useState<WorkOrder[]>(generateSampleOrders('awaiting', 20));
  const [myWorkOrders, setMyWorkOrders] = useState<WorkOrder[]>(generateSampleOrders('my-orders', 20));
  const [rejectedOrders, setRejectedOrders] = useState<WorkOrder[]>(generateSampleOrders('rejected', 20));

  const [workInProgress, setWorkInProgress] = useState<WorkOrder[]>([
    { 
      id: 'WO-2335', 
      property: 'Ocean View #502', 
      address: '147 Ocean Blvd',
      issue: 'Complete Bathroom Renovation', 
      category: 'Renovation',
      priority: 'High', 
      status: 'in-progress',
      created: '2025-01-03',
      client: 'Coastal Properties',
      estimatedCost: '$5,500',
      completion: 65,
      description: 'Full bathroom renovation including tile work, plumbing, and fixtures installation. Custom tile selection completed. Plumbing rough-in in progress. Expected completion in 5 days.',
      assignedTo: 'John Smith',
      dueDate: '2025-01-15'
    },
    { 
      id: 'WO-2334', 
      property: 'Mountain View #301', 
      address: '258 Mountain Rd',
      issue: 'Roof Leak Repair', 
      category: 'Roofing',
      priority: 'Urgent', 
      status: 'in-progress',
      created: '2025-01-02',
      client: 'Peak Real Estate',
      estimatedCost: '$1,800',
      completion: 40,
      description: 'Emergency roof leak repair in the master bedroom area. Need to replace damaged shingles and seal gaps. Temporary tarp installed. Awaiting material delivery.',
      assignedTo: 'Mike Johnson',
      dueDate: '2025-01-10'
    },
    { 
      id: 'WO-2333', 
      property: 'Garden Plaza #205', 
      address: '369 Garden Ave',
      issue: 'HVAC Installation', 
      category: 'HVAC',
      priority: 'High', 
      status: 'in-progress',
      created: '2024-12-30',
      client: 'Garden Properties',
      estimatedCost: '$3,200',
      completion: 80,
      description: 'New HVAC unit installation for 2-bedroom unit. Ductwork completed. Unit mounting in progress. Electrical connections scheduled for tomorrow.',
      assignedTo: 'Sarah Williams',
      dueDate: '2025-01-12'
    }
  ]);

  const [validationOrders] = useState<WorkOrder[]>(generateSampleOrders('validation', 15));

  const getPriorityColor = (priority: string): string => {
    switch(priority) {
      case 'Urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return '';
      case 'Low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityStyle = (priority: string): React.CSSProperties => {
    if (priority === 'Medium') {
      return {
        backgroundColor: 'var(--yellow-100)',
        color: 'var(--yellow-700)',
        borderColor: 'var(--yellow-200)'
      };
    }
    return {};
  };

  const handleMoveToMyOrders = (orderId: string) => {
    const order = awaitingResponse.find(o => o.id === orderId);
    if (order) {
      setMyWorkOrders([...myWorkOrders, { ...order, status: 'my-orders' }]);
    }
  };

  const handleMoveToRejected = (orderId: string) => {
    const order = myWorkOrders.find(o => o.id === orderId);
    if (order) {
      setMyWorkOrders(myWorkOrders.filter(o => o.id !== orderId));
      setRejectedOrders([...rejectedOrders, { ...order, status: 'rejected' }]);
    }
  };

  const toggleExpand = (orderId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedCards(newExpanded);
  };

  const handleUpdate = (orderId: string) => {
    setWorkInProgress(workInProgress.map(order => 
      order.id === orderId ? { ...order, ...editFormData } : order
    ));
    setEditingCard(null);
    setEditFormData({});
  };

  const handleEditStart = (order: WorkOrder) => {
    setEditingCard(order.id);
    setEditFormData({
      description: order.description,
      assignedTo: order.assignedTo,
      dueDate: order.dueDate,
      completion: order.completion
    });
  };

  const handleEditChange = (field: keyof WorkOrder, value: any) => {
    setEditFormData({ ...editFormData, [field]: value });
  };

  const getCurrentInboxOrders = () => {
    switch(inboxTab) {
      case 'awaiting': return awaitingResponse;
      case 'my-orders': return myWorkOrders;
      case 'rejected': return rejectedOrders;
      default: return [];
    }
  };


  const paginatedOrders = getCurrentInboxOrders();
  const totalPages = Math.ceil(paginatedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = paginatedOrders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <PageHeader 
        description="Manage and track all property maintenance work orders."
        actions={
          <>
            <ActionButton icon={Filter} variant="outline">Filter</ActionButton>
            <ActionButton icon={Download} variant="primary">Export</ActionButton>
          </>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Inbox Section - Sliding Tabs */}
      <div className="mb-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <SectionTitle title="Inbox" icon={Inbox} />
          </CardHeader>
          <CardContent>
            <SlidingTabs
              tabs={[
                { id: 'awaiting', label: 'Awaiting Response', count: awaitingResponse.length },
                { id: 'my-orders', label: 'My Work Orders', count: myWorkOrders.length },
                { id: 'rejected', label: 'Rejected', count: rejectedOrders.length }
              ]}
              activeTab={inboxTab}
              onTabChange={(tabId) => {
                setInboxTab(tabId as typeof inboxTab);
                setCurrentPage(1);
              }}
            />

            {/* Single Column List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-2">
              {currentOrders.map((order) => (
                <div key={order.id} className="p-3.5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Wrench className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                          <h3 className="text-sm font-semibold text-gray-900 leading-tight">{order.id}</h3>
                          <Badge 
                            className={`text-xs border px-1.5 py-0.5 leading-none ${getPriorityColor(order.priority)}`}
                            style={getPriorityStyle(order.priority)}
                          >
                            {order.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5 leading-none">{order.category}</Badge>
                        </div>
                        <h4 className="text-gray-900 font-medium mb-2 text-sm leading-relaxed">{order.issue}</h4>
                        <div className="flex items-center gap-2.5 text-xs text-gray-600 flex-wrap leading-relaxed">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{order.property}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{order.client}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{order.estimatedCost}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{order.created}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 self-start mt-0.5">
                      {inboxTab === 'awaiting' && (
                        <button
                          onClick={() => handleMoveToMyOrders(order.id)}
                          className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5 text-xs font-medium leading-none"
                        >
                          Move to My Orders
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {inboxTab === 'my-orders' && (
                        <button
                          onClick={() => handleMoveToRejected(order.id)}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5 text-xs font-medium leading-none"
                        >
                          Move to Rejected
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {inboxTab === 'rejected' && (
                        <div className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-center text-xs leading-normal">
                          Rejected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, paginatedOrders.length)} of {paginatedOrders.length}
                </p>
              <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-black rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    style={{ 
                      backgroundColor: 'var(--yellow-400)',
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.backgroundColor = 'var(--yellow-500)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--yellow-400)';
                    }}
                  >
                    Next Page
                    <ChevronRight className="w-4 h-4" />
                  </button>
              </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Work in Progress Section */}
      <div className="mb-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <SectionTitle title="Work in Progress" icon={Clock} />
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {workInProgress.map((order) => {
                const isExpanded = expandedCards.has(order.id);
                const isEditing = editingCard === order.id;

                return (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all">
                    <div className="p-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Wrench className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                              <h3 className="text-sm font-semibold text-gray-900 leading-tight">{order.id}</h3>
                              <Badge 
                                className={`border text-xs px-1.5 py-0.5 leading-none ${getPriorityColor(order.priority)}`}
                                style={getPriorityStyle(order.priority)}
                              >
                                {order.priority}
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 leading-none">In Progress</Badge>
                            </div>
                            <h4 className="text-gray-900 font-medium mb-2 text-sm leading-relaxed">{order.issue}</h4>
                            <div className="flex items-center gap-2.5 text-xs text-gray-600 mb-2 flex-wrap leading-relaxed">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{order.property}</span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <div className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{order.client}</span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{order.estimatedCost}</span>
                              </div>
                              {order.assignedTo && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <div className="flex items-center gap-1">
                                    <User className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>Assigned: {order.assignedTo}</span>
                                  </div>
                                </>
                              )}
                              {order.dueDate && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>Due: {order.dueDate}</span>
                                  </div>
                                </>
                              )}
                            </div>
                            {order.completion !== undefined && (
                              <div className="mt-1.5">
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-xs text-gray-600">Progress</span>
                                  <span className="text-xs font-medium text-gray-900">{order.completion}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                                    style={{ width: `${order.completion}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 self-start mt-0.5"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-2.5 pt-2.5 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-2.5">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              {isEditing ? (
                                <textarea
                                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                                  value={editFormData.description || ''}
                                  onChange={(e) => handleEditChange('description', e.target.value)}
                                  rows={3}
                                />
                              ) : (
                                <p className="text-xs text-gray-600">{order.description || 'No description'}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Assigned To
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                                  value={editFormData.assignedTo || ''}
                                  onChange={(e) => handleEditChange('assignedTo', e.target.value)}
                                />
                              ) : (
                                <p className="text-xs text-gray-600">{order.assignedTo || 'Not assigned'}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Due Date
                              </label>
                              {isEditing ? (
                                <input
                                  type="date"
                                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                                  value={editFormData.dueDate || ''}
                                  onChange={(e) => handleEditChange('dueDate', e.target.value)}
                                />
                              ) : (
                                <p className="text-xs text-gray-600">{order.dueDate || 'No due date'}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Completion
                              </label>
                              {isEditing ? (
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                                  value={editFormData.completion || 0}
                                  onChange={(e) => handleEditChange('completion', parseInt(e.target.value) || 0)}
                                />
                              ) : (
                                <p className="text-xs text-gray-600">{order.completion || 0}%</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleUpdate(order.id)}
                                  className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-xs"
                                >
                                  <Save className="w-3 h-3" />
                                  Save Changes
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingCard(null);
                                    setEditFormData({});
                                  }}
                                  className="px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleEditStart(order)}
                                className="px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5 text-xs"
                              >
                                <Edit2 className="w-3 h-3" />
                                Edit Details
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Section - Single Column */}
      <div className="mb-6">
        <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
            <SectionTitle title="Validation" icon={FileCheck} />
        </CardHeader>
        <CardContent>
            <div className="space-y-2.5">
              {validationOrders.map((order) => (
                <div key={order.id} className="p-3.5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                          <h3 className="text-sm font-semibold text-gray-900 leading-tight">{order.id}</h3>
                          <Badge className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 leading-none">
                            Finalized
                          </Badge>
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5 leading-none">{order.category}</Badge>
                        </div>
                        <h4 className="text-gray-900 font-medium mb-2 text-sm leading-relaxed">{order.issue}</h4>
                        <div className="flex items-center gap-2.5 text-xs text-gray-600 flex-wrap leading-relaxed">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{order.property}</span>
                        </div>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{order.client}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{order.estimatedCost}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{order.created}</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
