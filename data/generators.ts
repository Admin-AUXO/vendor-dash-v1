/**
 * Data Generators
 * 
 * Utility functions to generate realistic dummy data for the dashboard
 */

import { 
  WorkOrder, 
  Invoice, 
  Payment, 
  MarketplaceProject, 
  Bid, 
  SupportTicket, 
  Client, 
  Activity, 
  Notification,
  Vendor,
  DashboardMetrics,
  TimeSeriesData,
  ChartDataPoint
} from './types';
import { subDays, subMonths, format, addDays } from 'date-fns';

// Helper function to pick random element from array
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to random number in range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate ID
function generateId(prefix: string, index: number): string {
  return `${prefix}-${String(index).padStart(4, '0')}`;
}

// Sample data pools
const propertyAddresses = [
  '123 Main Street, Apt 201',
  '456 Oak Avenue, Unit 15',
  '789 Pine Road, Suite 302',
  '321 Elm Street, #405',
  '654 Maple Drive, Unit 12',
  '987 Cedar Lane, Apt 8',
  '147 Birch Boulevard, Suite 201',
  '258 Spruce Way, Unit 5',
  '369 Willow Court, Apt 301',
  '741 Ash Street, #102',
  '852 Cherry Avenue, Unit 9',
  '963 Poplar Road, Suite 401',
  '159 Hickory Drive, Apt 15',
  '357 Walnut Lane, Unit 7',
  '468 Chestnut Boulevard, #203',
];

const clientNames = [
  'Green Property Management',
  'Metro Realty Group',
  'Elite Properties LLC',
  'Summit Rentals',
  'Premier Property Services',
  'Apex Real Estate',
  'Crown Property Management',
  'Sterling Rentals',
  'Horizon Properties',
  'Nexus Realty',
];

const serviceDescriptions = [
  'Plumbing leak repair',
  'HVAC system maintenance',
  'Electrical outlet installation',
  'Carpentry door repair',
  'Painting interior walls',
  'Landscaping lawn maintenance',
  'Appliance dishwasher repair',
  'General cleaning service',
  'Roof inspection and repair',
  'Window replacement',
  'Flooring installation',
  'Bathroom renovation',
  'Kitchen cabinet repair',
  'Gutter cleaning',
  'Fence repair',
];

const technicianNames = [
  'John Smith',
  'Mike Johnson',
  'David Wilson',
  'Robert Brown',
  'James Davis',
  'William Miller',
  'Richard Garcia',
  'Joseph Martinez',
  'Thomas Anderson',
  'Charles Taylor',
];

