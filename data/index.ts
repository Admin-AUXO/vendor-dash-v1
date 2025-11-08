/**
 * Main Data Export
 * 
 * Centralized data import from pre-generated JSON files
 */

import workOrdersData from './generated/workOrders.json';
import invoicesData from './generated/invoices.json';
import paymentsData from './generated/payments.json';
import marketplaceProjectsData from './generated/marketplaceProjects.json';
import bidsData from './generated/bids.json';
import supportTicketsData from './generated/supportTickets.json';
import clientsData from './generated/clients.json';
import activitiesData from './generated/activities.json';
import notificationsData from './generated/notifications.json';
import vendorData from './generated/vendor.json';
import metricsData from './generated/metrics.json';
import weeklyRevenueDataData from './generated/weeklyRevenueData.json';
import monthlyRevenueDataData from './generated/monthlyRevenueData.json';
import serviceDistributionDataData from './generated/serviceDistributionData.json';
import knowledgeBaseArticlesData from './generated/knowledgeBaseArticles.json';

// Import types
import type {
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
  ChartDataPoint,
} from './types';

// Export all data with proper types
export const workOrders = workOrdersData as WorkOrder[];
export const invoices = invoicesData as Invoice[];
export const payments = paymentsData as Payment[];
export const marketplaceProjects = marketplaceProjectsData as MarketplaceProject[];
export const bids = bidsData as Bid[];
export const supportTickets = supportTicketsData as SupportTicket[];
export const clients = clientsData as Client[];
export const activities = activitiesData as Activity[];
export const notifications = notificationsData as Notification[];
export const vendor = vendorData as Vendor;
export const metrics = metricsData as DashboardMetrics;
export const weeklyRevenueData = weeklyRevenueDataData as TimeSeriesData[];
export const monthlyRevenueData = monthlyRevenueDataData as TimeSeriesData[];
export const serviceDistributionData = serviceDistributionDataData as ChartDataPoint[];
export const knowledgeBaseArticles = knowledgeBaseArticlesData as Array<{
  id: string;
  category: string;
  title: string;
  content: string;
}>;

// Export types
export * from './types';

// Helper functions to get filtered data
export const getWorkOrdersByStatus = (status: string) => 
  workOrders.filter(wo => wo.status === status);

export const getInvoicesByStatus = (status: string) => 
  invoices.filter(inv => inv.status === status);

export const getPaymentsByStatus = (status: string) => 
  payments.filter(p => p.status === status);

export const getBidsByStatus = (status: string) => 
  bids.filter(b => b.status === status);

export const getTicketsByStatus = (status: string) => 
  supportTickets.filter(t => t.status === status);
