/**
 * Main Data Export
 * 
 * Centralized data generation and export for the dashboard
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

// Generate all data
const workOrders = generateWorkOrders(50);
const invoices = generateInvoices(workOrders, 40);
const payments = generatePayments(invoices, 35);
const marketplaceProjects = generateMarketplaceProjects(30);
const bids = generateBids(marketplaceProjects, 25);
const supportTickets = generateSupportTickets(20);
const clients = generateClients(10);
const activities = generateActivities(workOrders, invoices, payments, bids, supportTickets, 100);
const notifications = generateNotifications(workOrders, invoices, 15);
const vendor = generateVendor();
const metrics = generateDashboardMetrics(workOrders, invoices, payments, bids, supportTickets);

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
};

// Generate knowledge base articles
export const knowledgeBaseArticles = generateKnowledgeBaseArticles(20);

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

// Chart data generators
export const weeklyRevenueData = generateTimeSeriesData(7);
export const monthlyRevenueData = generateTimeSeriesData(30);

// Calculate service distribution from actual work orders
export const serviceDistributionData = (() => {
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

  workOrders.forEach(wo => {
    const categoryName = wo.serviceCategory.charAt(0).toUpperCase() + wo.serviceCategory.slice(1);
    if (categoryMap.hasOwnProperty(categoryName)) {
      categoryMap[categoryName]++;
    }
  });

  return Object.entries(categoryMap).map(([label, value]) => ({
    label,
    value,
  }));
})();

