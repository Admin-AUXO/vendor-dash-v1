# Dashboard Data

This directory contains all dummy data and data generation utilities for the vendor dashboard.

## Structure

```
data/
├── types.ts          # TypeScript type definitions
├── generators.ts     # Data generation functions
├── index.ts         # Main data export and helpers
└── README.md        # This file
```

## Usage

### Import Pre-generated Data

```tsx
import {
  workOrders,
  invoices,
  payments,
  marketplaceProjects,
  bids,
  supportTickets,
  clients,
  activities,
  notifications,
  vendor,
  metrics,
} from '@/data';

// Use the data in your components
function MyComponent() {
  const pendingWorkOrders = workOrders.filter(wo => wo.status === 'pending');
  return <div>{/* Your component */}</div>;
}
```

### Generate Custom Data

```tsx
import { generateWorkOrders, generateInvoices } from '@/data';

// Generate custom amount of data
const customWorkOrders = generateWorkOrders(100);
const customInvoices = generateInvoices(customWorkOrders, 80);
```

### Use Helper Functions

```tsx
import {
  getWorkOrdersByStatus,
  getInvoicesByStatus,
  getPaymentsByStatus,
  weeklyRevenueData,
  monthlyRevenueData,
} from '@/data';

// Get filtered data
const completedWorkOrders = getWorkOrdersByStatus('completed');
const paidInvoices = getInvoicesByStatus('paid');
const completedPayments = getPaymentsByStatus('completed');

// Use chart data
const chartData = weeklyRevenueData;
```

## Data Models

### Work Orders
- 50 work orders by default
- Various statuses: pending, assigned, in-progress, completed, cancelled
- Priorities: urgent, high, medium, low
- Includes property details, client info, costs, and timeline

### Invoices
- 40 invoices by default
- Linked to completed work orders
- Statuses: draft, sent, viewed, approved, paid, overdue, disputed
- Includes line items, taxes, and payment information

### Payments
- 35 payments by default
- Linked to paid invoices
- Payment methods: check, ACH, wire, credit-card, cash
- Statuses: pending, completed, failed, refunded

### Marketplace Projects
- 30 projects by default
- Statuses: open, in-review, awarded, closed
- Includes budget ranges, deadlines, and bid counts
- Some projects are confidential

### Bids
- 25 bids by default
- Linked to marketplace projects
- Statuses: pending, under-review, accepted, rejected, withdrawn
- Includes cost breakdown and timeline

### Support Tickets
- 20 tickets by default
- Categories: technical, billing, account, feature-request, bug
- Priorities: low, medium, high, urgent
- Includes message threads

### Clients
- 10 clients by default
- Various types: property-management, real-estate, individual, corporate
- Includes contact info, work order history, and ratings

### Activities
- 100 activities by default
- Chronological feed of all actions
- Includes work orders, invoices, payments, bids, tickets

### Notifications
- 15 notifications by default
- Types: info, success, warning, error
- Includes overdue invoices, urgent work orders, system updates

### Vendor
- Single vendor profile
- Includes company info, ratings, earnings, membership type

### Metrics
- Dashboard KPIs
- Calculated from all data
- Includes earnings, completion rates, response times

## Customization

To customize the data:

1. **Change default counts**: Edit `data/index.ts` and modify the counts passed to generators
2. **Add more sample data**: Edit `data/generators.ts` and add more items to the sample arrays
3. **Modify data structure**: Update types in `data/types.ts` and adjust generators accordingly

## Example: Adding More Clients

```tsx
// In data/generators.ts, add to clientNames array
const clientNames = [
  'Green Property Management',
  'Metro Realty Group',
  // ... add more names
  'New Client Name',
];
```

## Example: Generating More Work Orders

```tsx
// In your component or data/index.ts
import { generateWorkOrders } from '@/data';

const moreWorkOrders = generateWorkOrders(200); // Generate 200 work orders
```

## Data Relationships

- **Work Orders** → **Invoices**: Completed work orders generate invoices
- **Invoices** → **Payments**: Paid invoices have associated payments
- **Marketplace Projects** → **Bids**: Projects receive bids from vendors
- **Work Orders/Invoices** → **Activities**: Actions create activity feed items
- **All Entities** → **Notifications**: Various events trigger notifications

## Notes

- All dates are ISO 8601 format strings
- All monetary values are in USD
- IDs are auto-generated with prefixes (WO-, INV-, PAY-, etc.)
- Data is randomly generated but maintains realistic relationships
- Timestamps are relative to current date (within last 90 days typically)

