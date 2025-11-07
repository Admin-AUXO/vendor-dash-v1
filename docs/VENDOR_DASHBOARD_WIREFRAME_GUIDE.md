# Real Estate B2B Vendor Dashboard - Wireframe Design Guide

## Overview

This document outlines the purpose, contents, use cases, and reusable elements for each screen in the vendor dashboard. The dashboard is designed for desktop use only and serves real estate B2B vendors managing their operations.

---

## 1. Overview Screen

### Purpose
Provide vendors with a comprehensive snapshot of their business performance, key metrics, and critical alerts at a glance. This is the central hub for quick assessment of business health.

### Contents

#### Key Performance Indicators (KPIs)
- **Active Work Orders**: Count of pending, in progress, and completed work orders
- **Financial Metrics**: 
  - Total earnings (monthly/quarterly/yearly)
  - Outstanding invoices amount
  - Recent payments received
  - Pending payments
- **Marketplace Activity**: 
  - Active bids submitted
  - Projects won/lost
  - Available opportunities
- **Business Health Score**: Overall performance indicator
- **Response Time**: Average time to respond to work orders

#### Recent Activity Feed
- Chronological list of recent actions:
  - New work orders assigned
  - Invoice submissions and approvals
  - Payment receipts
  - Bid status updates
  - Client communications
  - System notifications

#### Notifications & Alerts
- Overdue invoices
- Upcoming deadlines
- New work order assignments
- Payment reminders
- Bid status updates
- System announcements
- Low inventory alerts (if applicable)

#### Quick Actions
- Create new invoice
- Submit new bid
- View pending work orders
- Access help/support
- View reports

#### Charts & Visualizations
- **Revenue Trend**: Line chart showing revenue over time (weekly/monthly)
- **Service Distribution**: Pie/Donut chart showing distribution of services
- **Work Order Status**: Bar chart showing status breakdown
- **Performance Trends**: Comparison charts (month-over-month, year-over-year)

### Use Cases
1. **Daily Check-in**: Vendor opens dashboard to see today's priorities
2. **Performance Review**: Review KPIs to assess business health
3. **Quick Navigation**: Access most common actions quickly
4. **Alert Monitoring**: Check for urgent items requiring attention
5. **Trend Analysis**: View charts to understand business patterns

### Reusable Elements
- StatCard (for KPIs)
- ActivityTimeline (for recent activity)
- AlertCard (for notifications)
- QuickActionButton (for quick actions)
- Chart components (Line, Bar, Pie)
- StatusBadge (for status indicators)

---

## 2. Work Orders Screen

### Purpose
Manage, track, and update all work orders. Provides comprehensive view of work order lifecycle from assignment to completion.

### Contents

#### Work Order List/Table
- **Columns**:
  - Work Order ID
  - Property Address
  - Service Type
  - Status (Pending, In Progress, Completed, Cancelled)
  - Priority (Urgent, High, Medium, Low)
  - Assigned Technician
  - Due Date
  - Client Name
  - Estimated Cost
  - Actions (View, Edit, Update Status)

#### Filters & Search
- **Search**: By work order ID, property address, client name
- **Filters**:
  - Status (dropdown)
  - Priority (dropdown)
  - Service Category (dropdown)
  - Date Range (date picker)
  - Assigned Technician (dropdown)
  - Client (dropdown)

#### Summary Statistics
- Total Work Orders
- Pending Count
- In Progress Count
- Completed Count
- Overdue Count
- Average Completion Time

#### Work Order Details (Modal/Expanded View)
- **Basic Information**:
  - Work Order ID, Property Address, Service Type
  - Status, Priority, Due Date
  - Assigned Technician, Client Information
- **Description & Notes**:
  - Work description
  - Special instructions
  - Client notes
- **Timeline**:
  - Creation date
  - Status changes
  - Completion date
- **Documents**:
  - Photos
  - Invoices
  - Signed documents
- **Actions**:
  - Update Status
  - Assign Technician
  - Add Notes
  - Upload Documents
  - Create Invoice

### Use Cases
1. **Daily Management**: View and manage today's work orders
2. **Status Updates**: Update work order status as work progresses
3. **Assignment**: Assign technicians to work orders
4. **Tracking**: Track progress of multiple work orders
5. **Reporting**: Filter and export work order data
6. **Client Communication**: Access client information and history

### Reusable Elements
- DataTable (for work order list)
- SearchBar (for searching)
- FilterPanel (for filtering)
- StatusBadge (for status)
- PriorityBadge (for priority)
- DateRangePicker (for date filtering)
- Modal/Dialog (for details view)
- Timeline (for work order history)
- FileUpload (for documents)
- ExportButton (for exporting data)

---

## 3. Invoice Screen

### Purpose
Create, track, and manage invoices. Handle invoice lifecycle from creation to payment.

