# Dashboard Data

This directory contains all dummy data and data generation utilities for the vendor dashboard.

## Structure

```
data/
├── types.ts              # TypeScript type definitions
├── generators.ts         # Data generation functions (used by generation script)
├── index.ts             # Main data export - loads from pre-generated JSON files
├── generated/           # Pre-generated JSON data files
│   ├── workOrders.json
│   ├── invoices.json
│   ├── payments.json
│   └── ... (other data files)
└── README.md            # This file
```

## Data Generation

Data is pre-generated as JSON files to avoid bundling faker.js (2.4MB) in production. 

### Generating New Data

To regenerate all data files:

```bash
npm run generate-data
```

This will:
1. Use the generators in `generators.ts` (which require faker.js)
2. Generate sufficient data for all dashboard features
3. Save all data as JSON files in `data/generated/`

**Note:** Faker.js is now a dev dependency, so it's only needed during data generation, not in production builds.

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

### Regenerating Data

If you need to regenerate the data (e.g., to add more records or update the data structure):

1. Run the generation script:
   ```bash
   npm run generate-data
   ```

2. The script will generate new JSON files in `data/generated/` with the following counts:
   - Work Orders: 100
   - Invoices: 50
   - Payments: 40
   - Marketplace Projects: 40
   - Bids: 50
   - Support Tickets: 30
   - Clients: 20
   - Activities: 150
   - Notifications: 30
   - Knowledge Base Articles: 30

3. To change the data amounts, edit `scripts/generate-data.ts` and modify the count constants.

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

