import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Tabs, TabsContent, TabsList, TabsTrigger } from './ui';
import { 
  StatCard, 
  FilterSystem,
  FilterPanelSlideIn,
  DataTable,
  StatusBadge,
  EmptyState,
  TruncatedText,
  type FilterGroup,
} from './shared';
import { 
  Briefcase, 
  FileCheck, 
  TrendingUp, 
  Target,
  Users,
  Filter
} from 'lucide-react';
import { marketplaceProjects, bids, type MarketplaceProject, type Bid } from '../data';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import currency from 'currency.js';

export function Marketplace() {
  const [activeTab, setActiveTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: [],
    serviceCategory: [],
    endingSoon: '',
  });
  const [budgetRange, setBudgetRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Filter projects
  const filteredProjects = useMemo(() => {
    let data = marketplaceProjects;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (proj: MarketplaceProject) =>
          proj.projectId.toLowerCase().includes(query) ||
          proj.propertyAddress.toLowerCase().includes(query) ||
          proj.serviceCategory.toLowerCase().includes(query) ||
          proj.projectDescription.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      data = data.filter((proj: MarketplaceProject) => filters.status.includes(proj.status));
    }
    if (filters.serviceCategory && Array.isArray(filters.serviceCategory) && filters.serviceCategory.length > 0) {
      data = data.filter((proj: MarketplaceProject) => filters.serviceCategory.includes(proj.serviceCategory));
    }
    if (filters.endingSoon && filters.endingSoon === 'true') {
      const now = new Date();
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      data = data.filter((proj: MarketplaceProject) => {
        const deadline = new Date(proj.deadline);
        return deadline <= threeDaysFromNow && deadline >= now && proj.status === 'open';
      });
    }
    if (budgetRange.min !== null || budgetRange.max !== null) {
      data = data.filter((proj: MarketplaceProject) => {
        const avgBudget = (proj.budgetMin + proj.budgetMax) / 2;
        const min = budgetRange.min ?? -Infinity;
        const max = budgetRange.max ?? Infinity;
        return avgBudget >= min && avgBudget <= max;
      });
    }

    return data;
  }, [searchQuery, filters, budgetRange]);

  // Filter bids
  const filteredBids = useMemo(() => {
    return bids;
  }, []);

  // Calculate marketplace stats
  const marketplaceStats = useMemo(() => {
    const availableProjects = marketplaceProjects.filter((p: MarketplaceProject) => p.status === 'open').length;
    const myBids = bids.length;
    const wonBids = bids.filter((b: Bid) => b.status === 'accepted').length;
    const winRate = myBids > 0 ? Math.round((wonBids / myBids) * 100) : 0;
    const totalProjectValue = marketplaceProjects
      .filter((p: MarketplaceProject) => p.status === 'open')
      .reduce((sum: number, p: MarketplaceProject) => sum + (p.budgetMin + p.budgetMax) / 2, 0);

    return { availableProjects, myBids, wonBids, winRate, totalProjectValue };
  }, []);

  // Format currency with k notation
  const formatCurrencyK = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return currency(amount).format();
  };

  // Project columns
  const projectColumns: ColumnDef<MarketplaceProject>[] = useMemo(() => [
    {
      accessorKey: 'projectId',
      header: 'Project ID',
      cell: ({ row }) => (
        <span className="font-semibold text-sm font-mono">{row.original.projectId}</span>
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
          <TruncatedText 
            text={row.original.projectDescription} 
            maxLength={60}
            className="text-xs text-gray-500 mt-1"
          />
          <p className="text-xs text-gray-500 capitalize mt-1">{row.original.serviceCategory}</p>
        </div>
      ),
    },
    {
      accessorKey: 'budgetRange',
      header: 'Budget Range',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {formatCurrencyK(row.original.budgetMin)} - {formatCurrencyK(row.original.budgetMax)}
        </span>
      ),
    },
    {
      accessorKey: 'deadline',
      header: 'Deadline',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {format(new Date(row.original.deadline), 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'numberOfBids',
      header: 'Bids',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.numberOfBids}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        // Standardize status terminology to match work orders
        const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending', label: string }> = {
          'open': { type: 'info', label: 'Open' },
          'in-review': { type: 'pending', label: 'In Progress' },
          'awarded': { type: 'success', label: 'Completed' },
          'closed': { type: 'warning', label: 'Closed' },
          'cancelled': { type: 'error', label: 'Cancelled' },
        };
        const mapped = statusMap[status] || { type: 'pending' as const, label: status };
        return <StatusBadge status={mapped.type} label={mapped.label} />;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            View
          </Button>
          {row.original.status === 'open' && (
            <Button size="sm">
              Submit Bid
            </Button>
          )}
        </div>
      ),
    },
  ], []);

  // Get project details for bids
  const getProjectDetails = (projectId: string) => {
    return marketplaceProjects.find((p: MarketplaceProject) => p.projectId === projectId);
  };

  // Calculate competitor count (number of bids - 1 for own bid)
  const getCompetitorCount = (projectId: string) => {
    const project = getProjectDetails(projectId);
    return project ? Math.max(0, project.numberOfBids - 1) : 0;
  };

  // Bid columns
  const bidColumns: ColumnDef<Bid>[] = useMemo(() => [
    {
      accessorKey: 'bidId',
      header: 'Bid ID',
      cell: ({ row }) => (
        <span className="font-semibold text-sm font-mono">{row.original.bidId}</span>
      ),
    },
    {
      accessorKey: 'projectId',
      header: 'Project',
      cell: ({ row }) => {
        const project = getProjectDetails(row.original.projectId);
        return (
          <div>
            <span className="text-sm text-gray-900 font-mono">{row.original.projectId}</span>
            {project && (
              <>
                <TruncatedText 
                  text={project.propertyAddress} 
                  maxLength={40}
                  className="text-xs text-gray-500 mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deadline: {format(new Date(project.deadline), 'MMM dd, yyyy')}
                </p>
              </>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'proposedCost',
      header: 'Proposed Cost',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {currency(row.original.proposedCost).format()}
        </span>
      ),
    },
    {
      accessorKey: 'estimatedTimeline',
      header: 'Timeline',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.estimatedTimeline}</span>
      ),
    },
    {
      accessorKey: 'competitors',
      header: 'Competitors',
      cell: ({ row }) => {
        const count = getCompetitorCount(row.original.projectId);
        return (
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-900">{count}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'submittedDate',
      header: 'Submitted',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {format(new Date(row.original.submittedDate), 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending', label: string }> = {
          'accepted': { type: 'success', label: 'Accepted' },
          'pending': { type: 'pending', label: 'Pending' },
          'under-review': { type: 'info', label: 'Under Review' },
          'rejected': { type: 'error', label: 'Rejected' },
          'withdrawn': { type: 'warning', label: 'Withdrawn' },
        };
        const mapped = statusMap[status] || { type: 'pending' as const, label: status };
        return <StatusBadge status={mapped.type} label={mapped.label} />;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            View
          </Button>
          {row.original.status === 'pending' && (
            <Button variant="outline" size="sm">
              Withdraw
            </Button>
          )}
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
        { value: 'open', label: 'Open' },
        { value: 'in-review', label: 'In Progress' },
        { value: 'awarded', label: 'Completed' },
        { value: 'closed', label: 'Closed' },
        { value: 'cancelled', label: 'Cancelled' },
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
    {
      id: 'endingSoon',
      label: 'Ending Soon',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'true', label: 'Ending in 3 days' },
      ],
    },
  ];

  // Get budget range stats for display
  const budgetStats = useMemo(() => {
    const budgets = marketplaceProjects.map((p: MarketplaceProject) => (p.budgetMin + p.budgetMax) / 2);
    return {
      min: Math.min(...budgets),
      max: Math.max(...budgets),
    };
  }, []);

  // Count active filters for badge
  const activeFilterCount = useMemo(() => {
    let count = Object.values(filters).reduce((acc, value) => {
      if (Array.isArray(value)) {
        return acc + value.length;
      }
      return acc + (value ? 1 : 0);
    }, 0);
    
    if (budgetRange.min !== null || budgetRange.max !== null) count += 1;
    
    return count;
  }, [filters, budgetRange]);

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-4 lg:space-y-6 bg-gray-50 min-h-screen">

      {/* Marketplace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Projects"
          value={marketplaceStats.availableProjects}
          icon={Briefcase}
        />
        <StatCard
          title="My Bids"
          value={marketplaceStats.myBids}
          icon={FileCheck}
        />
        <StatCard
          title="Won Bids"
          value={marketplaceStats.wonBids}
          change={`${marketplaceStats.winRate}% win rate`}
          trend="up"
          icon={TrendingUp}
        />
        <StatCard
          title="Total Opportunity"
          value={currency(marketplaceStats.totalProjectValue).format()}
          icon={Target}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">
            Available Projects ({marketplaceStats.availableProjects})
          </TabsTrigger>
          <TabsTrigger value="bids">
            My Bids ({marketplaceStats.myBids})
          </TabsTrigger>
        </TabsList>

        {/* Available Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          {/* Filter System - Mobile */}
          <div className="lg:hidden">
            <FilterSystem
              filters={filterConfig}
              filterValues={filters}
              onFilterChange={setFilters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              resultCount={filteredProjects.length}
              totalCount={marketplaceProjects.length}
              searchPlaceholder="Search projects by ID, address, service category..."
            />
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block space-y-4 lg:space-y-6">
            <div className="space-y-3">
              <FilterSystem
                filters={filterConfig}
                filterValues={filters}
                onFilterChange={setFilters}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                resultCount={filteredProjects.length}
                totalCount={marketplaceProjects.length}
                searchPlaceholder="Search projects by ID, address, service category..."
                showSearchBar={true}
                showFilterBar={true}
              />
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Available Projects ({filteredProjects.length})</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFilterPanelOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredProjects.length > 0 ? (
                  <DataTable
                    data={filteredProjects}
                    columns={projectColumns}
                    pagination
                    pageSize={10}
                    searchable={false}
                  />
                ) : (
                  <EmptyState
                    title="No projects found"
                    description="Try adjusting your search or filters"
                    variant="no-results"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Mobile Data Table */}
          <div className="lg:hidden mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Projects ({filteredProjects.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredProjects.length > 0 ? (
                  <DataTable
                    data={filteredProjects}
                    columns={projectColumns}
                    pagination
                    pageSize={10}
                    searchable={false}
                  />
                ) : (
                  <EmptyState
                    title="No projects found"
                    description="Try adjusting your search or filters"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* My Bids Tab */}
        <TabsContent value="bids" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Bids ({filteredBids.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredBids.length > 0 ? (
                <DataTable
                  data={filteredBids}
                  columns={bidColumns}
                  pagination
                  pageSize={10}
                  searchable={false}
                />
              ) : (
                <EmptyState
                  title="No bids found"
                  description="You haven't submitted any bids yet"
                  variant="empty"
                  action={{
                    label: "Browse Available Projects",
                    onClick: () => console.log("Navigate to projects")
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Slide-in Filter Panel */}
      {activeTab === 'projects' && (
        <FilterPanelSlideIn
          filters={filterConfig}
          filterValues={filters}
          onFilterChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={filteredProjects.length}
          totalCount={marketplaceProjects.length}
          searchPlaceholder="Search projects by ID, address, service category..."
          isOpen={isFilterPanelOpen}
          onClose={() => setIsFilterPanelOpen(false)}
          budgetRange={budgetRange}
          onBudgetRangeChange={setBudgetRange}
          budgetStats={budgetStats}
        />
      )}
    </div>
  );
}