### Contents

#### Invoice List/Table
- **Columns**:
  - Invoice Number
  - Work Order ID (linked)
  - Client Name
  - Invoice Date
  - Due Date
  - Amount
  - Status (Draft, Sent, Paid, Overdue, Cancelled)
  - Payment Date
  - Actions (View, Edit, Send, Mark Paid, Export)

#### Filters & Search
- **Search**: By invoice number, work order ID, client name
- **Filters**:
  - Status (dropdown)
  - Date Range (date picker)
  - Client (dropdown)
  - Amount Range (slider/input)
  - Payment Status (dropdown)

#### Summary Statistics
- Total Invoices
- Total Amount
- Paid Amount
- Pending Amount
- Overdue Amount
- Average Payment Time

#### Invoice Creation/Edit Form
- **Basic Information**:
  - Invoice Number (auto-generated)
  - Work Order (dropdown/link)
  - Client Information
  - Invoice Date
  - Due Date
- **Line Items**:
  - Service Description
  - Quantity
  - Unit Price
  - Total
  - Add/Remove items
- **Totals**:
  - Subtotal
  - Tax
  - Discount
  - Total Amount
- **Additional Information**:
  - Notes
  - Terms & Conditions
  - Payment Instructions

#### Invoice Detail View
- Full invoice details
- PDF Preview
- Payment History
- Status Timeline
- Related Documents
- Actions (Edit, Send, Mark Paid, Export PDF, Cancel)

#### Charts
- **Revenue Timeline**: Line chart showing invoice amounts over time
- **Status Distribution**: Pie chart showing invoice status breakdown
- **Payment Trends**: Bar chart showing payment patterns

### Use Cases
1. **Invoice Creation**: Create new invoices from work orders
2. **Invoice Tracking**: Track invoice status and payment
3. **Payment Recording**: Record payments received
4. **Reporting**: Generate invoice reports and exports
5. **Client Communication**: Send invoices to clients
6. **Financial Analysis**: Analyze revenue and payment trends

### Reusable Elements
- DataTable (for invoice list)
- SearchBar (for searching)
- FilterPanel (for filtering)
- StatusBadge (for status)
- InvoiceForm (for creating/editing)
- PDFPreview (for invoice preview)
- Chart components (Line, Bar, Pie)
- ExportButton (for exporting)
- DateRangePicker (for date filtering)

---

## 4. Payments Screen

### Purpose
Track and manage payment transactions. Monitor cash flow and payment history.

### Contents

#### Payment List/Table
- **Columns**:
  - Payment ID
  - Invoice Number (linked)
  - Client Name
  - Payment Date
  - Amount
  - Payment Method (Cash, Check, Credit Card, Bank Transfer, Other)
  - Status (Completed, Pending, Failed)
  - Reference Number
  - Actions (View, Edit, Delete, Export)

#### Filters & Search
- **Search**: By payment ID, invoice number, client name, reference number
- **Filters**:
  - Payment Method (dropdown)
  - Status (dropdown)
  - Date Range (date picker)
  - Amount Range (slider/input)
  - Client (dropdown)

#### Financial Summary
- **Total Received**: Sum of all completed payments
- **Pending Payments**: Sum of pending payments
- **Outstanding Invoices**: Sum of unpaid invoices
- **Net Income**: Total received minus expenses
- **This Month/Quarter/Year**: Period-based summaries

#### Outstanding Balances
- List of invoices with outstanding balances
- Overdue invoices highlighted
- Quick actions to send reminders

#### Payment Recording Form
- **Basic Information**:
  - Invoice (dropdown/link)
  - Payment Date
  - Payment Method
  - Amount
  - Reference Number
- **Additional Information**:
  - Notes
  - Receipt Upload
  - Bank Details (if applicable)

#### Charts
- **Payment Timeline**: Line chart showing payments over time
- **Payment Methods**: Pie chart showing payment method distribution
- **Revenue Trends**: Bar chart comparing periods

### Use Cases
1. **Payment Recording**: Record payments received
2. **Cash Flow Monitoring**: Monitor cash flow and revenue
3. **Outstanding Tracking**: Track outstanding invoices
4. **Reporting**: Generate payment reports
5. **Reconciliation**: Reconcile payments with invoices
6. **Financial Analysis**: Analyze payment trends and methods

### Reusable Elements
- DataTable (for payment list)
- SearchBar (for searching)
- FilterPanel (for filtering)
- StatusBadge (for status)
- PaymentForm (for recording payments)
- Chart components (Line, Bar, Pie)
- ExportButton (for exporting)
- DateRangePicker (for date filtering)
- FileUpload (for receipts)

---

## 5. Marketplace Screen

### Purpose
Discover and bid on available work opportunities. Manage bids and track project outcomes.

### Contents

