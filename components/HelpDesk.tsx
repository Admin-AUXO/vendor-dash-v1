import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui';
import { 
  FilterSystem,
  FilterPanelSlideIn,
  SearchBar,
  PriorityBadge,
  EmptyState,
  Accordion,
  InboxPagination,
  type FilterGroup,
} from './shared';
import { 
  Clock, 
  MessageSquare,
  Filter,
  Phone,
  Mail,
  CheckCircle2,
  Info,
  Send,
  Building2,
  Activity,
} from 'lucide-react';
import { supportTickets, knowledgeBaseArticles, workOrders, type SupportTicket } from '../data';
import { format } from 'date-fns';
import { cn } from './ui/utils';

// Support Ticket Card Component - Single Row Layout
interface SupportTicketCardProps {
  ticket: SupportTicket;
  onViewTicket?: (ticket: SupportTicket) => void;
}

function SupportTicketCard({ ticket, onViewTicket }: SupportTicketCardProps) {
  // Get client name from related work order if available
  const clientName = useMemo(() => {
    if (ticket.relatedWorkOrderId) {
      const workOrder = workOrders.find(wo => wo.workOrderId === ticket.relatedWorkOrderId);
      return workOrder?.clientName;
    }
    return null;
  }, [ticket.relatedWorkOrderId]);

  const statusType = 
    ticket.status === 'resolved' || ticket.status === 'closed' ? 'success' :
    ticket.status === 'in-progress' ? 'info' :
    ticket.status === 'waiting-response' ? 'warning' :
    'pending';

  const statusLabel = ticket.status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const messageCount = ticket.messages?.length || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200">
      <div className="flex items-center justify-between gap-4">
        {/* Ticket ID */}
        <div className="flex-shrink-0 w-24">
          <h3 className="font-bold text-sm text-gray-900 font-mono">
            {ticket.ticketId}
          </h3>
        </div>

        {/* Priority Badge */}
        <div className="flex-shrink-0">
          <PriorityBadge priority={ticket.priority} size="sm" />
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0 w-32">
          <Badge 
            variant="outline"
            className={cn(
              'w-full justify-center',
              statusType === 'pending' && 'bg-yellow-100 text-yellow-700 border-yellow-300',
              statusType === 'warning' && 'bg-gray-100 text-gray-700 border-gray-300',
              statusType === 'success' && 'bg-green-100 text-green-700 border-green-300',
              statusType === 'info' && 'bg-blue-100 text-blue-700 border-blue-300',
            )}
          >
            {statusLabel}
          </Badge>
        </div>

        {/* Category Badge */}
        <div className="flex-shrink-0 w-32">
          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 capitalize text-xs w-full justify-center">
            {ticket.category.replace('-', ' ')}
          </Badge>
        </div>

        {/* Subject */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 truncate" title={ticket.subject}>
            {ticket.subject}
          </h4>
        </div>

        {/* Client */}
        <div className="flex-shrink-0 w-48 hidden lg:block">
          {clientName ? (
            <div className="flex items-center gap-1.5 text-sm text-gray-600 truncate">
              <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="truncate" title={clientName}>{clientName}</span>
            </div>
          ) : (
            <span className="text-sm text-gray-400">N/A</span>
          )}
        </div>

        {/* Created Date */}
        <div className="flex-shrink-0 w-40 hidden md:block">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Clock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            <span className="whitespace-nowrap">{format(new Date(ticket.createdDate), 'yyyy-MM-dd')}</span>
          </div>
        </div>

        {/* Message Count */}
        <div className="flex-shrink-0 w-24 hidden sm:block">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <MessageSquare className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            <span>{messageCount} {messageCount === 1 ? 'msg' : 'msgs'}</span>
          </div>
        </div>

        {/* View Ticket Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={() => onViewTicket?.(ticket)}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium border-yellow-600 shadow-sm"
            size="sm"
          >
            View Ticket
          </Button>
        </div>
      </div>
    </div>
  );
}

// Slider Tabs Component
interface SliderTabsProps {
  tabs: { value: string; label: string; disabled?: boolean; badge?: React.ReactNode }[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

function SliderTabs({ tabs, activeTab, onTabChange }: SliderTabsProps) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setSliderStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className="relative mb-6 w-full">
      <div className="relative flex w-full border-b border-gray-200 bg-white rounded-t-lg">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            ref={(el) => {
              tabRefs.current[tab.value] = el;
            }}
            onClick={() => !tab.disabled && onTabChange(tab.value)}
            disabled={tab.disabled}
            className={cn(
              'relative flex-1 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap',
              'focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded-t-lg',
              'text-center justify-center',
              activeTab === tab.value
                ? 'text-gray-900'
                : tab.disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900',
            )}
          >
            <span className="flex items-center justify-center gap-2">
              {tab.label}
              {tab.badge}
            </span>
          </button>
        ))}
        {/* Slider Indicator */}
        <div
          className="absolute bottom-0 h-0.5 bg-yellow-500 rounded-full"
          style={sliderStyle}
        />
      </div>
    </div>
  );
}

