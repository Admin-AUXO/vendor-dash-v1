import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from './ui';
import { cn } from './ui/utils';
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
} from './shared';
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
import { marketplaceProjects, bids, type MarketplaceProject, type Bid } from '../data';
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
    status: [],
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

  // Table instances for column visibility
  const [projectTableInstance, setProjectTableInstance] = useState<any>(null);
  const [bidTableInstance, setBidTableInstance] = useState<any>(null);

  // Stable callbacks for table ready
  const handleProjectTableReady = useCallback((table: any) => {
    setProjectTableInstance(table);
  }, []);
  const handleBidTableReady = useCallback((table: any) => {
    setBidTableInstance(table);
  }, []);

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
    if (filters.propertyType && Array.isArray(filters.propertyType) && filters.propertyType.length > 0) {
      data = data.filter((proj: MarketplaceProject) => filters.propertyType.includes(proj.propertyType));
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

  // Filter bids
  const filteredBids = useMemo(() => {
    let data = bids;

    // Apply search
    if (bidSearchQuery) {
      const query = bidSearchQuery.toLowerCase();
      data = data.filter(
        (bid: Bid) => {
          const project = getProjectDetails(bid.projectId);
          return (
            bid.bidId.toLowerCase().includes(query) ||
            bid.projectId.toLowerCase().includes(query) ||
            (project && project.propertyAddress.toLowerCase().includes(query)) ||
            (project && project.serviceCategory.toLowerCase().includes(query))
          );
        }
      );
    }

    // Apply filters
    if (bidFilters.status && Array.isArray(bidFilters.status) && bidFilters.status.length > 0) {
      data = data.filter((bid: Bid) => bidFilters.status.includes(bid.status));
    }

    return data;
  }, [bidSearchQuery, bidFilters, getProjectDetails]);

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
              <span className="font-mono uppercase">{project?.projectId || row.original.projectId}</span>
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

  // Get filter options with counts for projects
  const projectFilterOptions = useMemo(() => {
    const statusCounts = marketplaceProjects.reduce((acc, proj) => {
      acc[proj.status] = (acc[proj.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const categoryCounts = marketplaceProjects.reduce((acc, proj) => {
      acc[proj.serviceCategory] = (acc[proj.serviceCategory] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const propertyTypeCounts = marketplaceProjects.reduce((acc, proj) => {
      acc[proj.propertyType] = (acc[proj.propertyType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const endingSoonCount = marketplaceProjects.filter((proj: MarketplaceProject) => {
      const deadline = new Date(proj.deadline);
      return deadline <= threeDaysFromNow && deadline >= now && proj.status === 'open';
    }).length;
    
    return {
      statusCounts,
      categoryCounts,
      propertyTypeCounts,
      endingSoonCount,
    };
  }, []);

  // Filter configuration for projects with dynamic counts
  const filterConfig: FilterGroup[] = useMemo(() => [
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'open', label: 'Open', count: projectFilterOptions.statusCounts['open'] || 0 },
        { value: 'in-review', label: 'In Progress', count: projectFilterOptions.statusCounts['in-review'] || 0 },
        { value: 'awarded', label: 'Completed', count: projectFilterOptions.statusCounts['awarded'] || 0 },
        { value: 'closed', label: 'Closed', count: projectFilterOptions.statusCounts['closed'] || 0 },
        { value: 'cancelled', label: 'Cancelled', count: projectFilterOptions.statusCounts['cancelled'] || 0 },
      ],
    },
    {
      id: 'serviceCategory',
      label: 'Service Category',
      type: 'checkbox',
      searchable: true,
      options: [
        { value: 'plumbing', label: 'Plumbing', count: projectFilterOptions.categoryCounts['plumbing'] || 0 },
        { value: 'hvac', label: 'HVAC', count: projectFilterOptions.categoryCounts['hvac'] || 0 },
        { value: 'electrical', label: 'Electrical', count: projectFilterOptions.categoryCounts['electrical'] || 0 },
        { value: 'carpentry', label: 'Carpentry', count: projectFilterOptions.categoryCounts['carpentry'] || 0 },
        { value: 'painting', label: 'Painting', count: projectFilterOptions.categoryCounts['painting'] || 0 },
        { value: 'landscaping', label: 'Landscaping', count: projectFilterOptions.categoryCounts['landscaping'] || 0 },
        { value: 'appliance', label: 'Appliance', count: projectFilterOptions.categoryCounts['appliance'] || 0 },
        { value: 'general', label: 'General', count: projectFilterOptions.categoryCounts['general'] || 0 },
      ],
    },
    {
      id: 'propertyType',
      label: 'Property Type',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'residential', label: 'Residential', count: projectFilterOptions.propertyTypeCounts['residential'] || 0 },
        { value: 'commercial', label: 'Commercial', count: projectFilterOptions.propertyTypeCounts['commercial'] || 0 },
        { value: 'industrial', label: 'Industrial', count: projectFilterOptions.propertyTypeCounts['industrial'] || 0 },
        { value: 'mixed-use', label: 'Mixed Use', count: projectFilterOptions.propertyTypeCounts['mixed-use'] || 0 },
      ],
    },
    {
      id: 'endingSoon',
      label: 'Ending Soon',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'true', label: 'Ending in 3 days', count: projectFilterOptions.endingSoonCount },
      ],
    },
  ], [projectFilterOptions]);

  // Get filter options with counts for bids
  const bidFilterOptions = useMemo(() => {
    const statusCounts = bids.reduce((acc, bid) => {
      acc[bid.status] = (acc[bid.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return { statusCounts };
  }, []);

  // Filter configuration for bids with dynamic counts
  const bidFilterConfig: FilterGroup[] = useMemo(() => [
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'pending', label: 'Pending', count: bidFilterOptions.statusCounts['pending'] || 0 },
        { value: 'under-review', label: 'Under Review', count: bidFilterOptions.statusCounts['under-review'] || 0 },
        { value: 'accepted', label: 'Accepted', count: bidFilterOptions.statusCounts['accepted'] || 0 },
        { value: 'rejected', label: 'Rejected', count: bidFilterOptions.statusCounts['rejected'] || 0 },
        { value: 'withdrawn', label: 'Withdrawn', count: bidFilterOptions.statusCounts['withdrawn'] || 0 },
      ],
    },
  ], [bidFilterOptions]);

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
            badge: <Badge variant="secondary" className="ml-1 bg-gray-100 text-gray-700">{marketplaceStats.availableProjects}</Badge>
          },
          {
            value: 'bids',
            label: 'My Bids',
            badge: <Badge variant="secondary" className="ml-1 bg-gray-100 text-gray-700">{marketplaceStats.myBids}</Badge>
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

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-display font-semibold text-gray-900 tracking-tight">
                    Available Projects
                    <Badge variant="warning" className="font-semibold">
                      {filteredProjects.length}
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

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-display font-semibold text-gray-900 tracking-tight">
                    My Bids
                    <Badge variant="warning" className="font-semibold">
                      {filteredBids.length}
                    </Badge>
                  </CardTitle>
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
            <Card>
              <CardHeader>
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