// Generate Work Orders
export function generateWorkOrders(count: number = 50): WorkOrder[] {
  const statuses: WorkOrder['status'][] = ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'];
  const priorities: WorkOrder['priority'][] = ['urgent', 'high', 'medium', 'low'];
  const propertyTypes: WorkOrder['propertyType'][] = ['residential', 'commercial', 'industrial', 'mixed-use'];
  const serviceCategories: WorkOrder['serviceCategory'][] = ['plumbing', 'hvac', 'electrical', 'carpentry', 'painting', 'landscaping', 'appliance', 'general'];

  const workOrders: WorkOrder[] = [];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const requestDate = subDays(now, randomInt(0, 90));
    const dueDate = addDays(requestDate, randomInt(1, 14));
    const status = randomElement(statuses);
    const isCompleted = status === 'completed';
    const completedDate = isCompleted ? subDays(now, randomInt(0, 30)) : undefined;

    workOrders.push({
      id: `wo-${i}`,
      workOrderId: generateId('WO', i),
      propertyAddress: randomElement(propertyAddresses),
      propertyType: randomElement(propertyTypes),
      serviceCategory: randomElement(serviceCategories),
      serviceDescription: randomElement(serviceDescriptions),
      status,
      priority: randomElement(priorities),
      requestDate: requestDate.toISOString(),
      dueDate: dueDate.toISOString(),
      completedDate: completedDate?.toISOString(),
      clientId: `client-${randomInt(1, 10)}`,
      clientName: randomElement(clientNames),
      clientContact: `Contact ${i}`,
      clientPhone: `(555) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
      clientEmail: `client${randomInt(1, 10)}@example.com`,
      assignedTechnician: status !== 'pending' ? randomElement(technicianNames) : undefined,
      estimatedHours: randomInt(2, 16),
      actualHours: isCompleted ? randomInt(2, 20) : undefined,
      estimatedCost: randomInt(200, 5000),
      actualCost: isCompleted ? randomInt(200, 5500) : undefined,
      notes: status === 'completed' ? 'Work completed successfully' : undefined,
    });
  }

  return workOrders;
}

// Generate Invoices
export function generateInvoices(workOrders: WorkOrder[], count: number = 40): Invoice[] {
  const statuses: Invoice['status'][] = ['draft', 'sent', 'viewed', 'approved', 'paid', 'overdue', 'disputed'];
  const paymentTerms = ['Net 15', 'Net 30', 'Due on Receipt', 'Net 7'];
  
  const invoices: Invoice[] = [];
  const completedWorkOrders = workOrders.filter(wo => wo.status === 'completed');
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const workOrder = randomElement(completedWorkOrders);
    const issueDate = workOrder.completedDate ? new Date(workOrder.completedDate) : subDays(now, randomInt(0, 60));
    const dueDate = addDays(issueDate, randomInt(7, 30));
    const status = randomElement(statuses);
    const isPaid = status === 'paid';
    const paidDate = isPaid ? addDays(issueDate, randomInt(1, 30)).toISOString() : undefined;

    const lineItems = [
      {
        id: `item-${i}-1`,
        description: workOrder.serviceDescription,
        quantity: 1,
        unitPrice: workOrder.actualCost || workOrder.estimatedCost,
        taxRate: 0.08,
        total: (workOrder.actualCost || workOrder.estimatedCost) * 1.08,
      },
    ];

    const subtotal = lineItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const taxAmount = lineItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity * item.taxRate), 0);
    const total = subtotal + taxAmount;

    invoices.push({
      id: `inv-${i}`,
      invoiceNumber: generateId('INV', i),
      workOrderId: workOrder.id,
      clientId: workOrder.clientId,
      clientName: workOrder.clientName,
      clientAddress: workOrder.propertyAddress,
      clientEmail: workOrder.clientEmail,
      propertyAddress: workOrder.propertyAddress,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      paidDate,
      status,
      lineItems,
      subtotal,
      taxAmount,
      total,
      paymentTerms: randomElement(paymentTerms),
      notes: status === 'paid' ? 'Payment received on time' : undefined,
    });
  }

  return invoices;
}

// Generate Payments
export function generatePayments(invoices: Invoice[], count: number = 35): Payment[] {
  const paymentMethods: Payment['paymentMethod'][] = ['check', 'ach', 'wire', 'credit-card', 'cash'];
  const statuses: Payment['status'][] = ['pending', 'completed', 'failed', 'refunded'];
  
  const payments: Payment[] = [];
  const paidInvoices = invoices.filter(inv => inv.status === 'paid' && inv.paidDate);

  for (let i = 1; i <= count && i <= paidInvoices.length; i++) {
    const invoice = paidInvoices[i - 1];
    const paymentDate = invoice.paidDate ? new Date(invoice.paidDate) : new Date();

    payments.push({
      id: `pay-${i}`,
      paymentId: generateId('PAY', i),
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      workOrderId: invoice.workOrderId,
      clientId: invoice.clientId,
      clientName: invoice.clientName,
      paymentDate: paymentDate.toISOString(),
      amount: invoice.total,
      paymentMethod: randomElement(paymentMethods),
      status: randomElement(statuses),
      referenceNumber: `REF-${randomInt(10000, 99999)}`,
      processedBy: randomElement(technicianNames),
    });
  }

  return payments;
}

// Generate Marketplace Projects
export function generateMarketplaceProjects(count: number = 30): MarketplaceProject[] {
  const statuses: MarketplaceProject['status'][] = ['open', 'in-review', 'awarded', 'closed'];
  const propertyTypes: MarketplaceProject['propertyType'][] = ['residential', 'commercial', 'industrial'];
  const serviceCategories: MarketplaceProject['serviceCategory'][] = ['plumbing', 'hvac', 'electrical', 'carpentry', 'painting', 'landscaping'];
  
  const projects: MarketplaceProject[] = [];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const postedDate = subDays(now, randomInt(0, 60));
    const deadline = addDays(postedDate, randomInt(7, 30));
    const isConfidential = Math.random() > 0.5;

    projects.push({
      id: `proj-${i}`,
      projectId: generateId('PROJ', i),
      propertyAddress: randomElement(propertyAddresses),
      propertyType: randomElement(propertyTypes),
      serviceCategory: randomElement(serviceCategories),
      projectDescription: randomElement(serviceDescriptions),
      budgetMin: randomInt(1000, 5000),
      budgetMax: randomInt(5000, 15000),
      postedDate: postedDate.toISOString(),
      deadline: deadline.toISOString(),
      clientName: isConfidential ? undefined : randomElement(clientNames),
      isConfidential,
      status: randomElement(statuses),
      numberOfBids: randomInt(0, 15),
      location: {
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
      },
    });
  }

  return projects;
}

// Generate Bids
export function generateBids(projects: MarketplaceProject[], count: number = 25): Bid[] {
  const statuses: Bid['status'][] = ['pending', 'under-review', 'accepted', 'rejected', 'withdrawn'];
  
  const bids: Bid[] = [];
  const openProjects = projects.filter(p => p.status === 'open' || p.status === 'in-review');
  const now = new Date();

  for (let i = 1; i <= count && openProjects.length > 0; i++) {
    const project = randomElement(openProjects);
    const proposedCost = randomInt(project.budgetMin, project.budgetMax);
    const submittedDate = subDays(now, randomInt(0, 30));
    const status = randomElement(statuses);

    bids.push({
      id: `bid-${i}`,
      bidId: generateId('BID', i),
      projectId: project.id,
      vendorId: 'vendor-1',
      proposedCost,
      costBreakdown: {
        materials: Math.round(proposedCost * 0.4),
        labor: Math.round(proposedCost * 0.5),
        other: Math.round(proposedCost * 0.1),
      },
      estimatedTimeline: `${randomInt(1, 4)} weeks`,
      startDateAvailability: addDays(now, randomInt(1, 14)).toISOString(),
      paymentTerms: '50% upfront, 50% on completion',
      status,
      submittedDate: submittedDate.toISOString(),
      clientResponse: status === 'rejected' ? 'Thank you for your bid, but we have selected another vendor.' : undefined,
    });
  }

  return bids;
}

// Generate Support Tickets
export function generateSupportTickets(count: number = 20): SupportTicket[] {
  const statuses: SupportTicket['status'][] = ['open', 'in-progress', 'waiting-response', 'resolved', 'closed'];
  const priorities: SupportTicket['priority'][] = ['low', 'medium', 'high', 'urgent'];
  const categories: SupportTicket['category'][] = ['technical', 'billing', 'account', 'feature-request', 'bug', 'other'];
  
  const tickets: SupportTicket[] = [];
  const now = new Date();

  const ticketSubjects = [
    'Unable to upload invoice',
    'Payment not reflected in account',
    'Work order status not updating',
    'Need help with marketplace bidding',
    'Account access issue',
    'Invoice PDF generation error',
    'Feature request: bulk export',
    'Report a bug in work orders',
    'Question about payment terms',
    'Technical support needed',
  ];

  for (let i = 1; i <= count; i++) {
    const createdDate = subDays(now, randomInt(0, 45));
    const status = randomElement(statuses);
    const isResolved = status === 'resolved' || status === 'closed';
    const resolvedDate = isResolved ? addDays(createdDate, randomInt(1, 7)) : undefined;

    tickets.push({
      id: `ticket-${i}`,
      ticketId: generateId('TICKET', i),
      subject: randomElement(ticketSubjects),
      category: randomElement(categories),
      priority: randomElement(priorities),
      status,
      description: `Detailed description of the issue for ticket ${i}. This is a sample ticket description.`,
      createdDate: createdDate.toISOString(),
      updatedDate: resolvedDate?.toISOString() || createdDate.toISOString(),
      resolvedDate: resolvedDate?.toISOString(),
      assignedAgent: status !== 'open' ? 'Support Agent ' + randomInt(1, 5) : undefined,
    });
  }

  return tickets;
}

// Generate Clients
export function generateClients(count: number = 10): Client[] {
  const clientTypes: Client['clientType'][] = ['property-management', 'real-estate', 'individual', 'corporate'];
  const statuses: Client['status'][] = ['active', 'inactive', 'suspended'];
  
  const clients: Client[] = [];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    clients.push({
      id: `client-${i}`,
      name: clientNames[i - 1] || `Client ${i}`,
      company: clientNames[i - 1],
      email: `client${i}@example.com`,
      phone: `(555) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
      address: `${randomInt(100, 999)} Business Street`,
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      contactPerson: `Contact Person ${i}`,
      clientType: randomElement(clientTypes),
      status: randomElement(statuses),
      totalWorkOrders: randomInt(5, 50),
      totalSpent: randomInt(10000, 200000),
      averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
      createdAt: subMonths(now, randomInt(1, 24)).toISOString(),
    });
  }

  return clients;
}