export function HelpDesk() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [kbSearchQuery, setKbSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: [],
    priority: [],
    category: [],
  });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // New ticket form state
  const [newTicketForm, setNewTicketForm] = useState({
    subject: '',
    category: '',
    priority: '',
    description: '',
  });

  // Filter tickets
  const filteredTickets = useMemo(() => {
    let data = supportTickets;

    // Apply status filter (from dropdown - takes precedence over filter panel status)
    if (statusFilter !== 'all') {
      data = data.filter((ticket: SupportTicket) => ticket.status === statusFilter);
    } else if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      // Only apply filter panel status if dropdown is "all"
      data = data.filter((ticket: SupportTicket) => filters.status.includes(ticket.status));
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (ticket: SupportTicket) =>
          ticket.ticketId.toLowerCase().includes(query) ||
          ticket.subject.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query)
      );
    }

    // Apply other filters
    if (filters.priority && Array.isArray(filters.priority) && filters.priority.length > 0) {
      data = data.filter((ticket: SupportTicket) => filters.priority.includes(ticket.priority));
    }
    if (filters.category && Array.isArray(filters.category) && filters.category.length > 0) {
      data = data.filter((ticket: SupportTicket) => filters.category.includes(ticket.category));
    }

    return data;
  }, [searchQuery, filters, statusFilter]);

  // Paginated tickets
  const paginatedTickets = useMemo(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return {
      items: filteredTickets.slice(start, end),
      totalPages: Math.ceil(filteredTickets.length / itemsPerPage),
      totalItems: filteredTickets.length,
    };
  }, [filteredTickets, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, filters, statusFilter]);

  // Get filter options with counts
  const filterOptions = useMemo(() => {
    const statusCounts = supportTickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const priorityCounts = supportTickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const categoryCounts = supportTickets.reduce((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      statusCounts,
      priorityCounts,
      categoryCounts,
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
        { value: 'open', label: 'Open', count: filterOptions.statusCounts['open'] || 0 },
        { value: 'in-progress', label: 'In Progress', count: filterOptions.statusCounts['in-progress'] || 0 },
        { value: 'waiting-response', label: 'Waiting Response', count: filterOptions.statusCounts['waiting-response'] || 0 },
        { value: 'resolved', label: 'Resolved', count: filterOptions.statusCounts['resolved'] || 0 },
        { value: 'closed', label: 'Closed', count: filterOptions.statusCounts['closed'] || 0 },
      ],
    },
    {
      id: 'priority',
      label: 'Priority',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'low', label: 'Low', count: filterOptions.priorityCounts['low'] || 0 },
        { value: 'medium', label: 'Medium', count: filterOptions.priorityCounts['medium'] || 0 },
        { value: 'high', label: 'High', count: filterOptions.priorityCounts['high'] || 0 },
        { value: 'urgent', label: 'Urgent', count: filterOptions.priorityCounts['urgent'] || 0 },
      ],
    },
    {
      id: 'category',
      label: 'Category',
      type: 'checkbox',
      searchable: true,
      options: [
        { value: 'technical', label: 'Technical', count: filterOptions.categoryCounts['technical'] || 0 },
        { value: 'billing', label: 'Billing', count: filterOptions.categoryCounts['billing'] || 0 },
        { value: 'account', label: 'Account', count: filterOptions.categoryCounts['account'] || 0 },
        { value: 'feature-request', label: 'Feature Request', count: filterOptions.categoryCounts['feature-request'] || 0 },
        { value: 'bug', label: 'Bug', count: filterOptions.categoryCounts['bug'] || 0 },
        { value: 'other', label: 'Other', count: filterOptions.categoryCounts['other'] || 0 },
      ],
    },
  ], [filterOptions]);

  // Filter and group articles by category
  const articlesByCategory = useMemo(() => {
    let filtered = knowledgeBaseArticles;
    
    // Apply search filter
    if (kbSearchQuery) {
      const query = kbSearchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
      );
    }
    
    const grouped: Record<string, typeof knowledgeBaseArticles> = {};
    filtered.forEach(article => {
      if (!grouped[article.category]) {
        grouped[article.category] = [];
      }
      grouped[article.category].push(article);
    });
    return grouped;
  }, [kbSearchQuery]);

  const handleViewTicket = (ticket: SupportTicket) => {
    console.log('View ticket:', ticket.ticketId);
    // Navigate to ticket details page
  };

  const handleSubmitTicket = () => {
    console.log('Submit ticket:', newTicketForm);
    // Handle ticket submission
    // Reset form
    setNewTicketForm({
      subject: '',
      category: '',
      priority: '',
      description: '',
    });
  };

  const tabs = [
    { value: 'tickets', label: 'My Support Tickets' },
    { value: 'submit', label: 'Submit New Ticket' },
    { value: 'knowledge-base', label: 'Knowledge Base' },
    { 
      value: 'live-chat', 
      label: 'Live Chat',
      disabled: true,
      badge: <Badge variant="secondary" className="ml-2 text-xs">Coming Soon</Badge>
    },
  ];

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-4 lg:space-y-6 bg-gray-50 min-h-screen">
      {/* Welcome Message */}
      <div className="mb-2">
        <p className="text-sm text-gray-600">Manage support tickets, respond to customer inquiries, and access knowledge base articles.</p>
      </div>

      {/* Quick Contact and System Status Sections - Space Optimized */}
      <div className="space-y-4">
        {/* Titles - Outside the cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Quick Contact Title */}
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-yellow-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Quick Contact</h2>
          </div>

          {/* System Status Title */}
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-yellow-600" />
            <h2 className="text-2xl font-semibold text-gray-900">System Status</h2>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Quick Contact Card */}
          <Card>
            <CardContent className="pt-6 space-y-2.5">
              {/* Phone Support */}
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-yellow-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900">Phone Support</h4>
                  <p className="text-sm text-gray-700">(800) 123-4567</p>
                  <p className="text-xs text-gray-600">Mon-Fri, 8AM-6PM</p>
                </div>
              </div>

              {/* Email Support */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900">Email Support</h4>
                  <p className="text-sm text-gray-700">support@vendor.com</p>
                  <p className="text-xs text-gray-600">24 hrs response</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status Card */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              {/* Platform Status */}
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-sm font-medium text-gray-900">Platform</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-700">Operational</span>
                </div>
              </div>

              {/* Payments Status */}
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-sm font-medium text-gray-900">Payments</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-700">Operational</span>
                </div>
              </div>

              {/* API Status */}
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-sm font-medium text-gray-900">API</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-700">Operational</span>
                </div>
              </div>

              {/* Database Status */}
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-sm font-medium text-gray-900">Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-700">Operational</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Slider Tabs */}
      <SliderTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="relative overflow-hidden">
        {/* My Support Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-4 transition-opacity duration-300">
            {/* Filter and Search */}
            <div className="lg:hidden">
              <FilterSystem
                filters={filterConfig}
                filterValues={filters}
                onFilterChange={setFilters}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                resultCount={filteredTickets.length}
                totalCount={supportTickets.length}
                searchPlaceholder="Search tickets by ID, subject, description..."
              />
            </div>

            <div className="hidden lg:block space-y-4">
              <FilterSystem
                filters={filterConfig}
                filterValues={filters}
                onFilterChange={setFilters}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                resultCount={filteredTickets.length}
                totalCount={supportTickets.length}
                searchPlaceholder="Search tickets by ID, subject, description..."
                showSearchBar={true}
                showFilterBar={true}
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="flex items-center justify-between">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Tickets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tickets</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="waiting-response">Waiting Response</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterPanelOpen(true)}
                className="lg:hidden flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v) && (
                  <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {Object.values(filters).reduce((count, v) => count + (Array.isArray(v) ? v.length : v ? 1 : 0), 0)}
                  </span>
                )}
              </Button>
            </div>

            {/* Tickets List - Card Based */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  My Support Tickets
                  <Badge variant="warning" className="bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-100">
                    {filteredTickets.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paginatedTickets.items.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {paginatedTickets.items.map((ticket) => (
                        <SupportTicketCard
                          key={ticket.id}
                          ticket={ticket}
                          onViewTicket={handleViewTicket}
                        />
                      ))}
                    </div>
                    {/* Pagination */}
                    {paginatedTickets.totalPages > 1 && (
                      <InboxPagination
                        currentPage={currentPage}
                        totalPages={paginatedTickets.totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={paginatedTickets.totalItems}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(newItemsPerPage) => {
                          setItemsPerPage(newItemsPerPage);
                          setCurrentPage(0);
                        }}
                      />
                    )}
                  </>
                ) : (
                  <EmptyState
                    title="No tickets found"
                    description="Try adjusting your search or filters"
                    variant="no-results"
                  />
                )}
              </CardContent>
            </Card>

            {/* Slide-in Filter Panel */}
            <FilterPanelSlideIn
              filters={filterConfig}
              filterValues={filters}
              onFilterChange={setFilters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              resultCount={filteredTickets.length}
              totalCount={supportTickets.length}
              searchPlaceholder="Search tickets by ID, subject, description..."
              isOpen={isFilterPanelOpen}
              onClose={() => setIsFilterPanelOpen(false)}
            />
          </div>
        )}

        {/* Submit New Ticket Tab */}
        {activeTab === 'submit' && (
          <div className="space-y-4 transition-opacity duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Section */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Submit New Support Ticket</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Subject */}
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-gray-900">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your issue"
                        value={newTicketForm.subject}
                        onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                      />
                    </div>

                    {/* Category and Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-medium text-gray-900">
                          Category
                        </label>
                        <Select
                          value={newTicketForm.category}
                          onValueChange={(value) => setNewTicketForm({ ...newTicketForm, category: value })}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="billing">Billing</SelectItem>
                            <SelectItem value="account">Account</SelectItem>
                            <SelectItem value="feature-request">Feature Request</SelectItem>
                            <SelectItem value="bug">Bug</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="priority" className="text-sm font-medium text-gray-900">
                          Priority
                        </label>
                        <Select
                          value={newTicketForm.priority}
                          onValueChange={(value) => setNewTicketForm({ ...newTicketForm, priority: value })}
                        >
                          <SelectTrigger id="priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium text-gray-900">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        placeholder="Please provide detailed information about your issue..."
                        rows={6}
                        value={newTicketForm.description}
                        onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      onClick={handleSubmitTicket}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium"
                      size="lg"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Ticket
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Before Submitting Tips */}
              <div className="lg:col-span-1">
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center">
                        <Info className="w-5 h-5 text-yellow-700" />
                      </div>
                      <CardTitle className="text-gray-900">Before Submitting</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Check the knowledge base</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Include relevant details</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Attach screenshots if needed</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Base Tab */}
        {activeTab === 'knowledge-base' && (
          <div className="space-y-4 transition-opacity duration-300">
            <div className="hidden lg:grid lg:grid-cols-5 lg:gap-4">
              {/* Category Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <button
                      onClick={() => setKbSearchQuery('')}
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                    >
                      All Articles
                    </button>
                    {Object.keys(articlesByCategory).map((category) => (
                      <button
                        key={category}
                        onClick={() => setKbSearchQuery(category)}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                      >
                        {category} ({articlesByCategory[category].length})
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Content */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <SearchBar
                      placeholder="Search knowledge base articles..."
                      onSearch={setKbSearchQuery}
                      value={kbSearchQuery}
                      onChange={setKbSearchQuery}
                    />
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Knowledge Base</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(articlesByCategory).length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(articlesByCategory).map(([category, articles]) => (
                          <Accordion
                            key={category}
                            type="single"
                            items={[
                              {
                                id: category,
                                title: `${category} (${articles.length})`,
                                content: (
                                  <div className="space-y-3 pt-2">
                                    {articles.map((article) => (
                                      <div
                                        key={article.id}
                                        className="p-3 border border-border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                      >
                                        <h4 className="font-semibold text-sm text-gray-900 mb-1">
                                          {article.title}
                                        </h4>
                                        <p className="text-sm text-gray-600">{article.content}</p>
                                      </div>
                                    ))}
                                  </div>
                                ),
                              },
                            ]}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="No articles found"
                        description="Try adjusting your search"
                        variant="no-results"
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Mobile Layout */}
            <div className="lg:hidden space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <SearchBar
                    placeholder="Search knowledge base articles..."
                    onSearch={setKbSearchQuery}
                    value={kbSearchQuery}
                    onChange={setKbSearchQuery}
                  />
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Base</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(articlesByCategory).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(articlesByCategory).map(([category, articles]) => (
                        <Accordion
                          key={category}
                          type="single"
                          items={[
                            {
                              id: category,
                              title: `${category} (${articles.length})`,
                              content: (
                                <div className="space-y-3 pt-2">
                                  {articles.map((article) => (
                                    <div
                                      key={article.id}
                                      className="p-3 border border-border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                      <h4 className="font-semibold text-sm text-gray-900 mb-1">
                                        {article.title}
                                      </h4>
                                      <p className="text-sm text-gray-600">{article.content}</p>
                                    </div>
                                  ))}
                                </div>
                              ),
                            },
                          ]}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No articles found"
                      description="Try adjusting your search"
                      variant="no-results"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Live Chat Tab */}
        {activeTab === 'live-chat' && (
          <div className="space-y-4 transition-opacity duration-300">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EmptyState
                  title="Live chat coming soon"
                  description="Live chat support will be available in a future update"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
