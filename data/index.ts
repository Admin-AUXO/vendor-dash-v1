/**
 * Main Data Export
 * 
 * Centralized data generation and export for the dashboard
 * Includes caching to avoid regenerating data on every import
 */

import { generateWorkOrders } from './generators';
import { generateInvoices } from './generators';
import { generatePayments } from './generators';
import { generateMarketplaceProjects } from './generators';
import { generateBids } from './generators';
import { generateSupportTickets } from './generators';
import { generateClients } from './generators';
import { generateActivities } from './generators';
import { generateNotifications } from './generators';
import { generateVendor } from './generators';
import { generateDashboardMetrics } from './generators';
import { generateTimeSeriesData, generateKnowledgeBaseArticles } from './generators';

// Cache storage
let cachedData: {
  workOrders?: ReturnType<typeof generateWorkOrders>;
  invoices?: ReturnType<typeof generateInvoices>;
  payments?: ReturnType<typeof generatePayments>;
  marketplaceProjects?: ReturnType<typeof generateMarketplaceProjects>;
  bids?: ReturnType<typeof generateBids>;
  supportTickets?: ReturnType<typeof generateSupportTickets>;
  clients?: ReturnType<typeof generateClients>;
  activities?: ReturnType<typeof generateActivities>;
  notifications?: ReturnType<typeof generateNotifications>;
  vendor?: ReturnType<typeof generateVendor>;
  metrics?: ReturnType<typeof generateDashboardMetrics>;
  weeklyRevenueData?: ReturnType<typeof generateTimeSeriesData>;
  monthlyRevenueData?: ReturnType<typeof generateTimeSeriesData>;
  serviceDistributionData?: Array<{ label: string; value: number }>;
  knowledgeBaseArticles?: ReturnType<typeof generateKnowledgeBaseArticles>;
} = {};

// Generate all data (with caching)
function getCachedData() {
  if (!cachedData.workOrders) {
    // Generate in dependency order
    // Minimum requirements for charts:
    // - Work Orders: Need at least 1 per service category (8), status (5), priority (4)
    //   Plus enough completed orders for invoices (at least 20 completed)
    //   Minimum total: 40 work orders to ensure full variability
    cachedData.workOrders = generateWorkOrders(60);
    
    // Invoices: Need at least 1 per status (8 statuses) and enough paid invoices for payments
    // Minimum: 30 invoices with at least 20 paid invoices for payment generation
    cachedData.invoices = generateInvoices(cachedData.workOrders, 40);
    
    // Payments: Need payments across 6 months, 7 days, all payment methods (6), all statuses (4)
    // Need payments from multiple clients (at least 6 clients)
    // Minimum: 30 payments to ensure full chart coverage
    cachedData.payments = generatePayments(cachedData.invoices, 40);
    
    cachedData.marketplaceProjects = generateMarketplaceProjects(25);
    cachedData.bids = generateBids(cachedData.marketplaceProjects, 35);
    cachedData.supportTickets = generateSupportTickets(15);
    
    // Clients: Need at least 6-8 clients for top clients chart
    cachedData.clients = generateClients(12);
    
    cachedData.activities = generateActivities(
      cachedData.workOrders,
      cachedData.invoices,
      cachedData.payments,
      cachedData.bids,
      cachedData.supportTickets,
      80
    );
    cachedData.notifications = generateNotifications(cachedData.workOrders, cachedData.invoices, 20);
    cachedData.vendor = generateVendor();
    cachedData.metrics = generateDashboardMetrics(
      cachedData.workOrders,
      cachedData.invoices,
      cachedData.payments,
      cachedData.bids,
      cachedData.supportTickets
    );
    cachedData.weeklyRevenueData = generateTimeSeriesData(7);
    cachedData.monthlyRevenueData = generateTimeSeriesData(30);
    cachedData.knowledgeBaseArticles = generateKnowledgeBaseArticles(25);
    
    // Calculate service distribution from actual work orders
    const categoryMap: Record<string, number> = {
      'Plumbing': 0,
      'HVAC': 0,
      'Electrical': 0,
      'Carpentry': 0,
      'Painting': 0,
      'Landscaping': 0,
      'Appliance': 0,
      'General': 0,
    };

    cachedData.workOrders.forEach(wo => {
      const categoryName = wo.serviceCategory.charAt(0).toUpperCase() + wo.serviceCategory.slice(1);
      if (categoryMap.hasOwnProperty(categoryName)) {
        categoryMap[categoryName]++;
      }
    });

    cachedData.serviceDistributionData = Object.entries(categoryMap).map(([label, value]) => ({
      label,
      value,
    }));
  }
  
  return cachedData;
}

// Export cached data - ensure all data is generated
const cachedDataResult = getCachedData();

// Type assertions since we know getCachedData always generates the data
const workOrders = cachedDataResult.workOrders!;
const invoices = cachedDataResult.invoices!;
const payments = cachedDataResult.payments!;
const marketplaceProjects = cachedDataResult.marketplaceProjects!;
const bids = cachedDataResult.bids!;
const supportTickets = cachedDataResult.supportTickets!;
const clients = cachedDataResult.clients!;
const activities = cachedDataResult.activities!;
const notifications = cachedDataResult.notifications!;
const vendor = cachedDataResult.vendor!;
const metrics = cachedDataResult.metrics!;
const weeklyRevenueData = cachedDataResult.weeklyRevenueData!;
const monthlyRevenueData = cachedDataResult.monthlyRevenueData!;
const serviceDistributionData = cachedDataResult.serviceDistributionData!;
const knowledgeBaseArticles = cachedDataResult.knowledgeBaseArticles!;

// Export all data
export {
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
  weeklyRevenueData,
  monthlyRevenueData,
  serviceDistributionData,
  knowledgeBaseArticles,
};

// Export generators for on-demand generation
export * from './generators';

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

