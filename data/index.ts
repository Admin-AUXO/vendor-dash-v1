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
    cachedData.workOrders = generateWorkOrders(40);
    cachedData.invoices = generateInvoices(cachedData.workOrders, 50);
    cachedData.payments = generatePayments(cachedData.invoices, 30);
    cachedData.marketplaceProjects = generateMarketplaceProjects(20);
    cachedData.bids = generateBids(cachedData.marketplaceProjects, 30);
    cachedData.supportTickets = generateSupportTickets(10);
    cachedData.clients = generateClients(10);
    cachedData.activities = generateActivities(
      cachedData.workOrders,
      cachedData.invoices,
      cachedData.payments,
      cachedData.bids,
      cachedData.supportTickets,
      60
    );
    cachedData.notifications = generateNotifications(cachedData.workOrders, cachedData.invoices, 15);
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
    cachedData.knowledgeBaseArticles = generateKnowledgeBaseArticles(20);
    
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