// Generate Activities
export function generateActivities(
  workOrders: WorkOrder[],
  invoices: Invoice[],
  payments: Payment[],
  bids: Bid[],
  _tickets: SupportTicket[],
  count: number = 100
): Activity[] {
  const activities: Activity[] = [];

  // Work order activities
  workOrders.slice(0, 20).forEach(wo => {
    activities.push({
      id: `activity-wo-${wo.id}`,
      type: 'work-order-created',
      title: 'New Work Order Assigned',
      description: `Work order ${wo.workOrderId} assigned for ${wo.propertyAddress}`,
      timestamp: wo.requestDate,
      relatedId: wo.id,
      relatedType: 'work-order',
      read: false,
      actionUrl: `/work-orders/${wo.id}`,
    });

    if (wo.status === 'completed') {
      activities.push({
        id: `activity-wo-completed-${wo.id}`,
        type: 'work-order-completed',
        title: 'Work Order Completed',
        description: `Work order ${wo.workOrderId} has been completed`,
        timestamp: wo.completedDate || wo.requestDate,
        relatedId: wo.id,
        relatedType: 'work-order',
        read: false,
        actionUrl: `/work-orders/${wo.id}`,
      });
    }
  });

  // Invoice activities
  invoices.slice(0, 15).forEach(inv => {
    activities.push({
      id: `activity-inv-${inv.id}`,
      type: 'invoice-created',
      title: 'Invoice Created',
      description: `Invoice ${inv.invoiceNumber} created for ${inv.clientName}`,
      timestamp: inv.issueDate,
      relatedId: inv.id,
      relatedType: 'invoice',
      read: false,
      actionUrl: `/invoices/${inv.id}`,
    });

    if (inv.status === 'paid' && inv.paidDate) {
      activities.push({
        id: `activity-inv-paid-${inv.id}`,
        type: 'invoice-paid',
        title: 'Invoice Paid',
        description: `Invoice ${inv.invoiceNumber} has been paid`,
        timestamp: inv.paidDate,
        relatedId: inv.id,
        relatedType: 'invoice',
        read: false,
        actionUrl: `/invoices/${inv.id}`,
      });
    }
  });

  // Payment activities
  payments.slice(0, 10).forEach(payment => {
    activities.push({
      id: `activity-pay-${payment.id}`,
      type: 'payment-received',
      title: 'Payment Received',
      description: `Payment of $${payment.amount.toFixed(2)} received for invoice ${payment.invoiceNumber}`,
      timestamp: payment.paymentDate,
      relatedId: payment.id,
      relatedType: 'payment',
      read: false,
      actionUrl: `/payments/${payment.id}`,
    });
  });

  // Bid activities
  bids.slice(0, 10).forEach(bid => {
    activities.push({
      id: `activity-bid-${bid.id}`,
      type: 'bid-submitted',
      title: 'Bid Submitted',
      description: `Bid ${bid.bidId} submitted for project`,
      timestamp: bid.submittedDate,
      relatedId: bid.id,
      relatedType: 'bid',
      read: false,
      actionUrl: `/marketplace/bids/${bid.id}`,
    });

    if (bid.status === 'accepted') {
      activities.push({
        id: `activity-bid-accepted-${bid.id}`,
        type: 'bid-accepted',
        title: 'Bid Accepted',
        description: `Your bid ${bid.bidId} has been accepted!`,
        timestamp: bid.reviewedDate || bid.submittedDate,
        relatedId: bid.id,
        relatedType: 'bid',
        read: false,
        actionUrl: `/marketplace/bids/${bid.id}`,
      });
    }
  });

  // Sort by timestamp (newest first) and limit
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, count);
}

