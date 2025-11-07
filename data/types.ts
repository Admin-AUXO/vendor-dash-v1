/**
 * Type Definitions for Dashboard Data
 * 
 * Central type definitions for all data models used in the vendor dashboard
 */

// Work Order Types
export type WorkOrderStatus = 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
export type WorkOrderPriority = 'urgent' | 'high' | 'medium' | 'low';
export type PropertyType = 'residential' | 'commercial' | 'industrial' | 'mixed-use';
export type ServiceCategory = 'plumbing' | 'hvac' | 'electrical' | 'carpentry' | 'painting' | 'landscaping' | 'appliance' | 'general';

export interface WorkOrder {
  id: string;
  workOrderId: string; // Display ID like "WO-2341"
  propertyAddress: string;
  propertyType: PropertyType;
  serviceCategory: ServiceCategory;
  serviceDescription: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  requestDate: string;
  dueDate: string;
  completedDate?: string;
  clientId: string;
  clientName: string;
  clientContact: string;
  clientPhone: string;
  clientEmail?: string;
  assignedTechnician?: string;
  assignedTeam?: string;
  estimatedHours?: number;
  actualHours?: number;
  estimatedCost: number;
  actualCost?: number;
  notes?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }>;
  timeline?: Array<{
    id: string;
    action: string;
    timestamp: string;
    performedBy: string;
  }>;
}

// Invoice Types
export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'approved' | 'paid' | 'overdue' | 'disputed' | 'cancelled';
export type PaymentMethod = 'check' | 'ach' | 'wire' | 'credit-card' | 'cash' | 'other';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  workOrderId?: string;
  clientId: string;
  clientName: string;
  clientAddress: string;
  clientEmail?: string;
  propertyAddress: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxAmount: number;
  discount?: number;
  total: number;
  paymentTerms: string;
  notes?: string;
  paymentMethod?: PaymentMethod;
  referenceNumber?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  timeline?: Array<{
    id: string;
    action: string;
    timestamp: string;
    performedBy: string;
  }>;
}

// Payment Types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export interface Payment {
  id: string;
  paymentId: string; // Display ID
  invoiceId: string;
  invoiceNumber: string;
  workOrderId?: string;
  clientId: string;
  clientName: string;
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  referenceNumber?: string;
  notes?: string;
  processedBy?: string;
}

// Marketplace Types
export type ProjectStatus = 'open' | 'in-review' | 'awarded' | 'closed' | 'cancelled';
export type BidStatus = 'pending' | 'under-review' | 'accepted' | 'rejected' | 'withdrawn';

export interface MarketplaceProject {
  id: string;
  projectId: string; // Display ID
  propertyAddress: string;
  propertyType: PropertyType;
  serviceCategory: ServiceCategory;
  projectDescription: string;
  budgetMin: number;
  budgetMax: number;
  postedDate: string;
  deadline: string;
  startDate?: string;
  clientId?: string; // May be confidential
  clientName?: string; // May be "Confidential"
  isConfidential: boolean;
  status: ProjectStatus;
  requiredQualifications?: string[];
  projectTimeline?: string;
  numberOfBids: number;
  location?: {
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface Bid {
  id: string;
  bidId: string; // Display ID
  projectId: string;
  vendorId: string;
  proposedCost: number;
  costBreakdown?: {
    materials: number;
    labor: number;
    other: number;
  };
  estimatedTimeline: string;
  startDateAvailability: string;
  paymentTerms: string;
  notes?: string;
  status: BidStatus;
  submittedDate: string;
  reviewedDate?: string;
  clientResponse?: string;
  winningBidAmount?: number; // If rejected
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
}

// Help Desk Types
export type TicketStatus = 'open' | 'in-progress' | 'waiting-response' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'technical' | 'billing' | 'account' | 'feature-request' | 'bug' | 'other';

export interface SupportTicket {
  id: string;
  ticketId: string; // Display ID like "TICKET-1234"
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  createdDate: string;
  updatedDate: string;
  resolvedDate?: string;
  assignedAgent?: string;
  relatedWorkOrderId?: string;
  relatedInvoiceId?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  messages?: Array<{
    id: string;
    sender: string;
    senderType: 'vendor' | 'support';
    message: string;
    timestamp: string;
    attachments?: Array<{
      id: string;
      name: string;
      url: string;
    }>;
  }>;
}

// Client Types
export interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactPerson?: string;
  clientType: 'property-management' | 'real-estate' | 'individual' | 'corporate';
  status: 'active' | 'inactive' | 'suspended';
  totalWorkOrders: number;
  totalSpent: number;
  averageRating?: number;
  createdAt: string;
}

// Activity Types
export type ActivityType = 
  | 'work-order-created'
  | 'work-order-updated'
  | 'work-order-completed'
  | 'invoice-created'
  | 'invoice-sent'
  | 'invoice-paid'
  | 'payment-received'
  | 'bid-submitted'
  | 'bid-accepted'
  | 'bid-rejected'
  | 'ticket-created'
  | 'ticket-updated'
  | 'ticket-resolved'
  | 'notification';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  relatedId?: string; // ID of related entity (work order, invoice, etc.)
  relatedType?: 'work-order' | 'invoice' | 'payment' | 'bid' | 'ticket';
  read: boolean;
  actionUrl?: string;
}

// Notification Types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  relatedId?: string;
}

// Vendor/User Types
export interface Vendor {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  serviceCategories: ServiceCategory[];
  rating?: number;
  totalProjects: number;
  completedProjects: number;
  activeWorkOrders: number;
  totalEarnings: number;
  membershipType: 'basic' | 'premium' | 'pro';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

// KPI/Metrics Types
export interface DashboardMetrics {
  activeWorkOrders: number;
  pendingWorkOrders: number;
  inProgressWorkOrders: number;
  completedWorkOrders: number;
  totalEarnings: number;
  monthlyEarnings: number;
  outstandingInvoices: number;
  overdueInvoices: number;
  pendingPayments: number;
  activeBids: number;
  wonBids: number;
  lostBids: number;
  openTickets: number;
  responseTime: number; // in hours
  completionRate: number; // percentage
  onTimeCompletionRate: number; // percentage
  averageRating: number;
}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

