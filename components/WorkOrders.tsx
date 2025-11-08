import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from './ui';
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
  type FilterGroup,
} from './shared';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Filter
} from 'lucide-react';
import { workOrders, type WorkOrder } from '../data';
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

  // Define columns
  const columns: ColumnDef<WorkOrder>[] = useMemo(() => [
    {
      accessorKey: 'workOrderId',
      header: 'Work Order ID',
      cell: ({ row }) => (
        <span className="font-semibold text-sm font-mono">{row.original.workOrderId}</span>
      ),
    },
    {
      accessorKey: 'propertyAddress',
      header: 'Property Address',
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
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.clientName}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
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
        return <StatusBadge status={mapped.type} label={mapped.label} />;
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {format(new Date(row.original.dueDate), 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'estimatedCost',
      header: 'Estimated Cost',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {currency(row.original.estimatedCost).format()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
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
              <CardTitle>Work Orders ({filteredData.length})</CardTitle>
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