// Generate Notifications
export function generateNotifications(
  workOrders: WorkOrder[],
  invoices: Invoice[],
  count: number = 15
): Notification[] {
  const notifications: Notification[] = [];
  const now = new Date();

  // Overdue invoices
  const overdueInvoices = invoices.filter(inv => {
    const dueDate = new Date(inv.dueDate);
    return dueDate < now && inv.status !== 'paid';
  });

  overdueInvoices.slice(0, 5).forEach(inv => {
    notifications.push({
      id: `notif-overdue-${inv.id}`,
      type: 'warning',
      priority: 'high',
      title: 'Overdue Invoice',
      message: `Invoice ${inv.invoiceNumber} is overdue. Please follow up with ${inv.clientName}`,
      timestamp: inv.dueDate,
      read: false,
      actionUrl: `/invoices/${inv.id}`,
      relatedId: inv.id,
    });
  });

  // Urgent work orders
  const urgentWorkOrders = workOrders.filter(wo => wo.priority === 'urgent' && wo.status !== 'completed');
  urgentWorkOrders.slice(0, 3).forEach(wo => {
    notifications.push({
      id: `notif-urgent-${wo.id}`,
      type: 'error',
      priority: 'high',
      title: 'Urgent Work Order',
      message: `Urgent work order ${wo.workOrderId} requires immediate attention`,
      timestamp: wo.requestDate,
      read: false,
      actionUrl: `/work-orders/${wo.id}`,
      relatedId: wo.id,
    });
  });

  // Payment received
  notifications.push({
    id: 'notif-payment-1',
    type: 'success',
    priority: 'medium',
    title: 'Payment Received',
    message: 'A new payment has been received and processed',
    timestamp: subDays(now, 1).toISOString(),
    read: false,
    actionUrl: '/payments',
  });

  // System announcements
  notifications.push({
    id: 'notif-system-1',
    type: 'info',
    priority: 'low',
    title: 'System Update',
    message: 'New features have been added to the dashboard. Check out the updates!',
    timestamp: subDays(now, 2).toISOString(),
    read: false,
  });

  return notifications
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, count);
}

