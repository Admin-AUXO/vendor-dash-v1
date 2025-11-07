# Implementation Guide

## Quick Reference

### Component Structure
```
components/
├── screens/          # Screen components (to be created)
│   ├── Overview.tsx
│   ├── WorkOrders.tsx
│   ├── Invoice.tsx
│   ├── Payments.tsx
│   ├── Marketplace.tsx
│   └── HelpDesk.tsx
├── shared/          # Reusable components (ready)
└── ui/              # UI primitives (ready)
```

### Data Usage
```tsx
import { workOrders, invoices, payments, metrics } from '@/data';
```

### Theme Usage
```tsx
// Colors
className="bg-primary text-primary-foreground"
className="bg-gold-400 text-gold-700"

// Typography
<h1 className="font-display text-3xl font-bold">Title</h1>
<p className="font-sans text-sm">Body text</p>
```

### Standard Screen Layout
```tsx
<div className="p-6 space-y-6 bg-gray-50 min-h-screen">
  {/* Page Header */}
  <PageHeader title="Screen Title" description="Description" />
  
  {/* Stat Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard {...stat1} />
    <StatCard {...stat2} />
  </div>
  
  {/* Search & Filters */}
  <div className="flex gap-4">
    <SearchBar placeholder="Search..." onSearch={setSearch} />
    <FilterPanel filters={filterConfig} onFilterChange={setFilters} />
  </div>
  
  {/* Data Table */}
  <Card>
    <CardHeader>
      <CardTitle>Data</CardTitle>
    </CardHeader>
    <CardContent>
      <DataTable data={filteredData} columns={columns} />
    </CardContent>
  </Card>
</div>
```

## Available Components

### Shared Components
- `PageHeader` - Page title and actions
- `StatCard` - KPI cards
- `DataTable` - Sortable, filterable tables
- `SearchBar` - Search with debouncing
- `FilterPanel` - Advanced filtering
- `StatusBadge` - Status indicators
- `PriorityBadge` - Priority indicators
- `EmptyState` - Empty states
- `LoadingSpinner` - Loading indicators
- `Timeline` - Activity timelines
- `DateRangePicker` - Date selection
- `FileUpload` - File uploads
- `ExportButton` - Data export
- `AlertDialog` - Confirmation dialogs
- `Sidebar` - Navigation sidebar
- `TopHeader` - Top header bar
- `UserProfile` - User profile card
- `DashboardLayout` - Complete layout wrapper

### UI Primitives
- `Button`, `Card`, `Input`, `Textarea`, `Badge`
- `Select`, `Checkbox`, `RadioGroup`, `Switch`
- `Tabs`, `Dialog`, `Tooltip`, `Progress`
- `Avatar`, `ScrollArea`, `Separator`, `Label`
- `Accordion`, `Collapsible`

## Data Structure

Import from `@/data`:
- `workOrders` - All work orders
- `invoices` - All invoices
- `payments` - All payments
- `marketplaceProjects` - Available projects
- `bids` - Submitted bids
- `supportTickets` - Support tickets
- `clients` - Client data
- `activities` - Activity feed
- `notifications` - Notifications
- `vendor` - Vendor profile
- `metrics` - Dashboard KPIs

Helper functions:
- `getWorkOrdersByStatus(status)`
- `getInvoicesByStatus(status)`
- `weeklyRevenueData`, `monthlyRevenueData`
- `serviceDistributionData`

## Theme System

**Colors**: Use CSS variables (`--primary`, `--gold-400`, etc.)
**Typography**: `font-display` for headings, `font-sans` for body
**Spacing**: 8px grid (`p-6`, `gap-4`, `space-y-6`)
**Shadows**: `shadow-md`, `shadow-lg`

See `styles/globals.css` for all theme variables.

---

For detailed documentation, see:
- `WIREFRAME_GUIDE.md` - Screen specifications
- `data/README.md` - Data structure details

