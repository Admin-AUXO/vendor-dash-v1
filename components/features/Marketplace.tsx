import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '../ui';
import { cn } from '../ui/utils';
import { 
  StatCard, 
  FilterSystem,
  FilterPanelSlideIn,
  DataTable,
  StatusBadge,
  EmptyState,
  ColumnVisibilityToggle,
  TableActions,
  type FilterGroup,
  type TableAction,
  useTableFilters,
  useTableInstance,
  useFilterOptions,
  useNumericRangeStats,
} from '../shared';
import { 
  Briefcase, 
  FileCheck, 
  TrendingUp, 
  Target,
  Users,
  Filter,
  Eye,
  Send,
  X
} from 'lucide-react';
import { marketplaceProjects, bids, type MarketplaceProject, type Bid } from '../../data';
import { ColumnDef } from '@tanstack/react-table';
import { format, differenceInDays } from 'date-fns';
import currency from 'currency.js';

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

export function Marketplace() {
  const [activeTab, setActiveTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: ['open'], // Default to 'open' status for Available Projects
    serviceCategory: [],
    propertyType: [],
    endingSoon: '',
  });
  const [budgetRange, setBudgetRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  // Bids search and filter state
  const [bidSearchQuery, setBidSearchQuery] = useState('');
  const [bidFilters, setBidFilters] = useState<Record<string, string | string[]>>({
    status: [],
  });
  const [isBidFilterPanelOpen, setIsBidFilterPanelOpen] = useState(false);

  // Use custom hooks for table instances
  const { tableInstance: projectTableInstance, handleTableReady: handleProjectTableReady } = useTableInstance();
  const { tableInstance: bidTableInstance, handleTableReady: handleBidTableReady } = useTableInstance();

  // Get project details for bids
  // Note: bid.projectId contains the internal id (e.g., "proj-1"), not the display projectId
  const getProjectDetails = useCallback((projectInternalId: string) => {
    return marketplaceProjects.find((p: MarketplaceProject) => p.id === projectInternalId);
  }, []);

  // Calculate competitor count (number of bids - 1 for own bid)
  const getCompetitorCount = useCallback((projectId: string) => {
    const project = getProjectDetails(projectId);
    return project ? Math.max(0, project.numberOfBids - 1) : 0;
  }, [getProjectDetails]);

  // Get filter options with counts for projects
  const { counts: projectFilterCounts } = useFilterOptions(marketplaceProjects, {
    status: (proj) => proj.status,
    serviceCategory: (proj) => proj.serviceCategory,
    propertyType: (proj) => proj.propertyType,
  });

  // Get budget range stats
  const budgetStats = useNumericRangeStats(marketplaceProjects, (proj) => (proj.budgetMin + proj.budgetMax) / 2);

  // Calculate ending soon count
  const endingSoonCount = useMemo(() => {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    return marketplaceProjects.filter((proj: MarketplaceProject) => {
      const deadline = new Date(proj.deadline);
      return deadline <= threeDaysFromNow && deadline >= now && proj.status === 'open';
    }).length;
  }, []);

  // Filter projects using useTableFilters hook
  // Note: endingSoon is a special filter that needs custom handling
  const baseFilteredProjects = useTableFilters({
    data: marketplaceProjects,
    searchQuery,
    filters: {
      status: filters.status,
      serviceCategory: filters.serviceCategory,
      propertyType: filters.propertyType,
    },
    numericRanges: {
      budget: budgetRange,
    },
    searchFields: (proj) => [
      proj.projectId,
      proj.propertyAddress,
      proj.serviceCategory,
      proj.projectDescription,
    ],
    filterFields: {
      status: (proj) => proj.status,
      serviceCategory: (proj) => proj.serviceCategory,
      propertyType: (proj) => proj.propertyType,
    },
    numericFields: {
      budget: (proj) => (proj.budgetMin + proj.budgetMax) / 2,
    },
  });

  // Apply endingSoon filter separately
  const filteredProjects = useMemo(() => {
    if (filters.endingSoon && filters.endingSoon === 'true') {
      const now = new Date();
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      return baseFilteredProjects.filter((proj: MarketplaceProject) => {
        const deadline = new Date(proj.deadline);
        return deadline <= threeDaysFromNow && deadline >= now && proj.status === 'open';
      });
    }
    return baseFilteredProjects;
  }, [baseFilteredProjects, filters.endingSoon]);

  // Filter bids using useTableFilters hook
  const filteredBids = useTableFilters({
    data: bids,
    searchQuery: bidSearchQuery,
    filters: bidFilters,
    searchFields: (bid) => {
      const project = getProjectDetails(bid.projectId);
      return [
        bid.bidId,
        bid.projectId,
        project?.propertyAddress || '',
        project?.serviceCategory || '',
      ].filter(Boolean);
    },
    filterFields: {
      status: (bid) => bid.status,
    },
  });

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
      meta: { essential: true },
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-sm font-mono">{row.original.projectId}</span>
          {row.original.location && (
            <p className="text-xs text-gray-500 mt-0.5">
              {row.original.location.city}, {row.original.location.state}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'serviceCategory',
      header: 'Service Type',
      meta: { essential: false },
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 capitalize">
          {row.original.serviceCategory}
        </span>
      ),
    },
    {
      accessorKey: 'budgetRange',
      header: 'Budget Range',
      meta: { headerAlign: 'center', cellAlign: 'center', essential: false },
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {formatCurrencyK(row.original.budgetMin)} - {formatCurrencyK(row.original.budgetMax)}
        </span>
      ),
    },
    {
      accessorKey: 'deadline',
      header: 'Deadline',
      meta: { headerAlign: 'center', cellAlign: 'center', essential: false },
      cell: ({ row }) => {
        const deadline = new Date(row.original.deadline);
        const now = new Date();
        const daysUntil = differenceInDays(deadline, now);
        const isUrgent = daysUntil <= 3 && daysUntil >= 0;
        return (
          <div className="text-center">
            <span className={cn("text-sm", isUrgent ? "text-red-600 font-medium" : "text-gray-900")}>
              {format(deadline, 'MMM dd, yyyy')}
            </span>
            {daysUntil >= 0 && (
              <p className={cn("text-xs mt-0.5", isUrgent ? "text-red-600" : "text-gray-500")}>
                {daysUntil === 0 ? 'Today' : daysUntil === 1 ? '1 day left' : `${daysUntil} days left`}
              </p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'numberOfBids',
      header: 'Bids',
      meta: { headerAlign: 'center', essential: false },
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-900">{row.original.numberOfBids}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { headerAlign: 'center', essential: true },
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
        return <div className="flex justify-center"><StatusBadge status={mapped.type} label={mapped.label} /></div>;
      },
    },
    {
      id: 'submitBid',
      header: 'Submit Bid',
      meta: { essential: false, headerAlign: 'center', cellAlign: 'center' },
      cell: ({ row }) => {
        if (row.original.status === 'open') {
          return (
            <div className="flex justify-center">
              <Button
                variant="default"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Submit bid for project:', row.original.projectId);
                }}
                className="flex items-center gap-1.5 font-semibold shadow-md hover:shadow-lg"
              >
                <Send className="w-4 h-4" />
                Submit Bid
              </Button>
            </div>
          );
        }
        return <span className="text-sm text-gray-400">—</span>;
      },
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
            console.log('View project:', row.original.projectId);
          },
        };

        return <TableActions primaryAction={primaryAction} />;
      },
    },
  ], []);

  // Bid columns
  const bidColumns: ColumnDef<Bid>[] = useMemo(() => [
    {
      accessorKey: 'bidId',
      header: 'Bid ID',
      meta: { essential: true },
      cell: ({ row }) => (
        <span className="font-semibold text-sm font-mono">{row.original.bidId}</span>
      ),
    },
    {
      accessorKey: 'projectId',
      header: 'Project',
      meta: { essential: true },
      cell: ({ row }) => {
        const project = getProjectDetails(row.original.projectId);
        return (
          <div>
            <div className="text-sm text-gray-900">
              <span className="font-semibold font-mono">{project?.projectId || row.original.projectId}</span>
              {project && (
                <span className="ml-2">{project.propertyAddress}</span>
              )}
            </div>
            {project && (
              <>
                <p className="text-xs text-gray-500 mt-0.5 capitalize">
                  {project.serviceCategory}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
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
      header: 'Cost',
      meta: { headerAlign: 'center', cellAlign: 'center', essential: false },
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {currency(row.original.proposedCost).format()}
        </span>
      ),
    },
    {
      accessorKey: 'estimatedTimeline',
      header: 'Timeline',
      meta: { headerAlign: 'center', essential: false },
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.estimatedTimeline}</span>
      ),
    },
    {
      accessorKey: 'competitors',
      header: 'Competitors',
      meta: { headerAlign: 'center', essential: false },
      cell: ({ row }) => {
        const count = getCompetitorCount(row.original.projectId);
        return (
          <div className="flex items-center justify-center gap-1">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-900">{count}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'submittedDate',
      header: 'Submitted',
      meta: { headerAlign: 'center', cellAlign: 'center', essential: false },
      cell: ({ row }) => {
        const submittedDate = new Date(row.original.submittedDate);
        const now = new Date();
        const daysSince = differenceInDays(now, submittedDate);
        return (
          <div className="text-center">
            <span className="text-sm text-gray-900">
              {format(submittedDate, 'MMM dd, yyyy')}
            </span>
            <p className="text-xs text-gray-500 mt-0.5">
              {daysSince === 0 ? 'Today' : daysSince === 1 ? '1 day ago' : `${daysSince} days ago`}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'paymentTerms',
      header: 'Payment Terms',
      meta: { headerAlign: 'center', essential: false },
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.paymentTerms || '—'}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { essential: true },
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
      id: 'withdraw',
      header: 'Withdraw',
      meta: { essential: false, headerAlign: 'center', cellAlign: 'center' },
      cell: ({ row }) => {
        if (row.original.status === 'pending') {
          return (
            <div className="flex justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Withdraw bid:', row.original.bidId);
                }}
                className="flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                Withdraw
              </Button>
            </div>
          );
        }
        return <span className="text-sm text-gray-400">—</span>;
      },
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
            console.log('View bid:', row.original.bidId);
          },
        };

        return <TableActions primaryAction={primaryAction} />;
      },
    },
  ], [getProjectDetails, getCompetitorCount]);

  // Filter configuration for projects with dynamic counts
  const filterConfig: FilterGroup[] = useMemo(() => [
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'open', label: 'Open', count: projectFilterCounts.status?.['open'] || 0 },
        { value: 'in-review', label: 'In Progress', count: projectFilterCounts.status?.['in-review'] || 0 },
        { value: 'awarded', label: 'Completed', count: projectFilterCounts.status?.['awarded'] || 0 },
        { value: 'closed', label: 'Closed', count: projectFilterCounts.status?.['closed'] || 0 },
        { value: 'cancelled', label: 'Cancelled', count: projectFilterCounts.status?.['cancelled'] || 0 },
      ],
    },
    {
      id: 'serviceCategory',
      label: 'Service Category',
      type: 'checkbox',
      searchable: true,
      options: [
        { value: 'plumbing', label: 'Plumbing', count: projectFilterCounts.serviceCategory?.['plumbing'] || 0 },
        { value: 'hvac', label: 'HVAC', count: projectFilterCounts.serviceCategory?.['hvac'] || 0 },
        { value: 'electrical', label: 'Electrical', count: projectFilterCounts.serviceCategory?.['electrical'] || 0 },
        { value: 'carpentry', label: 'Carpentry', count: projectFilterCounts.serviceCategory?.['carpentry'] || 0 },
        { value: 'painting', label: 'Painting', count: projectFilterCounts.serviceCategory?.['painting'] || 0 },
        { value: 'landscaping', label: 'Landscaping', count: projectFilterCounts.serviceCategory?.['landscaping'] || 0 },
        { value: 'appliance', label: 'Appliance', count: projectFilterCounts.serviceCategory?.['appliance'] || 0 },
        { value: 'general', label: 'General', count: projectFilterCounts.serviceCategory?.['general'] || 0 },
      ],
    },
    {
      id: 'propertyType',
      label: 'Property Type',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'residential', label: 'Residential', count: projectFilterCounts.propertyType?.['residential'] || 0 },
        { value: 'commercial', label: 'Commercial', count: projectFilterCounts.propertyType?.['commercial'] || 0 },
        { value: 'industrial', label: 'Industrial', count: projectFilterCounts.propertyType?.['industrial'] || 0 },
        { value: 'mixed-use', label: 'Mixed Use', count: projectFilterCounts.propertyType?.['mixed-use'] || 0 },
      ],
    },
    {
      id: 'endingSoon',
      label: 'Ending Soon',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'true', label: 'Ending in 3 days', count: endingSoonCount },
      ],
    },
  ], [projectFilterCounts, endingSoonCount]);

  // Get filter options with counts for bids
  const { counts: bidFilterCounts } = useFilterOptions(bids, {
    status: (bid) => bid.status,
  });

  // Filter configuration for bids with dynamic counts
  const bidFilterConfig: FilterGroup[] = useMemo(() => [
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'pending', label: 'Pending', count: bidFilterCounts.status?.['pending'] || 0 },
        { value: 'under-review', label: 'Under Review', count: bidFilterCounts.status?.['under-review'] || 0 },
        { value: 'accepted', label: 'Accepted', count: bidFilterCounts.status?.['accepted'] || 0 },
        { value: 'rejected', label: 'Rejected', count: bidFilterCounts.status?.['rejected'] || 0 },
        { value: 'withdrawn', label: 'Withdrawn', count: bidFilterCounts.status?.['withdrawn'] || 0 },
      ],
    },
  ], [bidFilterCounts]);

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

  // Count active filters for bids badge
  const activeBidFilterCount = useMemo(() => {
    return Object.values(bidFilters).reduce((acc, value) => {
      if (Array.isArray(value)) {
        return acc + value.length;
      }
      return acc + (value ? 1 : 0);
    }, 0);
  }, [bidFilters]);

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-4 lg:space-y-6 bg-gray-50 min-h-screen">
      {/* Welcome Message */}
      <div className="mb-2">
        <p className="text-sm text-gray-600 font-medium leading-relaxed">Discover new project opportunities, submit competitive bids, and track your bidding activity.</p>
      </div>

      {/* Marketplace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Projects"
          value={marketplaceStats.availableProjects}
          icon={Briefcase}
          tooltip="Open projects available for bidding in the marketplace."
        />
        <StatCard
          title="My Bids"
          value={marketplaceStats.myBids}
          icon={FileCheck}
          tooltip="Total number of bids you have submitted across all statuses."
        />
        <StatCard
          title="Won Bids"
          value={marketplaceStats.wonBids}
          change={`${marketplaceStats.winRate}% win rate`}
          trend="up"
          icon={TrendingUp}
          tooltip="Number of bids that have been accepted. Win rate shows your success percentage."
        />
        <StatCard
          title="Total Opportunity"
          value={currency(marketplaceStats.totalProjectValue).format()}
          icon={Target}
          tooltip="Combined total value of all available open projects in the marketplace."
        />
      </div>

      {/* Slider Tabs */}
      <SliderTabs
        tabs={[
          {
            value: 'projects',
            label: 'Available Projects',
            badge: <Badge variant="secondary" className="ml-1 bg-gray-100 text-gray-600">{marketplaceStats.availableProjects}</Badge>
          },
          {
            value: 'bids',
            label: 'My Bids',
            badge: <Badge variant="secondary" className="ml-1 bg-gray-100 text-gray-600">{marketplaceStats.myBids}</Badge>
          },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="space-y-4">
        {/* Available Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
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

            {/* Enhanced Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50/80 via-blue-50/50 to-transparent rounded-xl border border-blue-200/60 shadow-sm mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-100/80 shadow-sm">
                  <Briefcase className="w-5 h-5 text-blue-700" />
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-2xl font-display font-semibold text-gray-900 tracking-tight">
                      Available Projects
                    </h2>
                    <p className="text-xs text-gray-600 font-medium mt-0.5">
                      Browse and submit bids for open projects
                    </p>
                  </div>
                  <Badge variant="warning" className="font-semibold shadow-sm min-w-[28px] justify-center">
                    {filteredProjects.length}
                  </Badge>
                </div>
              </div>
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
                {projectTableInstance && (
                  <ColumnVisibilityToggle table={projectTableInstance} />
                )}
              </div>
            </div>

            <Card>
              <CardHeader className="hidden">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-display font-semibold text-gray-900 tracking-tight">
                    Available Projects
                    <Badge variant="warning" className="font-semibold">
                      {filteredProjects.length}
                    </Badge>
                  </CardTitle>
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
                    storageKey="marketplace-projects"
                    onTableReady={handleProjectTableReady}
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
            {/* Enhanced Header for Mobile */}
            <div className="flex flex-col gap-3 p-4 bg-gradient-to-r from-blue-50/80 via-blue-50/50 to-transparent rounded-xl border border-blue-200/60 shadow-sm mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-100/80 shadow-sm">
                  <Briefcase className="w-5 h-5 text-blue-700" />
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-xl font-display font-semibold text-gray-900 tracking-tight">
                      Available Projects
                    </h2>
                    <p className="text-xs text-gray-600 font-medium mt-0.5">
                      Browse and submit bids for open projects
                    </p>
                  </div>
                  <Badge variant="warning" className="font-semibold shadow-sm min-w-[28px] justify-center">
                    {filteredProjects.length}
                  </Badge>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader className="hidden">
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
                    storageKey="marketplace-projects"
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
          </div>
        )}

        {/* My Bids Tab */}
        {activeTab === 'bids' && (
          <div className="space-y-4">
          {/* Filter System - Mobile */}
          <div className="lg:hidden">
            <FilterSystem
              filters={bidFilterConfig}
              filterValues={bidFilters}
              onFilterChange={setBidFilters}
              searchQuery={bidSearchQuery}
              onSearchChange={setBidSearchQuery}
              resultCount={filteredBids.length}
              totalCount={bids.length}
              searchPlaceholder="Search bids by ID, project ID, address, service category..."
            />
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block space-y-4 lg:space-y-6">
            <div className="space-y-3">
              <FilterSystem
                filters={bidFilterConfig}
                filterValues={bidFilters}
                onFilterChange={setBidFilters}
                searchQuery={bidSearchQuery}
                onSearchChange={setBidSearchQuery}
                resultCount={filteredBids.length}
                totalCount={bids.length}
                searchPlaceholder="Search bids by ID, project ID, address, service category..."
                showSearchBar={true}
                showFilterBar={true}
              />
            </div>

            {/* Enhanced Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20 shadow-sm mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/20 shadow-sm">
                  <FileCheck className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-2xl font-display font-semibold text-gray-900 tracking-tight">
                      My Bids
                    </h2>
                    <p className="text-xs text-gray-600 font-medium mt-0.5">
                      Track your submitted bids and their status
                    </p>
                  </div>
                  <Badge variant="warning" className="font-semibold shadow-sm min-w-[28px] justify-center">
                    {filteredBids.length}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBidFilterPanelOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeBidFilterCount > 0 && (
                    <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {activeBidFilterCount}
                    </span>
                  )}
                </Button>
                {bidTableInstance && (
                  <ColumnVisibilityToggle table={bidTableInstance} />
                )}
              </div>
            </div>

            <Card>
              <CardHeader className="hidden">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-display font-semibold text-gray-900 tracking-tight">
                    My Bids
                    <Badge variant="warning" className="font-semibold">
                      {filteredBids.length}
                    </Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {filteredBids.length > 0 ? (
                  <DataTable
                    data={filteredBids}
                    columns={bidColumns}
                    pagination
                    pageSize={10}
                    searchable={false}
                    storageKey="marketplace-bids"
                    onTableReady={handleBidTableReady}
                  />
                ) : (
                  <EmptyState
                    title={bidSearchQuery || Object.values(bidFilters).some(v => Array.isArray(v) ? v.length > 0 : v) ? "No bids found" : "No bids yet"}
                    description={bidSearchQuery || Object.values(bidFilters).some(v => Array.isArray(v) ? v.length > 0 : v) ? "Try adjusting your search or filters" : "You haven't submitted any bids yet"}
                    variant={bidSearchQuery || Object.values(bidFilters).some(v => Array.isArray(v) ? v.length > 0 : v) ? "no-results" : "empty"}
                    action={!bidSearchQuery && !Object.values(bidFilters).some(v => Array.isArray(v) ? v.length > 0 : v) ? {
                      label: "Browse Available Projects",
                      onClick: () => setActiveTab('projects')
                    } : undefined}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Mobile Data Table */}
          <div className="lg:hidden mt-4">
            {/* Enhanced Header for Mobile */}
            <div className="flex flex-col gap-3 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20 shadow-sm mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/20 shadow-sm">
                  <FileCheck className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-xl font-display font-semibold text-gray-900 tracking-tight">
                      My Bids
                    </h2>
                    <p className="text-xs text-gray-600 font-medium mt-0.5">
                      Track your submitted bids and their status
                    </p>
                  </div>
                  <Badge variant="warning" className="font-semibold shadow-sm min-w-[28px] justify-center">
                    {filteredBids.length}
                  </Badge>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader className="hidden">
                <CardTitle className="flex items-center gap-2 text-lg font-display font-semibold text-gray-900 tracking-tight">
                  My Bids
                  <Badge variant="warning" className="bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200 font-semibold shadow-sm">
                    {filteredBids.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredBids.length > 0 ? (
                  <DataTable
                    data={filteredBids}
                    columns={bidColumns}
                    pagination
                    pageSize={10}
                    searchable={false}
                    storageKey="marketplace-bids"
                  />
                ) : (
                  <EmptyState
                    title={bidSearchQuery || Object.values(bidFilters).some(v => Array.isArray(v) ? v.length > 0 : v) ? "No bids found" : "No bids yet"}
                    description={bidSearchQuery || Object.values(bidFilters).some(v => Array.isArray(v) ? v.length > 0 : v) ? "Try adjusting your search or filters" : "You haven't submitted any bids yet"}
                    variant={bidSearchQuery || Object.values(bidFilters).some(v => Array.isArray(v) ? v.length > 0 : v) ? "no-results" : "empty"}
                    action={!bidSearchQuery && !Object.values(bidFilters).some(v => Array.isArray(v) ? v.length > 0 : v) ? {
                      label: "Browse Available Projects",
                      onClick: () => setActiveTab('projects')
                    } : undefined}
                  />
                )}
              </CardContent>
            </Card>
          </div>
          </div>
        )}
      </div>

      {/* Slide-in Filter Panel for Projects */}
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

      {/* Slide-in Filter Panel for Bids */}
      {activeTab === 'bids' && (
        <FilterPanelSlideIn
          filters={bidFilterConfig}
          filterValues={bidFilters}
          onFilterChange={setBidFilters}
          searchQuery={bidSearchQuery}
          onSearchChange={setBidSearchQuery}
          resultCount={filteredBids.length}
          totalCount={bids.length}
          searchPlaceholder="Search bids by ID, project ID, address, service category..."
          isOpen={isBidFilterPanelOpen}
          onClose={() => setIsBidFilterPanelOpen(false)}
        />
      )}
    </div>
  );
}

