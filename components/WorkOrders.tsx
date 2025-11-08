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
  TableActions,
  type FilterGroup,
  type TableAction,
} from './shared';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Mail,
  Eye,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import { workOrders as initialWorkOrders, type WorkOrder } from '../data';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import currency from 'currency.js';
import { DateRange } from 'react-day-picker';

export function WorkOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: [],
    priority: [],
    serviceCategory: [],
    propertyType: [],
    client: [],
    assignedTechnician: [],
  });
  const [requestDateRange, setRequestDateRange] = useState<DateRange | undefined>();
  const [dueDateRange, setDueDateRange] = useState<DateRange | undefined>();
  const [costRange, setCostRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [tableInstance, setTableInstance] = useState<any>(null);
  const [activeInboxTab, setActiveInboxTab] = useState('awaiting-response');
  
  // Work orders state management (for updating status)
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  
  // Pagination state for each tab
  const [awaitingResponsePage, setAwaitingResponsePage] = useState(0);
  const [myWorkOrdersPage, setMyWorkOrdersPage] = useState(0);
  const [rejectedPage, setRejectedPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Stable callback for table ready
  const handleTableReady = useCallback((table: any) => {
    setTableInstance(table);
  }, []);

  // Get unique values for filter options with counts
  const filterOptions = useMemo(() => {
    const clients = Array.from(new Set(workOrders.map(wo => wo.clientName))).sort();
    const technicians = Array.from(new Set(workOrders.map(wo => wo.assignedTechnician).filter((tech): tech is string => Boolean(tech)))).sort();
    
    // Calculate counts for each filter option
    const statusCounts = workOrders.reduce((acc, wo) => {
      acc[wo.status] = (acc[wo.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const priorityCounts = workOrders.reduce((acc, wo) => {
      acc[wo.priority] = (acc[wo.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const categoryCounts = workOrders.reduce((acc, wo) => {
      acc[wo.serviceCategory] = (acc[wo.serviceCategory] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const propertyTypeCounts = workOrders.reduce((acc, wo) => {
      acc[wo.propertyType] = (acc[wo.propertyType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const clientCounts = workOrders.reduce((acc, wo) => {
      acc[wo.clientName] = (acc[wo.clientName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const technicianCounts = workOrders.reduce((acc, wo) => {
      if (wo.assignedTechnician) {
        acc[wo.assignedTechnician] = (acc[wo.assignedTechnician] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return {
      clients,
      technicians,
      statusCounts,
      priorityCounts,
      categoryCounts,
      propertyTypeCounts,
      clientCounts,
      technicianCounts,
    };
  }, [workOrders]);

  // Get min and max costs for range filter
  const costStats = useMemo(() => {
    const costs = workOrders.map(wo => wo.estimatedCost);
    return {
      min: Math.min(...costs),
      max: Math.max(...costs),
    };
  }, [workOrders]);

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
    if (filters.propertyType && Array.isArray(filters.propertyType) && filters.propertyType.length > 0) {
      data = data.filter((wo: WorkOrder) => filters.propertyType.includes(wo.propertyType));
    }
    if (filters.client && Array.isArray(filters.client) && filters.client.length > 0) {
      data = data.filter((wo: WorkOrder) => filters.client.includes(wo.clientName));
    }
    if (filters.assignedTechnician && Array.isArray(filters.assignedTechnician) && filters.assignedTechnician.length > 0) {
      data = data.filter((wo: WorkOrder) => wo.assignedTechnician && filters.assignedTechnician.includes(wo.assignedTechnician));
    }

    // Apply date range filters
    if (requestDateRange?.from) {
      data = data.filter((wo: WorkOrder) => {
        const requestDate = new Date(wo.requestDate);
        const from = requestDateRange.from!;
        const to = requestDateRange.to || requestDateRange.from!;
        return requestDate >= from && requestDate <= to;
      });
    }

    if (dueDateRange?.from) {
      data = data.filter((wo: WorkOrder) => {
        const dueDate = new Date(wo.dueDate);
        const from = dueDateRange.from!;
        const to = dueDateRange.to || dueDateRange.from!;
        return dueDate >= from && dueDate <= to;
      });
    }

    // Apply cost range filter
    if (costRange.min !== null || costRange.max !== null) {
      data = data.filter((wo: WorkOrder) => {
        const cost = wo.estimatedCost;
        const min = costRange.min ?? -Infinity;
        const max = costRange.max ?? Infinity;
        return cost >= min && cost <= max;
      });
    }

    return data;
  }, [searchQuery, filters, requestDateRange, dueDateRange, costRange]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const pending = workOrders.filter((wo: WorkOrder) => wo.status === 'pending' || wo.status === 'assigned').length;
    const awaitingResponse = workOrders.filter((wo: WorkOrder) => wo.status === 'pending').length;
    const myWorkOrders = workOrders.filter((wo: WorkOrder) => 
      wo.status === 'assigned' || wo.status === 'in-progress' || (wo.assignedTechnician && wo.status !== 'completed' && wo.status !== 'cancelled')
    ).length;
    const inProgress = workOrders.filter((wo: WorkOrder) => wo.status === 'in-progress').length;
    const completed = workOrders.filter((wo: WorkOrder) => wo.status === 'completed').length;
    const overdue = workOrders.filter((wo: WorkOrder) => {
      if (wo.status === 'completed') return false;
      return new Date(wo.dueDate) < new Date();
    }).length;

    return { pending, awaitingResponse, myWorkOrders, inProgress, completed, overdue };
  }, [workOrders]);

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
      meta: { headerAlign: 'center', cellAlign: 'center', essential: false },
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {format(new Date(row.original.dueDate), 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'estimatedCost',
      header: 'Estimated Cost',
      meta: { headerAlign: 'center', cellAlign: 'center', essential: false },
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {currency(row.original.estimatedCost).format()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      meta: { essential: true, headerAlign: 'center', cellAlign: 'center' },
      cell: ({ row }) => {
        const primaryAction: TableAction = {
          label: 'View',
          icon: Eye,
          onClick: () => {
            console.log('View work order:', row.original.workOrderId);
          },
        };

        return <TableActions primaryAction={primaryAction} />;
      },
    },
  ], []);

  // Filter configuration with dynamic counts
  const filterConfig: FilterGroup[] = useMemo(() => [
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'pending', label: 'Pending', count: filterOptions.statusCounts['pending'] || 0 },
        { value: 'assigned', label: 'Assigned', count: filterOptions.statusCounts['assigned'] || 0 },
        { value: 'in-progress', label: 'In Progress', count: filterOptions.statusCounts['in-progress'] || 0 },
        { value: 'completed', label: 'Completed', count: filterOptions.statusCounts['completed'] || 0 },
        { value: 'cancelled', label: 'Cancelled', count: filterOptions.statusCounts['cancelled'] || 0 },
      ],
    },
    {
      id: 'priority',
      label: 'Priority',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'urgent', label: 'Urgent', count: filterOptions.priorityCounts['urgent'] || 0 },
        { value: 'high', label: 'High', count: filterOptions.priorityCounts['high'] || 0 },
        { value: 'medium', label: 'Medium', count: filterOptions.priorityCounts['medium'] || 0 },
        { value: 'low', label: 'Low', count: filterOptions.priorityCounts['low'] || 0 },
      ],
    },
    {
      id: 'serviceCategory',
      label: 'Service Category',
      type: 'checkbox',
      searchable: true,
      options: [
        { value: 'plumbing', label: 'Plumbing', count: filterOptions.categoryCounts['plumbing'] || 0 },
        { value: 'hvac', label: 'HVAC', count: filterOptions.categoryCounts['hvac'] || 0 },
        { value: 'electrical', label: 'Electrical', count: filterOptions.categoryCounts['electrical'] || 0 },
        { value: 'carpentry', label: 'Carpentry', count: filterOptions.categoryCounts['carpentry'] || 0 },
        { value: 'painting', label: 'Painting', count: filterOptions.categoryCounts['painting'] || 0 },
        { value: 'landscaping', label: 'Landscaping', count: filterOptions.categoryCounts['landscaping'] || 0 },
        { value: 'appliance', label: 'Appliance', count: filterOptions.categoryCounts['appliance'] || 0 },
        { value: 'general', label: 'General', count: filterOptions.categoryCounts['general'] || 0 },
      ],
    },
    {
      id: 'propertyType',
      label: 'Property Type',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'residential', label: 'Residential', count: filterOptions.propertyTypeCounts['residential'] || 0 },
        { value: 'commercial', label: 'Commercial', count: filterOptions.propertyTypeCounts['commercial'] || 0 },
        { value: 'industrial', label: 'Industrial', count: filterOptions.propertyTypeCounts['industrial'] || 0 },
        { value: 'mixed-use', label: 'Mixed Use', count: filterOptions.propertyTypeCounts['mixed-use'] || 0 },
      ],
    },
    {
      id: 'client',
      label: 'Client',
      type: 'checkbox',
      searchable: true,
      options: filterOptions.clients.map(client => ({
        value: client,
        label: client,
        count: filterOptions.clientCounts[client] || 0,
      })),
    },
    {
      id: 'assignedTechnician',
      label: 'Assigned Technician',
      type: 'checkbox',
      searchable: true,
      options: filterOptions.technicians.filter((tech): tech is string => Boolean(tech)).map(tech => ({
        value: tech,
        label: tech,
        count: filterOptions.technicianCounts[tech] || 0,
      })),
    },
  ], [filterOptions]);

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-4 lg:space-y-6 bg-gray-50 min-h-screen">
      {/* Welcome Message */}
      <div className="mb-2">
        <p className="text-sm text-gray-600">Manage service requests, track progress, and coordinate work assignments across your team.</p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Pending"
          value={summaryStats.pending}
          icon={Clock}
          tooltip="Work orders waiting to be assigned or started."
        />
        <StatCard
          title="Awaiting Response"
          value={summaryStats.awaitingResponse}
          icon={MessageSquare}
          tooltip="Work orders pending response or action from your team."
        />
        <StatCard
          title="My Work Orders"
          value={summaryStats.myWorkOrders}
          icon={UserCheck}
          tooltip="Work orders assigned to you or your team."
        />
        <StatCard
          title="In Progress"
          value={summaryStats.inProgress}
          icon={ClipboardList}
          tooltip="Work orders currently being worked on by technicians."
        />
        <StatCard
          title="Completed"
          value={summaryStats.completed}
          icon={CheckCircle}
          tooltip="Total number of successfully finished work orders."
        />
        <StatCard
          title="Overdue"
          value={summaryStats.overdue}
          icon={AlertCircle}
          tooltip="Work orders that have exceeded their scheduled completion date."
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
                All Work Orders
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
                  {(() => {
                    let count = Object.values(filters).reduce((acc, v) => acc + (Array.isArray(v) ? v.length : v ? 1 : 0), 0);
                    if (requestDateRange?.from) count += 1;
                    if (dueDateRange?.from) count += 1;
                    if (costRange?.min !== null || costRange?.max !== null) count += 1;
                    return count;
                  })() > 0 && (
                    <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {(() => {
                        let count = Object.values(filters).reduce((acc, v) => acc + (Array.isArray(v) ? v.length : v ? 1 : 0), 0);
                        if (requestDateRange?.from) count += 1;
                        if (dueDateRange?.from) count += 1;
                        if (costRange?.min !== null || costRange?.max !== null) count += 1;
                        return count;
                      })()}
                    </span>
                  )}
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
            <CardTitle>All Work Orders ({filteredData.length})</CardTitle>
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
        issueDateRange={requestDateRange}
        onIssueDateRangeChange={setRequestDateRange}
        dueDateRange={dueDateRange}
        onDueDateRangeChange={setDueDateRange}
        amountRange={costRange}
        onAmountRangeChange={setCostRange}
        amountStats={costStats}
      />
    </div>
  );
}

