import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui';
import { 
  FilterSystem,
  FilterPanelSlideIn,
  SearchBar,
  EmptyState,
  InboxPagination,
  SupportTicketCard,
  type FilterGroup,
  useTableFilters,
  useFilterOptions,
  usePagination,
} from '../shared';
import { 
  Filter,
  Phone,
  Mail,
  CheckCircle2,
  Info,
  Send,
  Activity,
  FileText,
  Paperclip,
  Upload,
  X,
  Eye,
  BookOpen,
  Tag,
  MessageSquare,
} from 'lucide-react';
import { supportTickets, knowledgeBaseArticles, workOrders, type SupportTicket } from '../../data';
import { cn } from '../ui/utils';

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
              'relative flex-1 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-t-lg',
              'text-center justify-center',
              activeTab === tab.value
                ? 'text-gray-900 font-semibold'
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
          className="absolute bottom-0 h-0.5 bg-primary rounded-full shadow-sm"
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

  // New ticket form state
  const [newTicketForm, setNewTicketForm] = useState({
    subject: '',
    category: '',
    priority: '',
    description: '',
    relatedWorkOrderId: '',
    contactEmail: '',
    contactPhone: '',
    attachments: [] as File[],
  });

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewTicketForm({
      ...newTicketForm,
      attachments: [...newTicketForm.attachments, ...files],
    });
  };

  // Drag and drop handlers
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      return validTypes.includes(fileExtension);
    });
    
    setNewTicketForm({
      ...newTicketForm,
      attachments: [...newTicketForm.attachments, ...validFiles],
    });
  };

  // Remove file handler
  const handleRemoveFile = (index: number) => {
    setNewTicketForm({
      ...newTicketForm,
      attachments: newTicketForm.attachments.filter((_, i) => i !== index),
    });
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Get filter options with counts
  const { counts: filterCounts } = useFilterOptions(supportTickets, {
    status: (ticket) => ticket.status,
    priority: (ticket) => ticket.priority,
    category: (ticket) => ticket.category,
  });

  // Filter tickets using useTableFilters hook
  // Note: statusFilter from dropdown takes precedence over filter panel status
  const baseFilteredTickets = useTableFilters({
    data: supportTickets,
    searchQuery,
    filters: {
      priority: filters.priority,
      category: filters.category,
      // Only apply filter panel status if dropdown is "all"
      status: statusFilter === 'all' ? filters.status : [],
    },
    searchFields: (ticket) => [
      ticket.ticketId,
      ticket.subject,
      ticket.description,
    ],
    filterFields: {
      status: (ticket) => ticket.status,
      priority: (ticket) => ticket.priority,
      category: (ticket) => ticket.category,
    },
  });

  // Apply status filter from dropdown if not "all"
  const filteredTickets = useMemo(() => {
    if (statusFilter !== 'all') {
      return baseFilteredTickets.filter((ticket: SupportTicket) => ticket.status === statusFilter);
    }
    return baseFilteredTickets;
  }, [baseFilteredTickets, statusFilter]);

  // Use pagination hook
  const {
    page: currentPage,
    setPage: setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    paginatedData: paginatedTicketsItems,
    totalPages: paginatedTicketsTotalPages,
    totalItems: paginatedTicketsTotalItems,
  } = usePagination(filteredTickets, {
    itemsPerPage: 10,
    initialPage: 0,
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, filters, statusFilter, setCurrentPage]);

  // Filter configuration with dynamic counts
  const filterConfig: FilterGroup[] = useMemo(() => [
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'open', label: 'Open', count: filterCounts.status?.['open'] || 0 },
        { value: 'in-progress', label: 'In Progress', count: filterCounts.status?.['in-progress'] || 0 },
        { value: 'waiting-response', label: 'Waiting Response', count: filterCounts.status?.['waiting-response'] || 0 },
        { value: 'resolved', label: 'Resolved', count: filterCounts.status?.['resolved'] || 0 },
        { value: 'closed', label: 'Closed', count: filterCounts.status?.['closed'] || 0 },
      ],
    },
    {
      id: 'priority',
      label: 'Priority',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'low', label: 'Low', count: filterCounts.priority?.['low'] || 0 },
        { value: 'medium', label: 'Medium', count: filterCounts.priority?.['medium'] || 0 },
        { value: 'high', label: 'High', count: filterCounts.priority?.['high'] || 0 },
        { value: 'urgent', label: 'Urgent', count: filterCounts.priority?.['urgent'] || 0 },
      ],
    },
    {
      id: 'category',
      label: 'Category',
      type: 'checkbox',
      searchable: true,
      options: [
        { value: 'technical', label: 'Technical', count: filterCounts.category?.['technical'] || 0 },
        { value: 'billing', label: 'Billing', count: filterCounts.category?.['billing'] || 0 },
        { value: 'account', label: 'Account', count: filterCounts.category?.['account'] || 0 },
        { value: 'feature-request', label: 'Feature Request', count: filterCounts.category?.['feature-request'] || 0 },
        { value: 'bug', label: 'Bug', count: filterCounts.category?.['bug'] || 0 },
        { value: 'other', label: 'Other', count: filterCounts.category?.['other'] || 0 },
      ],
    },
  ], [filterCounts]);

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
      relatedWorkOrderId: '',
      contactEmail: '',
      contactPhone: '',
      attachments: [],
    });
  };

  // Get available work orders for dropdown
  const availableWorkOrders = useMemo(() => {
    return workOrders.map(wo => ({
      value: wo.workOrderId,
      label: `${wo.workOrderId} - ${wo.clientName}`,
    }));
  }, []);

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
        <p className="text-sm text-gray-600 font-medium leading-relaxed">Manage support tickets, respond to customer inquiries, and access knowledge base articles.</p>
      </div>

      {/* Quick Contact and System Status Sections - Space Optimized */}
      <div className="space-y-4">
        {/* Titles - Outside the cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Quick Contact Title */}
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-yellow-600" />
            <h2 className="text-2xl font-display font-semibold text-gray-900 tracking-tight">Quick Contact</h2>
          </div>

          {/* System Status Title */}
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-yellow-600" />
            <h2 className="text-2xl font-display font-semibold text-gray-900 tracking-tight">System Status</h2>
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
                  <h4 className="font-display font-semibold text-sm text-gray-900 tracking-tight">Phone Support</h4>
                  <p className="text-sm text-gray-900 font-medium">(800) 123-4567</p>
                  <p className="text-xs text-gray-600 font-medium">Mon-Fri, 8AM-6PM</p>
                </div>
              </div>

              {/* Email Support */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-semibold text-sm text-gray-900 tracking-tight">Email Support</h4>
                  <p className="text-sm text-gray-900 font-medium">support@vendor.com</p>
                  <p className="text-xs text-gray-600 font-medium">24 hrs response</p>
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
                  <span className="text-sm text-gray-600">Operational</span>
                </div>
              </div>

              {/* Payments Status */}
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-sm font-medium text-gray-900">Payments</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-600">Operational</span>
                </div>
              </div>

              {/* API Status */}
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-sm font-medium text-gray-900">API</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-600">Operational</span>
                </div>
              </div>

              {/* Database Status */}
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-sm font-medium text-gray-900">Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-600">Operational</span>
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

            {/* Tickets List */}
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-display font-semibold text-gray-900 tracking-tight">
                  My Support Tickets
                  </h2>
                  <Badge variant="warning" className="font-semibold">
                    {filteredTickets.length}
                  </Badge>
                </div>
              </div>

              {/* Tickets */}
                {paginatedTicketsItems.length > 0 ? (
                  <>
                  <div className="space-y-4">
                      {paginatedTicketsItems.map((ticket) => (
                        <SupportTicketCard
                          key={ticket.id}
                          ticket={ticket}
                          onViewTicket={handleViewTicket}
                        />
                      ))}
                    </div>
                    {/* Pagination */}
                    {paginatedTicketsTotalPages > 1 && (
                    <div className="pt-4">
                      <InboxPagination
                        currentPage={currentPage}
                        totalPages={paginatedTicketsTotalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={paginatedTicketsTotalItems}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(newItemsPerPage) => {
                          setItemsPerPage(newItemsPerPage);
                          setCurrentPage(0);
                        }}
                      />
                    </div>
                    )}
                  </>
                ) : (
                <Card>
                  <CardContent className="py-12">
                  <EmptyState
                    title="No tickets found"
                    description="Try adjusting your search or filters"
                    variant="no-results"
                  />
              </CardContent>
            </Card>
              )}
            </div>

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
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-xl">Submit New Support Ticket</CardTitle>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Fill out the form below to create a new support ticket. We'll respond as soon as possible.</p>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Subject */}
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your issue"
                        value={newTicketForm.subject}
                        onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                        className="transition-all duration-300"
                      />
                      <p className="text-xs text-gray-500">Provide a clear, concise summary of your issue</p>
                    </div>

                    {/* Category and Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={newTicketForm.category || undefined}
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
                        <label htmlFor="priority" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          Priority <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={newTicketForm.priority || undefined}
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

                    {/* Related Work Order */}
                    <div className="space-y-2">
                      <label htmlFor="relatedWorkOrder" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Related Work Order <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                      </label>
                      <Select
                        value={newTicketForm.relatedWorkOrderId ? newTicketForm.relatedWorkOrderId : 'none'}
                        onValueChange={(value) => setNewTicketForm({ ...newTicketForm, relatedWorkOrderId: value === 'none' ? '' : value })}
                      >
                        <SelectTrigger id="relatedWorkOrder">
                          <SelectValue placeholder="Select work order (if applicable)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {availableWorkOrders.map((wo) => (
                            <SelectItem key={wo.value} value={wo.value}>
                              {wo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Link this ticket to a specific work order</p>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="contactEmail" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          Contact Email <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                        </label>
                        <Input
                          id="contactEmail"
                          type="email"
                          placeholder="your.email@example.com"
                          value={newTicketForm.contactEmail}
                          onChange={(e) => setNewTicketForm({ ...newTicketForm, contactEmail: e.target.value })}
                          className="transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="contactPhone" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          Contact Phone <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                        </label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={newTicketForm.contactPhone}
                          onChange={(e) => setNewTicketForm({ ...newTicketForm, contactPhone: e.target.value })}
                          className="transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        id="description"
                        placeholder="Please provide detailed information about your issue. Include steps to reproduce, error messages, or any other relevant details..."
                        rows={6}
                        value={newTicketForm.description}
                        onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                        className="transition-all duration-300"
                      />
                      <p className="text-xs text-gray-500">The more details you provide, the faster we can help you</p>
                    </div>

                    {/* File Attachments */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        Attachments <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                      </label>
                      <div
                        className={cn(
                          "border-2 border-dashed rounded-lg p-6 transition-all duration-300",
                          isDragging
                            ? "border-primary bg-primary/5"
                            : "border-gray-300 hover:border-primary/50 bg-gray-50/50"
                        )}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                            isDragging ? "bg-primary/20 scale-110" : "bg-primary/10"
                          )}>
                            <Upload className={cn(
                              "w-6 h-6 transition-colors duration-300",
                              isDragging ? "text-primary scale-110" : "text-primary"
                            )} />
                          </div>
                          <div className="text-center">
                            <label htmlFor="file-upload" className="cursor-pointer">
                              <span className="text-sm font-medium text-primary hover:text-primary-hover">
                                Click to upload
                              </span>
                              <span className="text-sm text-gray-600"> or drag and drop</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, PNG, JPG up to 10MB</p>
                          </div>
                          <input
                            id="file-upload"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          />
                        </div>
                      </div>
                      
                      {/* File List */}
                      {newTicketForm.attachments.length > 0 && (
                        <div className="space-y-2 mt-3">
                          {newTicketForm.attachments.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-300"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFile(index)}
                                className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                    <Button
                      onClick={handleSubmitTicket}
                        className="w-full bg-primary hover:bg-primary-hover text-gray-900 font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                      size="lg"
                        disabled={!newTicketForm.subject || !newTicketForm.category || !newTicketForm.priority || !newTicketForm.description}
                    >
                        <Send className="w-5 h-5 mr-2" />
                      Submit Ticket
                    </Button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Required fields are marked with <span className="text-red-500">*</span>
                      </p>
                    </div>
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
                      <CardTitle className="text-gray-900 font-display font-semibold tracking-tight">Before Submitting</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">Check the knowledge base</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">Include relevant details</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">Attach screenshots if needed</span>
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
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Knowledge Base
                </h2>
                <p className="text-sm text-gray-600 mt-1">Browse articles and find answers to common questions</p>
              </div>
              <div className="flex-1 max-w-md">
                <SearchBar
                  placeholder="Search articles..."
                  onSearch={setKbSearchQuery}
                  value={kbSearchQuery}
                  onChange={setKbSearchQuery}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Category Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      <CardTitle className="text-base font-display font-semibold text-gray-900 tracking-tight">Categories</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <button
                      onClick={() => setKbSearchQuery('')}
                      className={cn(
                        "w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all duration-300 flex items-center justify-between",
                        !kbSearchQuery 
                          ? 'bg-primary/10 text-gray-900 font-semibold border border-primary/20' 
                          : 'hover:bg-gray-100 text-gray-700'
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                      All Articles
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {Object.values(articlesByCategory).reduce((sum, articles) => sum + articles.length, 0)}
                      </Badge>
                    </button>
                    {Object.keys(articlesByCategory).map((category) => (
                      <button
                        key={category}
                        onClick={() => setKbSearchQuery(category)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all duration-300 flex items-center justify-between capitalize",
                          kbSearchQuery === category
                            ? 'bg-primary/10 text-gray-900 font-semibold border border-primary/20'
                            : 'hover:bg-gray-100 text-gray-700'
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {category}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {articlesByCategory[category].length}
                        </Badge>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-4">
                    {Object.keys(articlesByCategory).length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(articlesByCategory).map(([category, articles]) => (
                      <div key={category}>
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-lg font-display font-semibold text-gray-900 capitalize">{category}</h3>
                          <Badge variant="outline" className="text-xs">
                            {articles.length} {articles.length === 1 ? 'article' : 'articles'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {articles.map((article) => (
                            <Card
                                        key={article.id}
                              className="hover:shadow-md transition-all duration-300 cursor-pointer group"
                            >
                              <CardContent className="p-5">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                                    <FileText className="w-5 h-5 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-display font-semibold text-base text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                                          {article.title}
                                        </h4>
                                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                                      {article.content}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                      <div className="flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Article</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Tag className="w-3.5 h-3.5" />
                                        <span className="capitalize">{article.category}</span>
                                  </div>
                      </div>
              </div>
            </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full mt-2 text-primary hover:text-primary-hover hover:bg-primary/10"
                                >
                                  Read Article
                                  <Info className="w-4 h-4 ml-2" />
                                </Button>
                              </CardContent>
                            </Card>
                                  ))}
                                </div>
                      </div>
                      ))}
                    </div>
                  ) : (
                  <Card>
                    <CardContent className="py-12">
                    <EmptyState
                      title="No articles found"
                        description="Try adjusting your search or browse by category"
                      variant="no-results"
                    />
                </CardContent>
              </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Live Chat Tab */}
        {activeTab === 'live-chat' && (
          <div className="space-y-4 transition-opacity duration-300">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-display font-semibold text-gray-900 tracking-tight">
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