#### Available Projects List/Table
- **Columns**:
  - Project ID
  - Project Title
  - Service Category
  - Location
  - Budget Range
  - Deadline
  - Status (Open, Closed, Awarded)
  - Number of Bids
  - Actions (View Details, Submit Bid)

#### Filters & Search
- **Search**: By project title, location, service category
- **Filters**:
  - Service Category (dropdown)
  - Budget Range (slider/input)
  - Location (dropdown/map)
  - Deadline (date picker)
  - Status (dropdown)

#### Marketplace Statistics
- Available Projects
- My Bids Submitted
- Bids Won
- Win Rate
- Average Bid Amount
- Total Project Value

#### Project Details (Modal/Expanded View)
- **Project Information**:
  - Project Title, Description
  - Service Category, Location
  - Budget Range, Deadline
  - Required Qualifications
- **Requirements**:
  - Scope of work
  - Timeline
  - Special requirements
- **Client Information**:
  - Client name (if visible)
  - Previous projects
  - Rating/Reviews
- **Bidding Information**:
  - Current bids count
  - Average bid amount
  - Your bid (if submitted)

#### Bid Submission Form
- **Bid Information**:
  - Project (auto-filled)
  - Bid Amount
  - Proposed Timeline
  - Terms & Conditions
- **Cost Breakdown**:
  - Labor
  - Materials
  - Overhead
  - Profit Margin
  - Total
- **Proposal**:
  - Approach/Methodology
  - Qualifications
  - Previous Work (portfolio)
  - References

#### My Bids Section
- List of submitted bids
- Bid status (Pending, Accepted, Rejected, Withdrawn)
- Project information
- Bid amount and timeline
- Actions (View, Edit, Withdraw)

### Use Cases
1. **Opportunity Discovery**: Browse available projects
2. **Bid Submission**: Submit bids on projects
3. **Bid Management**: Track submitted bids
4. **Project Analysis**: Analyze project requirements and competition
5. **Portfolio Showcase**: Showcase previous work in bids
6. **Win Rate Analysis**: Analyze bidding success

### Reusable Elements
- DataTable (for project/bid list)
- SearchBar (for searching)
- FilterPanel (for filtering)
- StatusBadge (for status)
- ProjectCard (for project display)
- BidForm (for submitting bids)
- Chart components (for analytics)
- ExportButton (for exporting)
- FileUpload (for portfolio documents)

---

## 6. Help Desk Screen

### Purpose
Access support, manage support tickets, and find solutions through knowledge base.

### Contents

#### Support Tickets List/Table
- **Columns**:
  - Ticket ID
  - Subject
  - Category (Technical, Billing, Account, General)
  - Priority (Urgent, High, Medium, Low)
  - Status (Open, In Progress, Resolved, Closed)
  - Created Date
  - Last Updated
  - Assigned To
  - Actions (View, Reply, Close)

#### Filters & Search
- **Search**: By ticket ID, subject, description
- **Filters**:
  - Category (dropdown)
  - Priority (dropdown)
  - Status (dropdown)
  - Date Range (date picker)
  - Assigned To (dropdown)

#### Support Statistics
- Open Tickets
- In Progress Tickets
- Resolved Tickets
- Average Response Time
- Average Resolution Time
- Satisfaction Rating

#### Ticket Detail View
- **Ticket Information**:
  - Ticket ID, Subject, Category
  - Priority, Status
  - Created Date, Last Updated
  - Assigned To
- **Conversation Thread**:
  - Initial message
  - Replies (chronological)
  - Internal notes (if applicable)
- **Attachments**:
  - Files, Screenshots
  - Documents
- **Actions**:
  - Reply
  - Add Internal Note
  - Change Status
  - Change Priority
  - Assign To
  - Close Ticket
  - Attach Files

#### Ticket Creation Form
- **Basic Information**:
  - Subject
  - Category
  - Priority
  - Description
- **Additional Information**:
  - Attachments
  - Related Items (Work Order, Invoice, etc.)

#### Knowledge Base
- **Categories**:
  - Getting Started
  - Account Management
  - Billing & Payments
  - Work Orders
  - Invoicing
  - Marketplace
  - Technical Support
- **Search**: Search articles by keyword
- **Articles**: List of articles with titles and descriptions
- **Article Detail**: Full article content with formatting

#### Live Chat (Optional)
- Real-time chat with support
- Chat history
- File sharing
- Screen sharing (if applicable)

### Use Cases
1. **Issue Reporting**: Create support tickets for issues
2. **Ticket Management**: Track and manage support tickets
3. **Knowledge Access**: Find solutions in knowledge base
4. **Communication**: Communicate with support team
5. **Issue Resolution**: Track issue resolution progress
6. **Self-Service**: Find answers without creating tickets

