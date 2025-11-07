# Next Steps - Vendor Dashboard Implementation

## Current Status

✅ **Completed:**
- Theme system (gold/yellow #f7d604)
- Typography system (Inter + Space Grotesk)
- 25 UI primitives (optimized and theme-integrated)
- 19 Shared components (ready to use)
- Dummy data structure (11 data models)
- Navigation components (Sidebar, TopHeader, DashboardLayout)

⏳ **To Do:**
- Create 6 screen components
- Integrate data from `@/data`
- Connect components together

---

## Implementation Steps

### Step 1: Setup App.tsx with Navigation

**File**: `App.tsx`

**Action**: Update App.tsx to use `DashboardLayout` component

**Reference**: See `App.example.tsx` for example implementation

**Tasks**:
- [ ] Import `DashboardLayout` from `@/components/shared`
- [ ] Import screen components (Overview, WorkOrders, etc.)
- [ ] Set up navigation menu items
- [ ] Configure user profile data
- [ ] Set up screen switching logic

---

### Step 2: Create Overview Screen

**File**: `components/Overview.tsx`

**Layout**:
1. Page Header
2. 4 KPI Stat Cards (from `metrics`)
3. Charts Row (Weekly Revenue + Service Distribution)
4. Urgent Work Orders Alert Card
5. Activity Feed (from `activities`)
6. Trends & Top Clients

**Data Sources**:
- `metrics` - Dashboard KPIs
- `workOrders` - Filter urgent/high priority
- `activities` - Recent activity feed
- `weeklyRevenueData` - Chart data
- `serviceDistributionData` - Pie chart

**Components to Use**:
- `PageHeader`, `StatCard`, `Card`, `DataTable`
- `Timeline`, `StatusBadge`, `PriorityBadge`
- Recharts for charts

**Tasks**:
- [ ] Create Overview component structure
- [ ] Add PageHeader
- [ ] Add 4 StatCard components with metrics
- [ ] Add charts (Line + Pie)
- [ ] Add urgent work orders list
- [ ] Add activity feed with Timeline
- [ ] Style and test

---

### Step 3: Create Work Orders Screen

**File**: `components/WorkOrders.tsx`

**Layout**:
1. Page Header with actions
2. Search Bar + Filter Panel
3. Summary Stat Cards (4)
4. Data Table with work orders

**Data Sources**:
- `workOrders` - All work orders
- Filter by status, priority, date range
- Search by ID, address, client name

**Components to Use**:
- `PageHeader`, `SearchBar`, `FilterPanel`
- `DataTable`, `StatusBadge`, `PriorityBadge`
- `StatCard`, `ExportButton`

**Tasks**:
- [ ] Create WorkOrders component
- [ ] Add PageHeader with Filter/Export buttons
- [ ] Add SearchBar and FilterPanel
- [ ] Add summary stat cards
- [ ] Create DataTable columns for work orders
- [ ] Add filtering and search logic
- [ ] Add export functionality
- [ ] Style and test

---

### Step 4: Create Invoice Screen

**File**: `components/Invoice.tsx`

**Layout**:
1. Page Header with Create button
2. Summary Stat Cards (4)
3. Search + Filters
4. Data Table with invoices
5. Charts (Revenue Timeline + Status Distribution)

**Data Sources**:
- `invoices` - All invoices
- Calculate stats (paid, pending, overdue)
- Filter by status, date, client

**Components to Use**:
- `PageHeader`, `StatCard`, `SearchBar`, `FilterPanel`
- `DataTable`, `StatusBadge`, `ExportButton`
- Recharts for charts

**Tasks**:
- [ ] Create Invoice component
- [ ] Add PageHeader with Create button
- [ ] Add summary stat cards
- [ ] Add SearchBar and FilterPanel
- [ ] Create DataTable columns for invoices
- [ ] Add charts (Line + Pie)
- [ ] Add export functionality
- [ ] Style and test

---

### Step 5: Create Payments Screen

**File**: `components/Payments.tsx`

**Layout**:
1. Page Header with actions
2. Financial Summary Cards (4)
3. Charts (Payment Timeline + Payment Methods)
4. Outstanding Balances Card
5. Search + Date Range + Filters
6. Payment History Table

**Data Sources**:
- `payments` - All payments
- `invoices` - For outstanding balances
- Calculate financial metrics
- Filter by date range, payment method, status

**Components to Use**:
- `PageHeader`, `StatCard`, `SearchBar`, `FilterPanel`
- `DateRangePicker`, `DataTable`, `ExportButton`
- Recharts for charts

**Tasks**:
- [ ] Create Payments component
- [ ] Add PageHeader with actions
- [ ] Add financial summary cards
- [ ] Add charts (Line + Pie)
- [ ] Add outstanding balances list
- [ ] Add SearchBar, DateRangePicker, FilterPanel
- [ ] Create DataTable columns for payments
- [ ] Add export functionality
- [ ] Style and test

---

### Step 6: Create Marketplace Screen

**File**: `components/Marketplace.tsx`

**Layout**:
1. Page Header with My Bids button
2. Marketplace Stats (4)
3. Tabs: Available Projects | My Bids
4. Search + Filters
5. Project Cards/Table or Bid Table

**Data Sources**:
- `marketplaceProjects` - Available projects
- `bids` - My submitted bids
- Filter by service category, budget, location

**Components to Use**:
- `PageHeader`, `StatCard`, `Tabs`, `SearchBar`, `FilterPanel`
- `Card`, `DataTable`, `StatusBadge`, `Button`

**Tasks**:
- [ ] Create Marketplace component
- [ ] Add PageHeader with My Bids button
- [ ] Add marketplace stats cards
- [ ] Add Tabs (Available Projects | My Bids)
- [ ] Add SearchBar and FilterPanel
- [ ] Create project cards or table
- [ ] Create bid submission form (optional)
- [ ] Add My Bids table
- [ ] Style and test

---

### Step 7: Create Help Desk Screen

**File**: `components/HelpDesk.tsx`

**Layout**:
1. Page Header with New Ticket button
2. Support Stats (4)
3. Tabs: Tickets | Knowledge Base | Live Chat
4. Search + Filters
5. Ticket Table or Knowledge Base

**Data Sources**:
- `supportTickets` - All tickets
- Filter by category, priority, status
- Knowledge base (to be added)

**Components to Use**:
- `PageHeader`, `StatCard`, `Tabs`, `SearchBar`, `FilterPanel`
- `DataTable`, `StatusBadge`, `PriorityBadge`, `Accordion`

**Tasks**:
- [ ] Create HelpDesk component
- [ ] Add PageHeader with New Ticket button
- [ ] Add support stats cards
- [ ] Add Tabs (Tickets | Knowledge Base | Live Chat)
- [ ] Add SearchBar and FilterPanel
- [ ] Create ticket table
- [ ] Add knowledge base search (optional)
- [ ] Style and test

---

## Implementation Order

### Week 1: Foundation
1. ✅ Update App.tsx with DashboardLayout
2. ✅ Create Overview screen
3. ✅ Create Work Orders screen

### Week 2: Core Features
4. ✅ Create Invoice screen
5. ✅ Create Payments screen

### Week 3: Advanced Features
6. ✅ Create Marketplace screen
7. ✅ Create Help Desk screen

### Week 4: Polish
8. ✅ Add loading states
9. ✅ Add error handling
10. ✅ Test all screens
11. ✅ Fix bugs and optimize

---

## Quick Start Template

### Screen Component Template

```tsx
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { 
  PageHeader, 
  StatCard, 
  SearchBar, 
  FilterPanel, 
  DataTable,
  StatusBadge,
  EmptyState,
  LoadingSpinner 
} from '@/components/shared';
import { workOrders, metrics } from '@/data';
import type { WorkOrder } from '@/data/types';

export function WorkOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  // Filter data
  const filteredData = useMemo(() => {
    let data = workOrders;
    // Apply search and filters
    return data;
  }, [searchQuery, filters]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="Work Orders"
        description="Manage and track all work orders"
        actions={<Button>Create</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active"
          value={metrics.activeWorkOrders}
          icon={ClipboardList}
        />
      </div>

      <div className="flex gap-4">
        <SearchBar
          placeholder="Search work orders..."
          onSearch={setSearchQuery}
        />
        <FilterPanel
          filters={filterConfig}
          onFilterChange={setFilters}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredData}
            columns={columns}
            pagination
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Resources

- **Wireframe Guide**: `docs/WIREFRAME_GUIDE.md`
- **Implementation Guide**: `docs/IMPLEMENTATION_GUIDE.md`
- **Data Documentation**: `data/README.md`
- **Theme System**: `styles/globals.css`

---

## Success Criteria

- [ ] All 6 screens created and functional
- [ ] All screens use data from `@/data`
- [ ] All screens use reusable components
- [ ] All screens follow theme system
- [ ] Navigation works between all screens
- [ ] Search and filters work on all screens
- [ ] Export functionality works
- [ ] Loading and empty states handled
- [ ] No console errors
- [ ] Responsive on desktop (1920x1080+)

---

**Ready to start?** Begin with Step 1: Update App.tsx with DashboardLayout.