// Generate Vendor/User
export function generateVendor(): Vendor {
  return {
    id: 'vendor-1',
    companyName: 'ABC Services',
    contactName: 'John Doe',
    email: 'john@abcservices.com',
    phone: '(555) 123-4567',
    address: '123 Contractor Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    serviceCategories: ['plumbing', 'hvac', 'electrical', 'carpentry'],
    rating: 4.8,
    totalProjects: 150,
    completedProjects: 142,
    activeWorkOrders: 8,
    totalEarnings: 450000,
    membershipType: 'premium',
    status: 'active',
    createdAt: subMonths(new Date(), 24).toISOString(),
  };
}

// Generate Dashboard Metrics
export function generateDashboardMetrics(
  workOrders: WorkOrder[],
  invoices: Invoice[],
  payments: Payment[],
  bids: Bid[],
  tickets: SupportTicket[]
): DashboardMetrics {
  const activeWorkOrders = workOrders.filter(wo => 
    wo.status === 'assigned' || wo.status === 'in-progress'
  ).length;
  
  const pendingWorkOrders = workOrders.filter(wo => wo.status === 'pending').length;
  const inProgressWorkOrders = workOrders.filter(wo => wo.status === 'in-progress').length;
  const completedWorkOrders = workOrders.filter(wo => wo.status === 'completed').length;
  
  const totalEarnings = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const monthlyEarnings = payments
    .filter(p => {
      const paymentDate = new Date(p.paymentDate);
      const now = new Date();
      return paymentDate >= subMonths(now, 1) && p.status === 'completed';
    })
    .reduce((sum, p) => sum + p.amount, 0);
  
  const outstandingInvoices = invoices.filter(inv => 
    inv.status !== 'paid' && inv.status !== 'cancelled'
  ).length;
  
  const overdueInvoices = invoices.filter(inv => {
    const dueDate = new Date(inv.dueDate);
    return dueDate < new Date() && inv.status !== 'paid';
  }).length;
  
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  
  const activeBids = bids.filter(b => 
    b.status === 'pending' || b.status === 'under-review'
  ).length;
  
  const wonBids = bids.filter(b => b.status === 'accepted').length;
  const lostBids = bids.filter(b => b.status === 'rejected').length;
  
  const openTickets = tickets.filter(t => 
    t.status === 'open' || t.status === 'in-progress'
  ).length;
  
  const completedOrders = workOrders.filter(wo => wo.status === 'completed');
  const onTimeCompleted = completedOrders.filter(wo => {
    if (!wo.completedDate) return false;
    const completed = new Date(wo.completedDate);
    const due = new Date(wo.dueDate);
    return completed <= due;
  }).length;
  
  const completionRate = completedOrders.length > 0
    ? (completedOrders.length / workOrders.length) * 100
    : 0;
  
  const onTimeCompletionRate = completedOrders.length > 0
    ? (onTimeCompleted / completedOrders.length) * 100
    : 0;

  return {
    activeWorkOrders,
    pendingWorkOrders,
    inProgressWorkOrders,
    completedWorkOrders,
    totalEarnings,
    monthlyEarnings,
    outstandingInvoices,
    overdueInvoices,
    pendingPayments,
    activeBids,
    wonBids,
    lostBids,
    openTickets,
    responseTime: 2.5, // hours
    completionRate: Math.round(completionRate * 10) / 10,
    onTimeCompletionRate: Math.round(onTimeCompletionRate * 10) / 10,
    averageRating: 4.7,
  };
}

// Generate Chart Data
export function generateTimeSeriesData(days: number = 30): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(now, i);
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      value: randomInt(1000, 10000),
    });
  }

  return data;
}

export function generateChartData(labels: string[], min: number = 0, max: number = 100): ChartDataPoint[] {
  return labels.map(label => ({
    label,
    value: randomInt(min, max),
  }));
}