### Reusable Elements
- DataTable (for ticket list)
- SearchBar (for searching)
- FilterPanel (for filtering)
- StatusBadge (for status)
- PriorityBadge (for priority)
- TicketForm (for creating tickets)
- MessageThread (for conversation)
- KnowledgeBase (for articles)
- Accordion (for FAQ sections)
- FileUpload (for attachments)

---

## Reusable Elements Summary

### Navigation Components
- **Sidebar**: Main navigation with menu items
- **TopHeader**: Header with breadcrumbs, search, notifications, user menu
- **Breadcrumbs**: Navigation breadcrumbs
- **Tabs**: Tab navigation for screen sections

### Data Display Components
- **StatCard**: KPI/metric cards with icons and trends
- **DataTable**: Sortable, filterable, paginated data table
- **Card**: Container card with header, content, footer
- **Timeline**: Activity/event timeline
- **List**: List display with items
- **EmptyState**: Empty state when no data
- **LoadingSpinner**: Loading indicator

### Form Components
- **SearchBar**: Search input with debouncing
- **FilterPanel**: Advanced filtering panel
- **DateRangePicker**: Date range selection
- **Input**: Text input field
- **Textarea**: Multi-line text input
- **Select**: Dropdown select
- **Checkbox**: Checkbox input
- **RadioGroup**: Radio button group
- **FileUpload**: File upload with drag-and-drop
- **Form**: Form container with validation

### Feedback Components
- **StatusBadge**: Status indicator badge
- **PriorityBadge**: Priority indicator badge
- **Alert**: Alert/notification message
- **Toast**: Toast notification
- **Tooltip**: Tooltip for additional info
- **Progress**: Progress indicator

### Action Components
- **Button**: Primary action button
- **IconButton**: Icon-only button
- **DropdownMenu**: Dropdown menu
- **Modal**: Modal dialog
- **ConfirmDialog**: Confirmation dialog
- **ExportButton**: Export data button
- **PrintButton**: Print button

### Chart Components
- **LineChart**: Line chart for trends
- **BarChart**: Bar chart for comparisons
- **PieChart**: Pie chart for distributions
- **AreaChart**: Area chart for cumulative data

---

## Design Principles

### Desktop-First Design
- Optimized for 1920x1080 and larger screens
- Responsive grid system
- Sidebar navigation (always visible)
- Multi-column layouts

### Information Hierarchy
- Clear visual hierarchy
- Important information prominent
- Progressive disclosure
- Consistent spacing and alignment

### Color Coding
- Status colors (green, yellow, red, blue)
- Priority colors (urgent, high, medium, low)
- Category colors (for categorization)
- Theme colors (gold/yellow primary)

### Accessibility
- Keyboard navigation
- Screen reader support
- ARIA labels
- Focus indicators
- Color contrast compliance

### Performance
- Lazy loading for screens
- Virtual scrolling for large lists
- Debounced search
- Optimized re-renders
- Code splitting

---

## Data Models

### Work Order
- ID, Property Address, Service Type
- Status, Priority, Due Date
- Assigned Technician, Client
- Cost, Description, Notes
- Timeline, Documents

### Invoice
- Invoice Number, Work Order ID
- Client, Invoice Date, Due Date
- Amount, Status, Payment Date
- Line Items, Totals
- Notes, Terms

### Payment
- Payment ID, Invoice Number
- Client, Payment Date, Amount
- Payment Method, Status
- Reference Number, Receipt

### Marketplace Project
- Project ID, Title, Description
- Service Category, Location
- Budget Range, Deadline
- Status, Requirements
- Client Information

### Bid
- Bid ID, Project ID
- Vendor, Bid Amount
- Timeline, Proposal
- Status, Cost Breakdown

### Support Ticket
- Ticket ID, Subject, Category
- Priority, Status
- Messages, Attachments
- Assigned To, Timeline

### Client
- Client ID, Name, Contact
- Address, Properties
- History, Preferences

### Activity
- Activity ID, Type
- Description, Timestamp
- Related Item, User

### Notification
- Notification ID, Type
- Message, Timestamp
- Read Status, Action

---

## Implementation Notes

### Screen Navigation
- Use sidebar for main navigation
- Use breadcrumbs for page hierarchy
- Use tabs for screen sections
- Maintain state between navigation

### Data Loading
- Lazy load screen components
- Load data on screen mount
- Cache data where appropriate
- Handle loading and error states

### State Management
- Use React hooks for local state
- Use context for global state
- Use URL params for filters/search
- Persist preferences in localStorage

### Performance Optimization
- Virtualize long lists
- Debounce search inputs
- Memoize expensive calculations
- Code split by route

### Error Handling
- Display user-friendly error messages
- Handle network errors gracefully
- Validate user input
- Provide fallback UI

---

**This guide serves as the comprehensive reference for building the vendor dashboard wireframe. All screens should follow these specifications while maintaining consistency in design and functionality.**

