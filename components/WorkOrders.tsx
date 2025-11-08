import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from './ui';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { 
  StatCard, 
  FilterSystem,
  FilterPanelSlideIn,
  DataTable,
  StatusBadge,
  PriorityBadge,
  ExportButton,
  EmptyState,
  TruncatedText,
  ColumnVisibilityToggle,
  InboxWorkOrderCard,
  InboxPagination,
  type FilterGroup,
} from './shared';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Filter,
  Mail
} from 'lucide-react';
import { workOrders as initialWorkOrders, type WorkOrder } from '../data';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import currency from 'currency.js';

export function WorkOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: [],
    priority: [],
    serviceCategory: [],
  });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [tableInstance, setTableInstance] = useState<any>(null);
  const [activeInboxTab, setActiveInboxTab] = useState('awaiting-response');
  
  // Work orders state management (for updating status)
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  
  // Pagination state for each tab
  const [awaitingResponsePage, setAwaitingResponsePage] = useState(0);
  const [myWorkOrdersPage, setMyWorkOrdersPage] = useState(0);
  const [rejectedPage, setRejectedPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Stable callback for table ready
  const handleTableReady = useCallback((table: any) => {
    setTableInstance(table);
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    let data = workOrders;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (wo) =>
          wo.workOrderId.toLowerCase().includes(query) ||
          wo.propertyAddress.toLowerCase().includes(query) ||
          wo.clientName.toLowerCase().includes(query) ||
          wo.serviceDescription.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      data = data.filter((wo: WorkOrder) => filters.status.includes(wo.status));
    }
    if (filters.priority && Array.isArray(filters.priority) && filters.priority.length > 0) {
      data = data.filter((wo: WorkOrder) => filters.priority.includes(wo.priority));
    }
    if (filters.serviceCategory && Array.isArray(filters.serviceCategory) && filters.serviceCategory.length > 0) {
      data = data.filter((wo: WorkOrder) => filters.serviceCategory.includes(wo.serviceCategory));
    }

    return data;
  }, [searchQuery, filters]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const pending = workOrders.filter((wo: WorkOrder) => wo.status === 'pending' || wo.status === 'assigned').length;
    const inProgress = workOrders.filter((wo: WorkOrder) => wo.status === 'in-progress').length;
    const completed = workOrders.filter((wo: WorkOrder) => wo.status === 'completed').length;
    const overdue = workOrders.filter((wo: WorkOrder) => {
      if (wo.status === 'completed') return false;
      return new Date(wo.dueDate) < new Date();
    }).length;

    return { pending, inProgress, completed, overdue };
  }, []);

  // Inbox categorization
  const inboxData = useMemo(() => {
    const awaitingResponse = workOrders.filter((wo: WorkOrder) => wo.status === 'pending');
    const myWorkOrders = workOrders.filter((wo: WorkOrder) => 
      wo.status === 'assigned' || wo.status === 'in-progress' || (wo.assignedTechnician && wo.status !== 'completed' && wo.status !== 'cancelled')
    );
    const rejected = workOrders.filter((wo: WorkOrder) => wo.status === 'cancelled');

    return {
      awaitingResponse,
      myWorkOrders,
      rejected,
    };
  }, [workOrders]);

  // Paginated data for each tab
  const paginatedInboxData = useMemo(() => {
    const getPaginated = (data: WorkOrder[], page: number, perPage: number) => {
      const start = page * perPage;
      const end = start + perPage;
      return {
        items: data.slice(start, end),
        totalPages: Math.ceil(data.length / perPage),
        totalItems: data.length,
      };
    };

    return {
      awaitingResponse: getPaginated(inboxData.awaitingResponse, awaitingResponsePage, itemsPerPage),
      myWorkOrders: getPaginated(inboxData.myWorkOrders, myWorkOrdersPage, itemsPerPage),
      rejected: getPaginated(inboxData.rejected, rejectedPage, itemsPerPage),
    };
  }, [inboxData, awaitingResponsePage, myWorkOrdersPage, rejectedPage, itemsPerPage]);

  // Action handlers
  const handleMoveToInProgress = useCallback((workOrderId: string) => {
    setWorkOrders(prev => prev.map(wo => 
      wo.id === workOrderId 
        ? { ...wo, status: 'in-progress' as const, assignedTechnician: wo.assignedTechnician || 'Current User' }
        : wo
    ));
  }, []);

  const handleMoveToRejected = useCallback((workOrderId: string) => {
    setWorkOrders(prev => prev.map(wo => 
      wo.id === workOrderId 
        ? { ...wo, status: 'cancelled' as const }
        : wo
    ));
  }, []);

  const handleArchive = useCallback((workOrderId: string) => {
    setWorkOrders(prev => prev.filter(wo => wo.id !== workOrderId));
  }, []);

  // Handle items per page change - reset to first page
  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setAwaitingResponsePage(0);
    setMyWorkOrdersPage(0);
    setRejectedPage(0);
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((tab: string, page: number) => {
    if (tab === 'awaiting-response') setAwaitingResponsePage(page);
    else if (tab === 'my-work-orders') setMyWorkOrdersPage(page);
    else if (tab === 'rejected') setRejectedPage(page);
  }, []);

  // Reset pagination when switching tabs
  const handleTabChange = useCallback((value: string) => {
    setActiveInboxTab(value);
    // Optionally reset to first page when switching tabs
    // setAwaitingResponsePage(0);
    // setMyWorkOrdersPage(0);
    // setRejectedPage(0);
  }, []);

  // Adjust pagination when items are removed/moved
  useEffect(() => {
    // Adjust awaiting response page
    const awaitingTotalPages = Math.ceil(inboxData.awaitingResponse.length / itemsPerPage);
    if (awaitingTotalPages > 0 && awaitingResponsePage >= awaitingTotalPages) {
      setAwaitingResponsePage(awaitingTotalPages - 1);
    }

    // Adjust my work orders page
    const myWorkOrdersTotalPages = Math.ceil(inboxData.myWorkOrders.length / itemsPerPage);
    if (myWorkOrdersTotalPages > 0 && myWorkOrdersPage >= myWorkOrdersTotalPages) {
      setMyWorkOrdersPage(myWorkOrdersTotalPages - 1);
    }

    // Adjust rejected page
    const rejectedTotalPages = Math.ceil(inboxData.rejected.length / itemsPerPage);
    if (rejectedTotalPages > 0 && rejectedPage >= rejectedTotalPages) {
      setRejectedPage(rejectedTotalPages - 1);
    }
  }, [inboxData, itemsPerPage, awaitingResponsePage, myWorkOrdersPage, rejectedPage]);

  // Define columns
  const columns: ColumnDef<WorkOrder>[] = useMemo(() => [
    {
      accessorKey: 'workOrderId',
      header: 'Work Order ID',
      meta: { essential: true },
      cell: ({ row }) => (
        <span className="font-semibold text-sm font-mono">{row.original.workOrderId}</span>
      ),
    },
    {
      accessorKey: 'propertyAddress',
      header: 'Property Address',
      meta: { essential: false },
      cell: ({ row }) => (
        <div>
          <TruncatedText 
            text={row.original.propertyAddress} 
            maxLength={40}
            className="text-sm font-medium text-gray-900"
          />
          <p className="text-xs text-gray-500">{row.original.serviceCategory}</p>
        </div>
      ),
    },
    {
      accessorKey: 'clientName',
      header: 'Client',
      meta: { essential: false },
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.clientName}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { headerAlign: 'center', essential: true },
      cell: ({ row }) => {
        const status = row.original.status;
        const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending', label: string }> = {
          'completed': { type: 'success', label: 'Completed' },
          'in-progress': { type: 'info', label: 'In Progress' },
          'assigned': { type: 'info', label: 'Assigned' },
          'pending': { type: 'pending', label: 'Pending' },
          'cancelled': { type: 'error', label: 'Cancelled' },
        };
        const mapped = statusMap[status] || { type: 'pending' as const, label: status };
        return <div className="flex justify-center"><StatusBadge status={mapped.type} label={mapped.label} /></div>;
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      meta: { headerAlign: 'center', essential: false },
      cell: ({ row }) => <div className="flex justify-center"><PriorityBadge priority={row.original.priority} /></div>,
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      meta: { essential: false },
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {format(new Date(row.original.dueDate), 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'estimatedCost',
      header: 'Estimated Cost',
      meta: { essential: false },
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {currency(row.original.estimatedCost).format()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      meta: { essential: true },
      cell: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            View
          </Button>
        </div>
      ),
    },
  ], []);

  // Filter configuration
  const filterConfig: FilterGroup[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'assigned', label: 'Assigned' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    {
      id: 'priority',
      label: 'Priority',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'urgent', label: 'Urgent' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
    },
    {
      id: 'serviceCategory',
      label: 'Service Category',
      type: 'checkbox',
      searchable: true,
      options: [
        { value: 'plumbing', label: 'Plumbing' },
        { value: 'hvac', label: 'HVAC' },
        { value: 'electrical', label: 'Electrical' },
        { value: 'carpentry', label: 'Carpentry' },
        { value: 'painting', label: 'Painting' },
        { value: 'landscaping', label: 'Landscaping' },
        { value: 'appliance', label: 'Appliance' },
        { value: 'general', label: 'General' },
      ],
    },
  ];

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-4 lg:space-y-6 bg-gray-50 min-h-screen">
      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending"
          value={summaryStats.pending}
          icon={Clock}
        />
        <StatCard
          title="In Progress"
          value={summaryStats.inProgress}
          icon={ClipboardList}
        />
        <StatCard
          title="Completed"
          value={summaryStats.completed}
          icon={CheckCircle}
        />
        <StatCard
          title="Overdue"
          value={summaryStats.overdue}
          icon={AlertCircle}
        />
      </div>

      {/* Inbox Section */}
      <div className="space-y-4">
        {/* Inbox Title - Outside the card */}
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-yellow-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Inbox</h2>
        </div>

        {/* Inbox Tabs and Content */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeInboxTab} onValueChange={handleTabChange} className="w-full">
              {/* Tab Headers - Slider Design */}
              <div className="bg-gray-100 border-b border-gray-200 rounded-t-lg p-1.5">
                <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto gap-1.5">
                  <TabsTrigger
                    value="awaiting-response"
                    className="text-gray-600 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 rounded-md px-4 py-2.5 font-medium transition-all duration-200 flex items-center justify-center gap-2 border-0"
                  >
                    <span className="whitespace-nowrap">Awaiting Response</span>
                    <Badge
                      className={`h-5 min-w-[20px] px-1 rounded-full text-xs font-semibold flex items-center justify-center border-0 ${
                        activeInboxTab === 'awaiting-response'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {inboxData.awaitingResponse.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="my-work-orders"
                    className="text-gray-600 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 rounded-md px-4 py-2.5 font-medium transition-all duration-200 flex items-center justify-center gap-2 border-0"
                  >
                    <span className="whitespace-nowrap">My Work Orders</span>
                    <Badge
                      className={`h-5 min-w-[20px] px-1 rounded-full text-xs font-semibold flex items-center justify-center border-0 ${
                        activeInboxTab === 'my-work-orders'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {inboxData.myWorkOrders.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="rejected"
                    className="text-gray-600 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 rounded-md px-4 py-2.5 font-medium transition-all duration-200 flex items-center justify-center gap-2 border-0"
                  >
                    <span className="whitespace-nowrap">Rejected</span>
                    <Badge
                      className={`h-5 min-w-[20px] px-1 rounded-full text-xs font-semibold flex items-center justify-center border-0 ${
                        activeInboxTab === 'rejected'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {inboxData.rejected.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <div className="p-4">
                <TabsContent value="awaiting-response" className="mt-0 space-y-4">
                  {paginatedInboxData.awaitingResponse.items.length > 0 ? (
                    <>
                      <div className="space-y-3">
                        {paginatedInboxData.awaitingResponse.items.map((wo: WorkOrder) => (
                          <InboxWorkOrderCard
                            key={wo.id}
                            workOrder={wo}
                            onViewDetails={() => console.log('Navigate to work order:', wo.id)}
                            onAction={() => handleMoveToInProgress(wo.id)}
                            actionLabel="Move to In Progress"
                            actionVariant="default"
                          />
                        ))}
                      </div>
                      {/* Pagination Controls */}
                      <InboxPagination
                        currentPage={awaitingResponsePage}
                        totalPages={paginatedInboxData.awaitingResponse.totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={paginatedInboxData.awaitingResponse.totalItems}
                        onPageChange={(page) => handlePageChange('awaiting-response', page)}
                          onItemsPerPageChange={handleItemsPerPageChange}
                      />
                    </>
                  ) : (
                    <EmptyState
                      title="No work orders awaiting response"
                      description="All work orders have been responded to"
                      variant="empty"
                    />
                  )}
                </TabsContent>

                <TabsContent value="my-work-orders" className="mt-0 space-y-4">
                  {paginatedInboxData.myWorkOrders.items.length > 0 ? (
                    <>
                      <div className="space-y-3">
                        {paginatedInboxData.myWorkOrders.items.map((wo: WorkOrder) => (
                          <InboxWorkOrderCard
                            key={wo.id}
                            workOrder={wo}
                            onViewDetails={() => console.log('Navigate to work order:', wo.id)}
                            onAction={() => handleMoveToRejected(wo.id)}
                            actionLabel="Move to Rejected"
                            actionVariant="destructive"
                          />
                        ))}
                      </div>
                      {/* Pagination Controls */}
                      <InboxPagination
                        currentPage={myWorkOrdersPage}
                        totalPages={paginatedInboxData.myWorkOrders.totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={paginatedInboxData.myWorkOrders.totalItems}
                        onPageChange={(page) => handlePageChange('my-work-orders', page)}
                          onItemsPerPageChange={handleItemsPerPageChange}
                      />
                    </>
                  ) : (
                    <EmptyState
                      title="No work orders assigned to you"
                      description="Work orders assigned to you will appear here"
                      variant="empty"
                    />
                  )}
                </TabsContent>

                <TabsContent value="rejected" className="mt-0 space-y-4">
                  {paginatedInboxData.rejected.items.length > 0 ? (
                    <>
                      <div className="space-y-3">
                        {paginatedInboxData.rejected.items.map((wo: WorkOrder) => (
                          <InboxWorkOrderCard
                            key={wo.id}
                            workOrder={wo}
                            onViewDetails={() => console.log('Navigate to work order:', wo.id)}
                            onAction={() => handleArchive(wo.id)}
                            actionLabel="Archive"
                            actionVariant="outline"
                          />
                        ))}
                      </div>
                      {/* Pagination Controls */}
                      <InboxPagination
                        currentPage={rejectedPage}
                        totalPages={paginatedInboxData.rejected.totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={paginatedInboxData.rejected.totalItems}
                        onPageChange={(page) => handlePageChange('rejected', page)}
                          onItemsPerPageChange={handleItemsPerPageChange}
                      />
                    </>
                  ) : (
                    <EmptyState
                      title="No rejected work orders"
                      description="Rejected work orders will appear here"
                      variant="empty"
                    />
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Filter System - Mobile */}
      <div className="lg:hidden">
        <FilterSystem
          filters={filterConfig}
          filterValues={filters}
          onFilterChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={filteredData.length}
          totalCount={workOrders.length}
          searchPlaceholder="Search work orders by ID, address, client name..."
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block space-y-4 lg:space-y-6">
          {/* Search Bar and Filter Bar for Desktop */}
          <div className="space-y-3">
            <FilterSystem
              filters={filterConfig}
              filterValues={filters}
              onFilterChange={setFilters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              resultCount={filteredData.length}
              totalCount={workOrders.length}
              searchPlaceholder="Search work orders by ID, address, client name..."
              showSearchBar={true}
              showFilterBar={true}
            />
          </div>

          {/* Data Table */}
          <Card>
            <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Work Orders
                <Badge variant="warning" className="bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-100">
                  {filteredData.length}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterPanelOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v) && (
                    <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {Object.values(filters).reduce((count, v) => count + (Array.isArray(v) ? v.length : v ? 1 : 0), 0)}
                    </span>
                  )}
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Work Order
                </Button>
                <ExportButton
                  data={filteredData}
                  filename="work-orders"
                />
                {tableInstance && (
                  <ColumnVisibilityToggle table={tableInstance} />
                )}
              </div>
            </div>
            </CardHeader>
            <CardContent>
              {filteredData.length > 0 ? (
                <DataTable
                  data={filteredData}
                  columns={columns}
                  pagination
                  pageSize={10}
                  searchable={false}
                  storageKey="work-orders"
                  onTableReady={handleTableReady}
                />
              ) : (
                <EmptyState
                  title={searchQuery || Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v) ? "No work orders found" : "No work orders yet"}
                  description={searchQuery || Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v) ? "Try adjusting your search or filters" : "Get started by creating your first work order"}
                  variant={searchQuery || Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v) ? "no-results" : "empty"}
                  action={!searchQuery && !Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v) ? {
                    label: "Create First Work Order",
                    onClick: () => {
                      // Handle create work order action
                      console.log("Create work order clicked");
                    }
                  } : undefined}
                />
              )}
            </CardContent>
          </Card>
      </div>

      {/* Mobile Data Table */}
      <div className="lg:hidden mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Work Orders ({filteredData.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredData.length > 0 ? (
              <DataTable
                data={filteredData}
                columns={columns}
                pagination
                pageSize={10}
                searchable={false}
              />
            ) : (
              <EmptyState
                title={searchQuery || Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v) ? "No work orders found" : "No work orders yet"}
                description={searchQuery || Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v) ? "Try adjusting your search or filters" : "Get started by creating your first work order"}
                variant={searchQuery || Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v) ? "no-results" : "empty"}
                action={!searchQuery && !Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v) ? {
                  label: "Create First Work Order",
                  onClick: () => {
                    // Handle create work order action
                    console.log("Create work order clicked");
                  }
                } : undefined}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Slide-in Filter Panel */}
      <FilterPanelSlideIn
        filters={filterConfig}
        filterValues={filters}
        onFilterChange={setFilters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={filteredData.length}
        totalCount={workOrders.length}
        searchPlaceholder="Search work orders by ID, address, client name..."
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
      />
    </div>
  );
}

