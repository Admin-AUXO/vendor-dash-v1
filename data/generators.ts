/**
 * Data Generators
 * 
 * Utility functions to generate realistic dummy data for the dashboard using Faker
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
import { faker } from '@faker-js/faker';

// Initialize faker with seed for consistent results (optional)
// faker.seed(123);

// Helper function to pick random element from array
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to generate ID
function generateId(prefix: string, index: number): string {
  return `${prefix}-${String(index).padStart(4, '0')}`;
}

// Generate service description based on category
function generateServiceDescription(category: WorkOrder['serviceCategory']): string {
  const descriptions: Record<WorkOrder['serviceCategory'], string[]> = {
    plumbing: [
      'Fix leaky faucet in kitchen',
      'Replace water heater',
      'Unclog bathroom drain',
      'Repair broken pipe under sink',
      'Install new toilet',
      'Fix water pressure issues',
      'Replace garbage disposal',
      'Repair shower valve',
      'Install new sink faucet',
      'Fix sewer line backup',
    ],
    hvac: [
      'AC unit not cooling properly',
      'Replace air filter',
      'Fix furnace heating issue',
      'Install new thermostat',
      'Repair ductwork',
      'Annual HVAC maintenance',
      'Fix noisy air conditioner',
      'Replace old HVAC system',
      'Repair heat pump',
      'Clean air ducts',
    ],
    electrical: [
      'Install new outlet',
      'Fix circuit breaker issue',
      'Replace light switch',
      'Install ceiling fan',
      'Repair faulty wiring',
      'Install new light fixture',
      'Fix flickering lights',
      'Upgrade electrical panel',
      'Install GFCI outlet',
      'Fix power outage issue',
    ],
    carpentry: [
      'Repair broken door',
      'Install new cabinets',
      'Fix squeaky floorboards',
      'Build custom shelving',
      'Repair window frame',
      'Install crown molding',
      'Fix broken drawer',
      'Install new door',
      'Repair deck railing',
      'Custom trim work',
    ],
    painting: [
      'Interior wall painting',
      'Exterior house painting',
      'Touch up paint job',
      'Paint kitchen cabinets',
      'Paint bedroom walls',
      'Exterior trim painting',
      'Paint garage door',
      'Paint front door',
      'Paint deck',
      'Full house repaint',
    ],
    landscaping: [
      'Lawn mowing and maintenance',
      'Plant new trees',
      'Install irrigation system',
      'Garden bed maintenance',
      'Trim hedges and bushes',
      'Install new sod',
      'Mulch garden beds',
      'Fertilize lawn',
      'Remove dead trees',
      'Design and install landscape',
    ],
    appliance: [
      'Repair dishwasher',
      'Fix refrigerator',
      'Repair washing machine',
      'Fix dryer',
      'Repair oven',
      'Fix microwave',
      'Repair garbage disposal',
      'Fix garbage disposal',
      'Repair garbage disposal',
      'Install new appliance',
    ],
    general: [
      'General maintenance',
      'Deep cleaning service',
      'Move-in inspection',
      'Move-out cleaning',
      'Property inspection',
      'General repair work',
      'Seasonal maintenance',
      'Emergency repair',
      'Handyman services',
      'General upkeep',
    ],
  };

  const categoryDescriptions = descriptions[category] || descriptions.general;
  return randomElement(categoryDescriptions);
}

// Generate project description for marketplace
function generateProjectDescription(category: MarketplaceProject['serviceCategory']): string {
  const descriptions: Record<MarketplaceProject['serviceCategory'], string[]> = {
    plumbing: [
      'Complete plumbing renovation for commercial building',
      'Install new plumbing system in residential property',
      'Emergency plumbing repairs needed',
      'Bathroom plumbing upgrade project',
      'Kitchen plumbing installation',
    ],
    hvac: [
      'HVAC system replacement project',
      'Install central air conditioning',
      'Commercial HVAC maintenance contract',
      'New HVAC installation',
      'HVAC system upgrade',
    ],
    electrical: [
      'Electrical panel upgrade',
      'Complete electrical rewiring',
      'New electrical installation',
      'Commercial electrical work',
      'Smart home electrical installation',
    ],
    carpentry: [
      'Custom kitchen cabinet installation',
      'Deck building project',
      'Custom built-in shelving',
      'Window and door replacement',
      'Custom woodworking project',
    ],
    painting: [
      'Interior painting project',
      'Exterior painting project',
      'Commercial building paint job',
      'Multi-unit painting project',
      'Custom paint work',
    ],
    landscaping: [
      'Complete landscape design and installation',
      'Lawn installation and maintenance',
      'Garden design and installation',
      'Irrigation system installation',
      'Seasonal landscaping project',
    ],
    appliance: [],
    general: [],
  };

  const categoryDescriptions = descriptions[category] || ['General service project'];
  return randomElement(categoryDescriptions);
}

// Generate Work Orders
export function generateWorkOrders(count: number = 50): WorkOrder[] {
  const statuses: WorkOrder['status'][] = ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'];
  const priorities: WorkOrder['priority'][] = ['urgent', 'high', 'medium', 'low'];
  const propertyTypes: WorkOrder['propertyType'][] = ['residential', 'commercial', 'industrial', 'mixed-use'];
  const serviceCategories: WorkOrder['serviceCategory'][] = ['plumbing', 'hvac', 'electrical', 'carpentry', 'painting', 'landscaping', 'appliance', 'general'];

  const workOrders: WorkOrder[] = [];
  const now = new Date();
  
  // Generate client pool for better relationships
  const clientPool = Array.from({ length: Math.max(12, Math.floor(count / 5)) }, (_, i) => {
    const contactPerson = faker.person.fullName();
    const nameParts = contactPerson.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    const companyName = faker.company.name();
    
    return {
      id: `client-${i + 1}`,
      name: companyName,
      contact: contactPerson,
      email: faker.internet.email({ firstName, lastName }),
      phone: faker.phone.number(),
    };
  });

  // Generate technician pool
  const technicianPool = Array.from({ length: 15 }, () => faker.person.fullName());

  // Track minimum requirements to ensure complete variability
  const statusCounts: Record<string, number> = {
    'pending': 0,
    'assigned': 0,
    'in-progress': 0,
    'completed': 0,
    'cancelled': 0,
  };
  const priorityCounts: Record<string, number> = {
    'urgent': 0,
    'high': 0,
    'medium': 0,
    'low': 0,
  };
  const categoryCounts: Record<string, number> = {
    'plumbing': 0,
    'hvac': 0,
    'electrical': 0,
    'carpentry': 0,
    'painting': 0,
    'landscaping': 0,
    'appliance': 0,
    'general': 0,
  };
  const minPerStatus = Math.max(1, Math.floor(count / statuses.length));
  const minPerPriority = Math.max(1, Math.floor(count / priorities.length));
  const minPerCategory = Math.max(1, Math.floor(count / serviceCategories.length));
  const minCompleted = Math.max(20, Math.floor(count * 0.4)); // At least 40% completed for invoices

  // Track completed work orders to distribute them across time
  let completedIndex = 0;

  for (let i = 1; i <= count; i++) {
    // Ensure minimum distribution for charts
    let status: WorkOrder['status'];
    if (i <= statuses.length) {
      // First N work orders: one per status
      status = statuses[i - 1];
    } else if (statusCounts['completed'] < minCompleted) {
      // Ensure enough completed work orders for invoices
      status = 'completed';
    } else {
      // Otherwise random, but ensure minimums
      const neededStatuses = statuses.filter(s => statusCounts[s] < minPerStatus);
      status = neededStatuses.length > 0 ? randomElement(neededStatuses) : randomElement(statuses);
    }
    statusCounts[status]++;

    let priority: WorkOrder['priority'];
    if (i <= priorities.length) {
      // First N work orders: one per priority
      priority = priorities[i - 1];
    } else {
      // Ensure minimum distribution
      const neededPriorities = priorities.filter(p => priorityCounts[p] < minPerPriority);
      priority = neededPriorities.length > 0 ? randomElement(neededPriorities) : randomElement(priorities);
    }
    priorityCounts[priority]++;

    const isCompleted = status === 'completed';
    const isCancelled = status === 'cancelled';
    
    // Distribute work orders across time
    // For completed work orders, distribute across last 6 months for invoice generation
    let requestDate: Date;
    if (isCompleted) {
      // Distribute completed work orders across last 6 months
      const monthOffset = completedIndex % 6;
      completedIndex++;
      const monthStart = subMonths(now, 6 - monthOffset);
      const monthEnd = subMonths(now, Math.max(0, 5 - monthOffset));
      requestDate = faker.date.between({
        from: monthEnd > monthStart ? monthStart : subMonths(now, 6),
        to: monthEnd > monthStart ? monthEnd : now,
      });
    } else {
      requestDate = faker.date.recent({ days: 180 }); // Last 6 months
    }
    const dueDate = addDays(requestDate, faker.number.int({ min: 1, max: 14 }));
    
    // Completed date should be after request date but before or equal to due date (usually)
    // For completed work orders, ensure completion dates are distributed across last 6 months
    const completedDate = isCompleted 
      ? (() => {
          // Use the request date month as base to ensure distribution
          const monthStart = new Date(requestDate.getFullYear(), requestDate.getMonth(), 1);
          const monthEnd = new Date(requestDate.getFullYear(), requestDate.getMonth() + 1, 0);
          if (monthEnd > now) monthEnd.setTime(now.getTime());
          if (monthEnd > dueDate) monthEnd.setTime(dueDate.getTime());
          const validFrom = requestDate > monthStart ? requestDate : monthStart;
          const validTo = dueDate < monthEnd ? dueDate : monthEnd;
          // Ensure to date is after from date
          const finalTo = validTo > validFrom ? validTo : addDays(validFrom, 1);
          return faker.date.between({ from: validFrom, to: finalTo });
        })()
      : undefined;

    const client = randomElement(clientPool);
    
    // Ensure minimum distribution across service categories
    let serviceCategory: WorkOrder['serviceCategory'];
    if (i <= serviceCategories.length) {
      // First N work orders: one per category
      serviceCategory = serviceCategories[i - 1];
    } else {
      // Ensure minimum distribution
      const neededCategories = serviceCategories.filter(c => categoryCounts[c] < minPerCategory);
      serviceCategory = neededCategories.length > 0 ? randomElement(neededCategories) : randomElement(serviceCategories);
    }
    categoryCounts[serviceCategory]++;
    
    const propertyType = randomElement(propertyTypes);
    
    // Generate realistic property address
    const propertyAddress = propertyType === 'residential'
      ? faker.location.streetAddress(true)
      : propertyType === 'commercial'
      ? `${faker.location.streetAddress()}, Suite ${faker.number.int({ min: 100, max: 999 })}`
      : propertyType === 'industrial'
      ? `${faker.location.streetAddress()}, Building ${faker.string.alpha({ length: 1, casing: 'upper' })}`
      : `${faker.location.streetAddress()}, Unit ${faker.number.int({ min: 1, max: 50 })}`;

    // Estimated hours based on category and priority
    const baseHours = serviceCategory === 'general' ? 4 : 
                     serviceCategory === 'landscaping' ? 8 :
                     serviceCategory === 'carpentry' ? 6 : 4;
    const estimatedHours = baseHours + (priority === 'urgent' ? 2 : priority === 'high' ? 1 : 0);
    
    // Actual hours should be close to estimated, with some variation
    const actualHours = isCompleted 
      ? estimatedHours + faker.number.int({ min: -2, max: 4 })
      : undefined;

    // Cost estimation based on hours and category
    const hourlyRate = faker.number.int({ min: 75, max: 150 });
    const estimatedCost = estimatedHours * hourlyRate + faker.number.int({ min: 50, max: 500 });
    const actualCost = isCompleted
      ? actualHours! * hourlyRate + faker.number.int({ min: 0, max: 300 })
      : undefined;

    workOrders.push({
      id: `wo-${i}`,
      workOrderId: generateId('WO', i),
      propertyAddress,
      propertyType,
      serviceCategory,
      serviceDescription: generateServiceDescription(serviceCategory),
      status,
      priority,
      requestDate: requestDate.toISOString(),
      dueDate: dueDate.toISOString(),
      completedDate: completedDate?.toISOString(),
      clientId: client.id,
      clientName: client.name,
      clientContact: client.contact,
      clientPhone: client.phone,
      clientEmail: client.email,
      assignedTechnician: status !== 'pending' && !isCancelled ? randomElement(technicianPool) : undefined,
      assignedTeam: status === 'in-progress' ? `Team ${faker.string.alpha({ length: 2, casing: 'upper' })}` : undefined,
      estimatedHours,
      actualHours,
      estimatedCost: Math.round(estimatedCost),
      actualCost: actualCost ? Math.round(actualCost) : undefined,
      notes: (() => {
        if (isCompleted) {
          return faker.helpers.arrayElement([
            'Work completed successfully',
            'Work completed on time',
            'All tasks completed as requested',
            'Work completed with minor adjustments',
            'Completed ahead of schedule',
            'Work completed satisfactorily. Client approved.',
            'All repairs completed and tested. No issues found.',
          ]);
        }
        if (isCancelled) {
          return faker.helpers.arrayElement([
            'Cancelled by client',
            'Cancelled due to scheduling conflict',
            'Cancelled - no longer needed',
            'Client requested cancellation',
            'Cancelled - property sold',
          ]);
        }
        if (priority === 'urgent') {
          return faker.helpers.arrayElement([
            `URGENT: ${serviceCategory === 'plumbing' ? 'Water leak causing property damage. Immediate attention required to prevent further damage.' : 
                       serviceCategory === 'hvac' ? 'HVAC system failure during extreme weather. Tenant comfort and safety at risk.' :
                       serviceCategory === 'electrical' ? 'Electrical hazard detected. Safety risk requires immediate remediation.' :
                       serviceCategory === 'appliance' ? 'Critical appliance failure affecting daily operations. Business impact.' :
                       'Emergency situation requiring immediate response to prevent property damage or safety issues.'}`,
            `URGENT: Client has emergency situation. ${serviceCategory} issue causing immediate problems that need to be addressed today.`,
            `URGENT: Property damage in progress. ${serviceCategory} service needed immediately to prevent further damage.`,
            `URGENT: Safety concern identified. Immediate ${serviceCategory} service required to address potential hazards.`,
            `URGENT: Critical system failure. ${serviceCategory} repair needed immediately to restore functionality.`,
          ]);
        }
        if (priority === 'high') {
          return faker.helpers.arrayElement([
            `High priority: ${serviceCategory} issue affecting daily operations. Should be addressed within 24-48 hours.`,
            `High priority: Client requires expedited service for ${serviceCategory} issue.`,
            `High priority: ${serviceCategory} problem impacting property functionality.`,
          ]);
        }
        if (status === 'in-progress') {
          return faker.helpers.arrayElement([
            'Work in progress',
            'Technician on-site working',
            'Currently being serviced',
            'Work underway',
          ]);
        }
        if (status === 'assigned') {
          return faker.helpers.arrayElement([
            'Assigned to technician',
            'Work order assigned and scheduled',
            'Scheduled for completion',
          ]);
        }
        return undefined;
      })(),
    });
  }

  return workOrders;
}

// Generate Invoices
export function generateInvoices(workOrders: WorkOrder[], count: number = 40): Invoice[] {
  const statuses: Invoice['status'][] = ['draft', 'sent', 'viewed', 'approved', 'paid', 'overdue', 'disputed', 'cancelled'];
  const paymentTerms = ['Net 15', 'Net 30', 'Due on Receipt', 'Net 7', 'Net 45'];
  
  const invoices: Invoice[] = [];
  const completedWorkOrders = workOrders.filter(wo => wo.status === 'completed' && wo.actualCost);
  const now = new Date();

  // Track minimum requirements
  const statusCounts: Record<string, number> = {
    'draft': 0,
    'sent': 0,
    'viewed': 0,
    'approved': 0,
    'paid': 0,
    'overdue': 0,
    'disputed': 0,
    'cancelled': 0,
  };
  const minPerStatus = Math.max(1, Math.floor(count / statuses.length));
  const minPaid = Math.max(20, Math.floor(count * 0.5)); // At least 50% paid for payments

  // Create a map to track which work orders have invoices
  const invoicedWorkOrders = new Set<string>();
  const invoiceCount = Math.min(count, completedWorkOrders.length * 1.5); // Allow more invoices from completed orders

  for (let i = 1; i <= invoiceCount && completedWorkOrders.length > 0; i++) {
    // Prefer work orders without invoices, but allow some duplicates
    const availableWorkOrders = completedWorkOrders.filter(wo => !invoicedWorkOrders.has(wo.id));
    const workOrder = availableWorkOrders.length > 0 
      ? randomElement(availableWorkOrders)
      : randomElement(completedWorkOrders);
    
    invoicedWorkOrders.add(workOrder.id);

    // Ensure minimum distribution for charts
    let status: Invoice['status'];
    if (i <= statuses.length) {
      // First N invoices: one per status
      status = statuses[i - 1];
    } else if (statusCounts['paid'] < minPaid) {
      // Ensure enough paid invoices for payments
      status = 'paid';
    } else {
      // Otherwise random, but ensure minimums
      const neededStatuses = statuses.filter(s => statusCounts[s] < minPerStatus);
      status = neededStatuses.length > 0 ? randomElement(neededStatuses) : randomElement(statuses);
    }
    statusCounts[status]++;

    // Issue date should be on or after completion date
    // Distribute invoices across last 6 months for monthly revenue chart
    const completionDate = workOrder.completedDate ? new Date(workOrder.completedDate) : now;
    
    // For paid invoices, distribute across last 6 months to ensure payments can be distributed
    let issueDate: Date;
    if (status === 'paid') {
      // Distribute paid invoices across last 6 months
      const monthOffset = faker.number.int({ min: 0, max: 5 });
      const targetMonth = new Date(now);
      targetMonth.setMonth(now.getMonth() - monthOffset);
      const monthStart = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
      const monthEnd = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
      if (monthEnd > now) monthEnd.setTime(now.getTime());
      
      // Ensure issue date is after completion date
      const validFrom = completionDate > monthStart ? completionDate : monthStart;
      const validTo = completionDate > monthEnd ? addDays(completionDate, 30) : monthEnd;
      if (validTo > now) validTo.setTime(now.getTime());
      
      issueDate = faker.date.between({ from: validFrom, to: validTo });
    } else {
      // For non-paid invoices, use completion date logic
      const maxIssueDate = completionDate > now ? addDays(completionDate, 30) : now;
      issueDate = faker.date.between({ 
        from: completionDate, 
        to: maxIssueDate
      });
    }
    
    // Due date based on payment terms
    const paymentTerm = randomElement(paymentTerms);
    const daysUntilDue = paymentTerm === 'Due on Receipt' ? 0 :
                         paymentTerm === 'Net 7' ? 7 :
                         paymentTerm === 'Net 15' ? 15 :
                         paymentTerm === 'Net 30' ? 30 : 45;
    const dueDate = addDays(issueDate, daysUntilDue);

    const isPaid = status === 'paid';
    const isCancelled = status === 'cancelled';
    
    // Paid date should be between issue date and due date (or slightly after for overdue)
    const paidDate = isPaid 
      ? (() => {
          const paidDateTo = addDays(dueDate, faker.number.int({ min: 0, max: 5 }));
          // Ensure to date is after from date
          const validToDate = paidDateTo > issueDate ? paidDateTo : addDays(issueDate, 1);
          return faker.date.between({ 
            from: issueDate, 
            to: validToDate
          });
        })()
      : undefined;

    // Generate line items - sometimes multiple items
    const numLineItems = faker.number.int({ min: 1, max: 3 });
    const lineItems = [];
    
    for (let j = 0; j < numLineItems; j++) {
      const baseCost = workOrder.actualCost || workOrder.estimatedCost;
      const itemCost = j === 0 
        ? baseCost 
        : faker.number.int({ min: Math.round(baseCost * 0.1), max: Math.round(baseCost * 0.5) });
      
      const quantity = faker.number.int({ min: 1, max: 3 });
      const taxRate = faker.number.float({ min: 0.06, max: 0.10, fractionDigits: 3 });
      const unitPrice = Math.round(itemCost / quantity);
      const total = Math.round(unitPrice * quantity * (1 + taxRate));
      
      lineItems.push({
        id: `item-${i}-${j + 1}`,
        description: j === 0 
          ? workOrder.serviceDescription
          : faker.helpers.arrayElement([
              'Materials',
              'Labor',
              'Additional services',
              'Parts and supplies',
              'Travel fee',
            ]),
        quantity,
        unitPrice,
        taxRate,
        total,
      });
    }

    const subtotal = lineItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const taxAmount = lineItems.reduce((sum, item) => sum + (item.total - (item.unitPrice * item.quantity)), 0);
    const maxDiscount = Math.round(subtotal * 0.1);
    const discount = faker.datatype.boolean({ probability: 0.2 }) && maxDiscount >= 50
      ? faker.number.int({ min: 50, max: maxDiscount })
      : undefined;
    const total = Math.round(subtotal + taxAmount - (discount || 0));

    // Generate client address
    const clientAddress = faker.location.streetAddress(true);
    const clientCity = faker.location.city();
    const clientState = faker.location.state({ abbreviated: true });
    const clientZip = faker.location.zipCode();
    const fullClientAddress = `${clientAddress}, ${clientCity}, ${clientState} ${clientZip}`;

    invoices.push({
      id: `inv-${i}`,
      invoiceNumber: generateId('INV', i),
      workOrderId: workOrder.id,
      clientId: workOrder.clientId,
      clientName: workOrder.clientName,
      clientAddress: fullClientAddress,
      clientEmail: workOrder.clientEmail,
      propertyAddress: workOrder.propertyAddress,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      paidDate: paidDate?.toISOString(),
      status,
      lineItems,
      subtotal: Math.round(subtotal),
      taxAmount: Math.round(taxAmount),
      discount,
      total,
      paymentTerms: paymentTerm,
      paymentMethod: isPaid ? randomElement(['check', 'ach', 'wire', 'credit-card', 'cash'] as const) : undefined,
      referenceNumber: isPaid ? `REF-${faker.string.alphanumeric(8).toUpperCase()}` : undefined,
      notes: isPaid 
        ? faker.helpers.arrayElement([
            'Payment received on time',
            'Payment processed successfully',
            'Thank you for your payment',
          ])
        : isCancelled
        ? 'Invoice cancelled'
        : undefined,
    });
  }

  return invoices;
}

// Generate Payments
export function generatePayments(invoices: Invoice[], count: number = 35): Payment[] {
  const paymentMethods: Payment['paymentMethod'][] = ['check', 'ach', 'wire', 'credit-card', 'cash', 'other'];
  const paymentStatuses: Payment['status'][] = ['completed', 'pending', 'failed', 'refunded'];
  
  const payments: Payment[] = [];
  const paidInvoices = invoices.filter(inv => inv.status === 'paid' && inv.paidDate);
  const now = new Date();
  
  // Track minimum requirements for charts
  const methodCounts: Record<string, number> = {
    'check': 0,
    'ach': 0,
    'wire': 0,
    'credit-card': 0,
    'cash': 0,
    'other': 0,
  };
  const statusCounts: Record<string, number> = {
    'completed': 0,
    'pending': 0,
    'failed': 0,
    'refunded': 0,
  };
  const minPerMethod = Math.max(1, Math.floor(count / paymentMethods.length));
  const minPerStatus = Math.max(1, Math.floor(count / paymentStatuses.length));
  const minCompleted = Math.max(20, Math.floor(count * 0.7)); // At least 70% completed for revenue charts
  
  // Distribute payments across last 6 months for monthly revenue chart
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  
  // Distribute payments across last 7 days for daily payment status chart
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  
  const processedInvoices = new Set<string>();

  // Allow more payments than paid invoices (some invoices might have multiple payments)
  const paymentCount = Math.min(count, paidInvoices.length * 1.5);

  for (let i = 1; i <= paymentCount && paidInvoices.length > 0; i++) {
    // Allow some invoices to have multiple payments for better distribution
    const availableInvoices = paidInvoices.filter(inv => {
      const timesUsed = Array.from(processedInvoices).filter(id => id === inv.id).length;
      return timesUsed < 2; // Allow up to 2 payments per invoice
    });
    
    let invoiceObj: Invoice | undefined;
    if (availableInvoices.length > 0) {
      invoiceObj = randomElement(availableInvoices);
      processedInvoices.add(invoiceObj.id);
    } else if (paidInvoices.length > 0) {
      // If we've used all invoices once, allow reuse
      invoiceObj = randomElement(paidInvoices);
      processedInvoices.add(invoiceObj.id);
    } else {
      break;
    }
    
    if (!invoiceObj) continue;

    // Distribute payments across time for charts
    // First, ensure we have payments in each of the last 6 months
    // Then, ensure we have payments in each of the last 7 days
    let paymentDate: Date;
    
    // Strategy: Distribute payments to cover all time periods for charts
    if (i <= 6) {
      // First 6 payments: one per month for monthly revenue chart (oldest to newest)
      const monthOffset = 6 - i;
      const targetMonth = new Date(now);
      targetMonth.setMonth(now.getMonth() - monthOffset);
      const monthStart = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
      const monthEnd = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
      if (monthEnd > now) monthEnd.setTime(now.getTime());
      paymentDate = faker.date.between({ from: monthStart, to: monthEnd });
    } else if (i <= 13) {
      // Next 7 payments: one per day for daily payment status chart (oldest to newest)
      const dayOffset = 7 - (i - 6);
      const targetDay = new Date(now);
      targetDay.setDate(now.getDate() - dayOffset);
      targetDay.setHours(0, 0, 0, 0);
      const dayEnd = new Date(targetDay);
      dayEnd.setHours(23, 59, 59, 999);
      if (dayEnd > now) dayEnd.setTime(now.getTime());
      paymentDate = faker.date.between({ from: targetDay, to: dayEnd });
    } else {
      // Remaining payments: distributed across last 6 months
      const randomMonthOffset = faker.number.int({ min: 0, max: 5 });
      const targetMonth = new Date(now);
      targetMonth.setMonth(now.getMonth() - randomMonthOffset);
      const monthStart = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
      const monthEnd = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
      if (monthEnd > now) monthEnd.setTime(now.getTime());
      if (monthStart < sixMonthsAgo) {
        paymentDate = faker.date.between({ from: sixMonthsAgo, to: now });
      } else {
        paymentDate = faker.date.between({ from: monthStart, to: monthEnd });
      }
    }
    
    // Ensure payment date is within reasonable range
    if (paymentDate > now) paymentDate = new Date(now);
    if (paymentDate < sixMonthsAgo) paymentDate = faker.date.between({ from: sixMonthsAgo, to: now });

    // Ensure minimum distribution of payment methods
    let paymentMethod: Payment['paymentMethod'];
    if (i <= paymentMethods.length) {
      // First N payments: one per method
      paymentMethod = paymentMethods[i - 1];
    } else {
      // Ensure minimum distribution
      const neededMethods = paymentMethods.filter(m => methodCounts[m] < minPerMethod);
      paymentMethod = neededMethods.length > 0 ? randomElement(neededMethods) : randomElement(paymentMethods);
    }
    methodCounts[paymentMethod]++;

    // Ensure minimum distribution of payment statuses
    let paymentStatus: Payment['status'];
    if (i <= paymentStatuses.length) {
      // First N payments: one per status
      paymentStatus = paymentStatuses[i - 1];
    } else if (statusCounts['completed'] < minCompleted) {
      // Ensure enough completed payments for revenue charts
      paymentStatus = 'completed';
    } else {
      // Ensure minimum distribution
      const neededStatuses = paymentStatuses.filter(s => statusCounts[s] < minPerStatus);
      paymentStatus = neededStatuses.length > 0 ? randomElement(neededStatuses) : randomElement(paymentStatuses);
    }
    statusCounts[paymentStatus]++;

    // Generate technician/processor name
    const processedBy = faker.person.fullName();

    payments.push({
      id: `pay-${i}`,
      paymentId: generateId('PAY', i),
      invoiceId: invoiceObj.id,
      invoiceNumber: invoiceObj.invoiceNumber,
      workOrderId: invoiceObj.workOrderId,
      clientId: invoiceObj.clientId,
      clientName: invoiceObj.clientName,
      paymentDate: paymentDate.toISOString(),
      amount: invoiceObj.total,
      paymentMethod: paymentMethod,
      status: paymentStatus,
      referenceNumber: paymentStatus === 'completed' 
        ? `REF-${faker.string.alphanumeric(10).toUpperCase()}`
        : undefined,
      notes: paymentStatus === 'completed'
        ? 'Payment processed successfully'
        : paymentStatus === 'failed'
        ? 'Payment processing failed'
        : undefined,
      processedBy: paymentStatus === 'completed' ? processedBy : undefined,
    });
  }

  return payments;
}

// Generate Marketplace Projects
export function generateMarketplaceProjects(count: number = 30): MarketplaceProject[] {
  const statuses: MarketplaceProject['status'][] = ['open', 'in-review', 'awarded', 'closed', 'cancelled'];
  const propertyTypes: MarketplaceProject['propertyType'][] = ['residential', 'commercial', 'industrial'];
  const serviceCategories: MarketplaceProject['serviceCategory'][] = ['plumbing', 'hvac', 'electrical', 'carpentry', 'painting', 'landscaping'];
  
  const projects: MarketplaceProject[] = [];

  for (let i = 1; i <= count; i++) {
    const postedDate = faker.date.recent({ days: 60 });
    const deadline = addDays(postedDate, faker.number.int({ min: 7, max: 30 }));
    const isConfidential = faker.datatype.boolean({ probability: 0.3 });
    const status = randomElement(statuses);
    
    const propertyType = randomElement(propertyTypes);
    const serviceCategory = randomElement(serviceCategories);
    
    // Generate realistic property address
    const propertyAddress = propertyType === 'residential'
      ? faker.location.streetAddress(true)
      : propertyType === 'commercial'
      ? `${faker.location.streetAddress()}, Suite ${faker.number.int({ min: 100, max: 999 })}`
      : `${faker.location.streetAddress()}, Building ${faker.string.alpha({ length: 1, casing: 'upper' })}`;

    // Budget range based on service category
    const budgetBase = serviceCategory === 'landscaping' ? 5000 :
                      serviceCategory === 'hvac' ? 8000 :
                      serviceCategory === 'electrical' ? 6000 :
                      serviceCategory === 'carpentry' ? 7000 : 4000;
    
    const budgetMin = faker.number.int({ min: budgetBase, max: budgetBase * 2 });
    const budgetMax = faker.number.int({ min: budgetMin, max: budgetMin * 2.5 });

    // Generate location
    const city = faker.location.city();
    const state = faker.location.state({ abbreviated: true });
    const zipCode = faker.location.zipCode();

    // Start date only for awarded projects
    const startDate = status === 'awarded' 
      ? addDays(deadline, faker.number.int({ min: 1, max: 30 }))
      : undefined;

    // Client info - may be confidential
    const clientName = isConfidential ? undefined : faker.company.name();
    const clientId = isConfidential ? undefined : `client-${faker.string.uuid()}`;

    projects.push({
      id: `proj-${i}`,
      projectId: generateId('PROJ', i),
      propertyAddress,
      propertyType,
      serviceCategory,
      projectDescription: generateProjectDescription(serviceCategory),
      budgetMin,
      budgetMax,
      postedDate: postedDate.toISOString(),
      deadline: deadline.toISOString(),
      startDate: startDate?.toISOString(),
      clientId,
      clientName,
      isConfidential,
      status,
      requiredQualifications: faker.datatype.boolean({ probability: 0.5 })
        ? faker.helpers.arrayElements([
            'Licensed contractor',
            'Bonded and insured',
            '5+ years experience',
            'References required',
            'OSHA certified',
          ], { min: 1, max: 3 })
        : undefined,
      projectTimeline: faker.helpers.arrayElement([
        '2-4 weeks',
        '1-2 months',
        '3-6 months',
        '6+ months',
        'ASAP',
      ]),
      numberOfBids: faker.number.int({ min: 0, max: 20 }),
      location: {
        city,
        state,
        zipCode,
      },
    });
  }

  return projects;
}

// Generate Bids
export function generateBids(projects: MarketplaceProject[], count: number = 25): Bid[] {
  const statuses: Bid['status'][] = ['pending', 'under-review', 'accepted', 'rejected', 'withdrawn'];
  
  const bids: Bid[] = [];
  const openProjects = projects.filter(p => p.status === 'open' || p.status === 'in-review' || p.status === 'awarded');
  const bidCount = Math.min(count, openProjects.length * 3); // Multiple bids per project
  const now = new Date();

  for (let i = 1; i <= bidCount && openProjects.length > 0; i++) {
    const project = randomElement(openProjects);
    
    // Proposed cost should be within budget range
    const proposedCost = faker.number.int({ 
      min: Math.round(project.budgetMin * 0.8), 
      max: Math.round(project.budgetMax * 1.1) 
    });
    
    const postedDateObj = new Date(project.postedDate);
    // Submitted date should be between posted date and now
    // Since postedDateObj might be in the past, we use now as the max date
    const maxSubmittedDate = postedDateObj > now ? addDays(postedDateObj, 30) : now;
    const submittedDate = faker.date.between({ 
      from: postedDateObj, 
      to: maxSubmittedDate
    });
    const status = randomElement(statuses);
    
    // Reviewed date for non-pending bids
    const reviewedDate = status !== 'pending' && status !== 'withdrawn'
      ? (() => {
          // Ensure to date is after from date
          const validToDate = now > submittedDate ? now : addDays(submittedDate, 1);
          return faker.date.between({ from: submittedDate, to: validToDate });
        })()
      : undefined;

    // Cost breakdown percentages
    const materialsPercent = faker.number.float({ min: 0.35, max: 0.50, fractionDigits: 2 });
    const laborPercent = faker.number.float({ min: 0.40, max: 0.55, fractionDigits: 2 });
    const otherPercent = 1 - materialsPercent - laborPercent;

    bids.push({
      id: `bid-${i}`,
      bidId: generateId('BID', i),
      projectId: project.id,
      vendorId: 'vendor-1',
      proposedCost,
      costBreakdown: {
        materials: Math.round(proposedCost * materialsPercent),
        labor: Math.round(proposedCost * laborPercent),
        other: Math.round(proposedCost * otherPercent),
      },
      estimatedTimeline: faker.helpers.arrayElement([
        '1-2 weeks',
        '2-4 weeks',
        '1-2 months',
        '2-3 months',
        '3-6 months',
      ]),
      startDateAvailability: addDays(now, faker.number.int({ min: 1, max: 30 })).toISOString(),
      paymentTerms: faker.helpers.arrayElement([
        '50% upfront, 50% on completion',
        '30% upfront, 70% on completion',
        '25% upfront, 75% on completion',
        'Net 30 after completion',
        'Due on completion',
      ]),
      notes: faker.datatype.boolean({ probability: 0.6 })
        ? faker.lorem.sentence()
        : undefined,
      status,
      submittedDate: submittedDate.toISOString(),
      reviewedDate: reviewedDate?.toISOString(),
      clientResponse: status === 'rejected' 
        ? faker.helpers.arrayElement([
            'Thank you for your bid, but we have selected another vendor.',
            'We appreciate your proposal, but we decided to go with a different approach.',
            'Unfortunately, your bid was not selected for this project.',
          ])
        : status === 'accepted'
        ? faker.helpers.arrayElement([
            'Congratulations! Your bid has been accepted.',
            'We are pleased to inform you that your bid has been selected.',
          ])
        : undefined,
      winningBidAmount: status === 'rejected'
        ? faker.number.int({ min: proposedCost * 0.8, max: proposedCost * 1.2 })
        : undefined,
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
  
  // Generate agent pool
  const agentPool = Array.from({ length: 8 }, () => faker.person.fullName());

  const ticketSubjects: Record<SupportTicket['category'], string[]> = {
    technical: [
      'Unable to upload invoice',
      'Work order status not updating',
      'Invoice PDF generation error',
      'System loading slowly',
      'Cannot access dashboard',
      'Data not syncing correctly',
      'Export functionality not working',
    ],
    billing: [
      'Payment not reflected in account',
      'Question about invoice amount',
      'Payment processing issue',
      'Invoice missing line items',
      'Payment method not working',
      'Refund request',
    ],
    account: [
      'Account access issue',
      'Password reset needed',
      'Update company information',
      'Change email address',
      'Account verification',
    ],
    'feature-request': [
      'Feature request: bulk export',
      'Request for new reporting feature',
      'Add custom fields to work orders',
      'Request mobile app',
      'Integration request',
    ],
    bug: [
      'Report a bug in work orders',
      'Calendar not displaying correctly',
      'Filter not working properly',
      'Data disappearing after refresh',
      'Button not responding',
    ],
    other: [
      'General inquiry',
      'Question about payment terms',
      'Technical support needed',
      'How to use marketplace',
      'Training request',
    ],
  };

  for (let i = 1; i <= count; i++) {
    const createdDate = faker.date.recent({ days: 45 });
    const status = randomElement(statuses);
    const isResolved = status === 'resolved' || status === 'closed';
    const category = randomElement(categories);
    
    // Resolved date should be after created date
    const resolvedDate = isResolved 
      ? (() => {
          // Ensure to date is after from date
          const validToDate = now > createdDate ? now : addDays(createdDate, 1);
          return faker.date.between({ from: createdDate, to: validToDate });
        })()
      : undefined;
    
    // Updated date should be latest of created, resolved, or recent
    const updatedDate = resolvedDate 
      ? resolvedDate
      : (() => {
          // Ensure to date is after from date
          const validToDate = now > createdDate ? now : addDays(createdDate, 1);
          return faker.date.between({ from: createdDate, to: validToDate });
        })();

    const subject = randomElement(ticketSubjects[category]);
    const description = faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 }));

    // Assigned agent for non-open tickets
    const assignedAgent = status !== 'open' 
      ? randomElement(agentPool)
      : undefined;

    tickets.push({
      id: `ticket-${i}`,
      ticketId: generateId('TICKET', i),
      subject,
      category,
      priority: randomElement(priorities),
      status,
      description,
      createdDate: createdDate.toISOString(),
      updatedDate: updatedDate.toISOString(),
      resolvedDate: resolvedDate?.toISOString(),
      assignedAgent,
      relatedWorkOrderId: faker.datatype.boolean({ probability: 0.3 })
        ? `wo-${faker.number.int({ min: 1, max: 50 })}`
        : undefined,
      relatedInvoiceId: faker.datatype.boolean({ probability: 0.2 })
        ? `inv-${faker.number.int({ min: 1, max: 40 })}`
        : undefined,
    });
  }

  return tickets;
}

// Generate Clients
export function generateClients(count: number = 10): Client[] {
  const clientTypes: Client['clientType'][] = ['property-management', 'real-estate', 'individual', 'corporate'];
  const statuses: Client['status'][] = ['active', 'inactive', 'suspended'];
  
  const clients: Client[] = [];

  for (let i = 1; i <= count; i++) {
    const clientType = randomElement(clientTypes);
    const companyName = clientType === 'individual' 
      ? undefined
      : faker.company.name();
    
    const name = clientType === 'individual'
      ? faker.person.fullName()
      : companyName!;

    const city = faker.location.city();
    const state = faker.location.state({ abbreviated: true });
    const zipCode = faker.location.zipCode();

    // Generate related email based on name/company
    let email: string;
    if (clientType === 'individual') {
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      email = faker.internet.email({ firstName, lastName });
    } else {
      // For companies, generate email based on company name
      const companyNameClean = companyName!.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '.')
        .substring(0, 20);
      email = faker.internet.email({ firstName: companyNameClean });
    }

    // Generate contact person for companies
    const contactPerson = clientType !== 'individual' ? faker.person.fullName() : undefined;

    clients.push({
      id: `client-${i}`,
      name,
      company: companyName,
      email,
      phone: faker.phone.number(),
      address: faker.location.streetAddress(true),
      city,
      state,
      zipCode,
      contactPerson,
      clientType,
      status: randomElement(statuses),
      totalWorkOrders: faker.number.int({ min: 5, max: 100 }),
      totalSpent: faker.number.int({ min: 10000, max: 500000 }),
      averageRating: faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 }),
      createdAt: faker.date.past({ years: 2 }).toISOString(),
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
  tickets: SupportTicket[],
  count: number = 100
): Activity[] {
  const activities: Activity[] = [];

  // Work order activities
  workOrders.slice(0, Math.min(30, workOrders.length)).forEach(wo => {
    activities.push({
      id: `activity-wo-${wo.id}`,
      type: 'work-order-created',
      title: 'New Work Order Assigned',
      description: `Work order ${wo.workOrderId} assigned for ${wo.propertyAddress}`,
      timestamp: wo.requestDate,
      relatedId: wo.id,
      relatedType: 'work-order',
      read: faker.datatype.boolean({ probability: 0.3 }),
      actionUrl: `/work-orders/${wo.id}`,
    });

    if (wo.status === 'completed' && wo.completedDate) {
      activities.push({
        id: `activity-wo-completed-${wo.id}`,
        type: 'work-order-completed',
        title: 'Work Order Completed',
        description: `Work order ${wo.workOrderId} has been completed`,
        timestamp: wo.completedDate,
        relatedId: wo.id,
        relatedType: 'work-order',
        read: faker.datatype.boolean({ probability: 0.2 }),
        actionUrl: `/work-orders/${wo.id}`,
      });
    }
  });

  // Invoice activities
  invoices.slice(0, Math.min(20, invoices.length)).forEach(inv => {
    activities.push({
      id: `activity-inv-${inv.id}`,
      type: 'invoice-created',
      title: 'Invoice Created',
      description: `Invoice ${inv.invoiceNumber} created for ${inv.clientName}`,
      timestamp: inv.issueDate,
      relatedId: inv.id,
      relatedType: 'invoice',
      read: faker.datatype.boolean({ probability: 0.3 }),
      actionUrl: `/invoices/${inv.id}`,
    });

    if (inv.status === 'sent') {
      activities.push({
        id: `activity-inv-sent-${inv.id}`,
        type: 'invoice-sent',
        title: 'Invoice Sent',
        description: `Invoice ${inv.invoiceNumber} has been sent to ${inv.clientName}`,
        timestamp: inv.issueDate,
        relatedId: inv.id,
        relatedType: 'invoice',
        read: faker.datatype.boolean({ probability: 0.4 }),
        actionUrl: `/invoices/${inv.id}`,
      });
    }

    if (inv.status === 'paid' && inv.paidDate) {
      activities.push({
        id: `activity-inv-paid-${inv.id}`,
        type: 'invoice-paid',
        title: 'Invoice Paid',
        description: `Invoice ${inv.invoiceNumber} has been paid`,
        timestamp: inv.paidDate,
        relatedId: inv.id,
        relatedType: 'invoice',
        read: faker.datatype.boolean({ probability: 0.2 }),
        actionUrl: `/invoices/${inv.id}`,
      });
    }
  });

  // Payment activities
  payments.slice(0, Math.min(15, payments.length)).forEach(payment => {
    if (payment.status === 'completed') {
      activities.push({
        id: `activity-pay-${payment.id}`,
        type: 'payment-received',
        title: 'Payment Received',
        description: `Payment of $${payment.amount.toFixed(2)} received for invoice ${payment.invoiceNumber}`,
        timestamp: payment.paymentDate,
        relatedId: payment.id,
        relatedType: 'payment',
        read: faker.datatype.boolean({ probability: 0.3 }),
        actionUrl: `/payments/${payment.id}`,
      });
    }
  });

  // Bid activities
  bids.slice(0, Math.min(15, bids.length)).forEach(bid => {
    activities.push({
      id: `activity-bid-${bid.id}`,
      type: 'bid-submitted',
      title: 'Bid Submitted',
      description: `Bid ${bid.bidId} submitted for project`,
      timestamp: bid.submittedDate,
      relatedId: bid.id,
      relatedType: 'bid',
      read: faker.datatype.boolean({ probability: 0.4 }),
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
        read: faker.datatype.boolean({ probability: 0.1 }),
        actionUrl: `/marketplace/bids/${bid.id}`,
      });
    }

    if (bid.status === 'rejected') {
      activities.push({
        id: `activity-bid-rejected-${bid.id}`,
        type: 'bid-rejected',
        title: 'Bid Rejected',
        description: `Bid ${bid.bidId} was not selected for this project`,
        timestamp: bid.reviewedDate || bid.submittedDate,
        relatedId: bid.id,
        relatedType: 'bid',
        read: faker.datatype.boolean({ probability: 0.5 }),
        actionUrl: `/marketplace/bids/${bid.id}`,
      });
    }
  });

  // Ticket activities
  tickets.slice(0, Math.min(10, tickets.length)).forEach(ticket => {
    activities.push({
      id: `activity-ticket-${ticket.id}`,
      type: 'ticket-created',
      title: 'Support Ticket Created',
      description: `New ticket ${ticket.ticketId}: ${ticket.subject}`,
      timestamp: ticket.createdDate,
      relatedId: ticket.id,
      relatedType: 'ticket',
      read: faker.datatype.boolean({ probability: 0.3 }),
      actionUrl: `/help-desk/tickets/${ticket.id}`,
    });

    if (ticket.status === 'resolved' && ticket.resolvedDate) {
      activities.push({
        id: `activity-ticket-resolved-${ticket.id}`,
        type: 'ticket-resolved',
        title: 'Ticket Resolved',
        description: `Ticket ${ticket.ticketId} has been resolved`,
        timestamp: ticket.resolvedDate,
        relatedId: ticket.id,
        relatedType: 'ticket',
        read: faker.datatype.boolean({ probability: 0.2 }),
        actionUrl: `/help-desk/tickets/${ticket.id}`,
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
    return dueDate < now && inv.status !== 'paid' && inv.status !== 'cancelled';
  });

  overdueInvoices.slice(0, 5).forEach(inv => {
    const daysOverdue = Math.floor((now.getTime() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    notifications.push({
      id: `notif-overdue-${inv.id}`,
      type: 'warning',
      priority: daysOverdue > 30 ? 'high' : 'medium',
      title: 'Overdue Invoice',
      message: `Invoice ${inv.invoiceNumber} is ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue. Please follow up with ${inv.clientName}`,
      timestamp: inv.dueDate,
      read: faker.datatype.boolean({ probability: 0.4 }),
      actionUrl: `/invoices/${inv.id}`,
      relatedId: inv.id,
    });
  });

  // Urgent work orders
  const urgentWorkOrders = workOrders.filter(wo => 
    (wo.priority === 'urgent' || wo.priority === 'high') && 
    wo.status !== 'completed' && 
    wo.status !== 'cancelled'
  );
  
  urgentWorkOrders.slice(0, 5).forEach(wo => {
    notifications.push({
      id: `notif-urgent-${wo.id}`,
      type: 'error',
      priority: 'high',
      title: 'Urgent Work Order',
      message: `Urgent work order ${wo.workOrderId} requires immediate attention`,
      timestamp: wo.requestDate,
      read: faker.datatype.boolean({ probability: 0.3 }),
      actionUrl: `/work-orders/${wo.id}`,
      relatedId: wo.id,
    });
  });

  // Payment received
  if (Math.random() > 0.5) {
    notifications.push({
      id: 'notif-payment-1',
      type: 'success',
      priority: 'medium',
      title: 'Payment Received',
      message: 'A new payment has been received and processed',
      timestamp: faker.date.recent({ days: 1 }).toISOString(),
      read: faker.datatype.boolean({ probability: 0.5 }),
      actionUrl: '/payments',
    });
  }

  // System announcements
  if (Math.random() > 0.6) {
    notifications.push({
      id: 'notif-system-1',
      type: 'info',
      priority: 'low',
      title: 'System Update',
      message: faker.helpers.arrayElement([
        'New features have been added to the dashboard. Check out the updates!',
        'Scheduled maintenance completed successfully',
        'New reporting features are now available',
        'Dashboard performance improvements',
      ]),
      timestamp: faker.date.recent({ days: 2 }).toISOString(),
      read: faker.datatype.boolean({ probability: 0.6 }),
    });
  }

  return notifications
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, count);
}

// Generate Vendor/User
export function generateVendor(): Vendor {
  const city = faker.location.city();
  const state = faker.location.state({ abbreviated: true });
  const zipCode = faker.location.zipCode();

  return {
    id: 'vendor-1',
    companyName: faker.company.name(),
    contactName: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(true),
    city,
    state,
    zipCode,
    serviceCategories: faker.helpers.arrayElements(
      ['plumbing', 'hvac', 'electrical', 'carpentry', 'painting', 'landscaping', 'appliance', 'general'] as const,
      { min: 3, max: 6 }
    ),
    rating: faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 1 }),
    totalProjects: faker.number.int({ min: 100, max: 500 }),
    completedProjects: faker.number.int({ min: 90, max: 480 }),
    activeWorkOrders: faker.number.int({ min: 5, max: 20 }),
    totalEarnings: faker.number.int({ min: 200000, max: 1000000 }),
    membershipType: faker.helpers.arrayElement(['basic', 'premium', 'pro'] as const),
    status: 'active' as const,
    createdAt: faker.date.past({ years: 3 }).toISOString(),
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
  
  const outstandingInvoices = invoices
    .filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const overdueInvoices = invoices
    .filter(inv => {
      const dueDate = new Date(inv.dueDate);
      return dueDate < new Date() && inv.status !== 'paid' && inv.status !== 'cancelled';
    })
    .length;
  
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

  // Calculate average response time from tickets
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' && t.resolvedDate && t.createdDate);
  const responseTimes = resolvedTickets.map(t => {
    const created = new Date(t.createdDate);
    const resolved = new Date(t.resolvedDate!);
    return (resolved.getTime() - created.getTime()) / (1000 * 60 * 60); // hours
  });
  const avgResponseTime = responseTimes.length > 0
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    : 2.5;

  // Calculate average rating from work orders or use default
  const averageRating = 4.5 + Math.random() * 0.5; // 4.5 to 5.0

  return {
    activeWorkOrders,
    pendingWorkOrders,
    inProgressWorkOrders,
    completedWorkOrders,
    totalEarnings: Math.round(totalEarnings),
    monthlyEarnings: Math.round(monthlyEarnings),
    outstandingInvoices: Math.round(outstandingInvoices),
    overdueInvoices,
    pendingPayments,
    activeBids,
    wonBids,
    lostBids,
    openTickets,
    responseTime: Math.round(avgResponseTime * 10) / 10,
    completionRate: Math.round(completionRate * 10) / 10,
    onTimeCompletionRate: Math.round(onTimeCompletionRate * 10) / 10,
    averageRating: Math.round(averageRating * 10) / 10,
  };
}

// Generate Chart Data
export function generateTimeSeriesData(days: number = 30): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  const now = new Date();
  const baseValue = faker.number.int({ min: 5000, max: 15000 });
  let currentValue = baseValue;

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(now, i);
    // Add some realistic variation (trending slightly up with noise)
    const trend = 1 + (days - i) * 0.01; // Slight upward trend
    const noise = faker.number.float({ min: 0.8, max: 1.2 });
    currentValue = Math.round(baseValue * trend * noise);
    
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      value: Math.max(1000, currentValue), // Ensure minimum value
    });
  }

  return data;
}

export function generateChartData(labels: string[], min: number = 0, max: number = 100): ChartDataPoint[] {
  return labels.map(label => ({
    label,
    value: faker.number.int({ min, max }),
  }));
}

// Knowledge Base Article Type
export interface KnowledgeBaseArticle {
  id: string;
  category: string;
  title: string;
  content: string;
}

// Generate Knowledge Base Articles
export function generateKnowledgeBaseArticles(count: number = 20): KnowledgeBaseArticle[] {
  const categories = [
    'Getting Started',
    'Billing & Payments',
    'Marketplace',
    'Account Management',
    'Technical Support',
    'Work Orders',
    'Invoices',
    'Reports & Analytics',
  ];

  const articleTemplates: Record<string, string[]> = {
    'Getting Started': [
      'How to create a work order',
      'Getting started with the dashboard',
      'Setting up your profile',
      'Understanding the navigation menu',
      'First steps after account creation',
    ],
    'Billing & Payments': [
      'How to create an invoice',
      'Processing payments',
      'Understanding payment terms',
      'Managing outstanding invoices',
      'Setting up payment methods',
    ],
    'Marketplace': [
      'How to submit a bid',
      'Finding projects in the marketplace',
      'Understanding project requirements',
      'Managing your bids',
      'Winning bid strategies',
    ],
    'Account Management': [
      'How to update your profile',
      'Changing your password',
      'Updating company information',
      'Managing team members',
      'Account settings overview',
    ],
    'Technical Support': [
      'Browser compatibility',
      'Troubleshooting login issues',
      'Resolving display problems',
      'Exporting data',
      'Mobile app usage',
    ],
    'Work Orders': [
      'Creating work orders',
      'Assigning technicians',
      'Updating work order status',
      'Adding notes and attachments',
      'Completing work orders',
    ],
    'Invoices': [
      'Creating invoices from work orders',
      'Adding line items to invoices',
      'Sending invoices to clients',
      'Tracking invoice status',
      'Managing invoice templates',
    ],
    'Reports & Analytics': [
      'Understanding dashboard metrics',
      'Generating revenue reports',
      'Viewing completion rates',
      'Exporting report data',
      'Customizing reports',
    ],
  };

  const articles: KnowledgeBaseArticle[] = [];
  let articleId = 1;

  // Generate articles for each category
  categories.forEach(category => {
    const titles = articleTemplates[category] || [];
    const articlesPerCategory = Math.ceil(count / categories.length);
    
    for (let i = 0; i < articlesPerCategory && articleId <= count; i++) {
      const title = titles[i] || `${category} - Article ${i + 1}`;
      const content = faker.lorem.paragraphs(faker.number.int({ min: 2, max: 4 }), '\n\n');
      
      articles.push({
        id: `kb-${articleId}`,
        category,
        title,
        content,
      });
      
      articleId++;
    }
  });

  return articles.slice(0, count);
}
