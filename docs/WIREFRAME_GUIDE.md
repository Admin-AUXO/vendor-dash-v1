# Vendor Dashboard Wireframe Guide

## Overview

Real Estate B2B Vendor Dashboard with 6 screens designed for desktop use (1920x1080+). Each screen serves a specific purpose in managing vendor operations.

---

## Screen 1: Overview

**Purpose**: Central hub showing business performance, KPIs, and critical alerts.

**Key Elements**:
- **4 KPI Cards**: Active Work Orders, Monthly Revenue, Outstanding Invoices, Completion Rate
- **Charts**: Weekly Revenue (Line), Service Distribution (Pie)
- **Urgent Work Orders**: Alert card with high-priority items
- **Activity Feed**: Recent actions (work orders, invoices, payments, bids)
- **Quick Actions**: Create invoice, Submit bid, View pending work orders

**Data Sources**: `metrics`, `workOrders`, `activities`, `notifications`, `weeklyRevenueData`, `serviceDistributionData`

---

## Screen 2: Work Orders

**Purpose**: Manage, track, and update all work orders.

**Key Elements**:
- **Search Bar**: Search by ID, address, client name
- **Filters**: Status, Priority, Service Category, Date Range
- **Summary Stats**: Pending, In Progress, Completed, Total
- **Data Table**: Work orders with sorting, filtering, pagination
- **Columns**: ID, Property, Service, Status, Priority, Dates, Client, Cost
- **Actions**: View details, Update status, Assign technician, Export

**Data Sources**: `workOrders` (filter by status, priority, date)

---

## Screen 3: Invoice

**Purpose**: Create, track, and manage invoices.

**Key Elements**:
- **Summary Stats**: Total Invoices, Paid Amount, Pending, Overdue
- **Search & Filters**: Search invoices, filter by status, date, client
- **Data Table**: Invoices with status, amounts, dates
- **Charts**: Revenue Timeline (Line), Status Distribution (Pie)
- **Actions**: Create invoice, Send, Mark as paid, Export, PDF preview

**Data Sources**: `invoices` (linked to work orders)

---

## Screen 4: Payments

**Purpose**: Track and manage payment transactions.

**Key Elements**:
- **Financial Summary**: Total Received, Pending, Outstanding, Net Income
- **Charts**: Payment Timeline (Line), Payment Methods (Pie)
- **Outstanding Balances**: List of overdue invoices
- **Search & Filters**: Search payments, filter by date range, method, status
- **Data Table**: Payment history with details
- **Actions**: Record payment, Export reports, Download statements

**Data Sources**: `payments`, `invoices` (for outstanding balances)

---

## Screen 5: Marketplace

**Purpose**: Discover and bid on available work opportunities.

**Key Elements**:
- **Tabs**: Available Projects | My Bids
- **Summary Stats**: Available Projects, My Bids, Won Bids, Win Rate
- **Search & Filters**: Search projects, filter by service type, budget, location
- **Project Cards/Table**: Available projects with details
- **Bid Submission**: Form to submit bids with cost breakdown
- **My Bids**: Track bid status (pending, accepted, rejected)

**Data Sources**: `marketplaceProjects`, `bids`

---

## Screen 6: Help Desk

**Purpose**: Support tickets and knowledge base access.

**Key Elements**:
- **Tabs**: Support Tickets | Knowledge Base | Live Chat
- **Summary Stats**: Open Tickets, In Progress, Resolved, Avg Response Time
- **Search & Filters**: Search tickets, filter by category, priority, status
- **Data Table**: Support tickets with status, priority, category
- **Ticket Thread**: Message conversation for each ticket
- **Knowledge Base**: Searchable articles and FAQs

**Data Sources**: `supportTickets`

---

## Reusable Elements

### Navigation
- **Sidebar**: Screen navigation with icons
- **Top Header**: Breadcrumbs, search, notifications, user menu

### Data Display
- **StatCard**: KPI cards with icons and trends
- **DataTable**: Sortable, filterable, paginated tables
- **Charts**: Line, Bar, Pie charts (Recharts)

### Forms & Inputs
- **SearchBar**: Debounced search input
- **FilterPanel**: Multi-filter sidebar
- **DateRangePicker**: Date range selection
- **FileUpload**: Drag-and-drop file uploads

### Feedback
- **StatusBadge**: Status indicators (success, warning, error, pending)
- **PriorityBadge**: Priority indicators (urgent, high, medium, low)
- **EmptyState**: No data states
- **LoadingSpinner**: Loading indicators

### Actions
- **ExportButton**: Export data (CSV, Excel, JSON)
- **AlertDialog**: Confirmation dialogs
- **Timeline**: Activity/event timeline

---

## Design Principles

- **Desktop-First**: Optimized for 1920x1080+ screens
- **Theme**: Gold/yellow (#f7d604) with consistent styling
- **Spacing**: 8px grid system
- **Typography**: Inter (body) + Space Grotesk (headings)
- **Accessibility**: Keyboard navigation, ARIA labels, screen reader support

---

## Data Models

- **Work Orders**: Properties, services, status, priority, costs
- **Invoices**: Linked to work orders, line items, payment status
- **Payments**: Linked to invoices, payment methods, status
- **Marketplace Projects**: Available projects with budgets
- **Bids**: Submitted bids with cost breakdowns
- **Support Tickets**: Tickets with categories, priorities, messages
- **Clients**: Client information and history
- **Activities**: Activity feed items
- **Notifications**: System alerts and updates

All data available in `@/data` - see `data/README.md` for details.

