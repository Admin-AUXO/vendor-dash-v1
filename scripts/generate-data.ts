/**
 * Data Generation Script
 * 
 * This script generates all dashboard data using faker and saves it to JSON files.
 * Run this script once to pre-generate all data, then remove faker dependency.
 */

import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import {
  generateWorkOrders,
  generateInvoices,
  generatePayments,
  generateMarketplaceProjects,
  generateBids,
  generateSupportTickets,
  generateClients,
  generateActivities,
  generateNotifications,
  generateVendor,
  generateDashboardMetrics,
  generateTimeSeriesData,
  generateKnowledgeBaseArticles,
} from '../data/generators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Output directory for generated data
const OUTPUT_DIR = join(__dirname, '..', 'data', 'generated');

// Generate extensive data with high variability and all available options
// These counts ensure:
// - All status combinations are represented
// - All priority levels have sufficient examples
// - All service categories are well-distributed
// - All payment methods and statuses are covered
// - Sufficient data for filtering and searching
const WORK_ORDERS_COUNT = 200;        // Enough for all statuses (5) × priorities (4) × categories (8) = 160 minimum
const INVOICES_COUNT = 120;           // Enough for all statuses (8) with multiples per status
const PAYMENTS_COUNT = 100;           // Enough for all payment methods (6) × statuses (4) = 24 minimum, plus multiples
const MARKETPLACE_PROJECTS_COUNT = 80; // Enough for all statuses (5) × categories (6) = 30 minimum
const BIDS_COUNT = 120;               // Multiple bids per project for better variety
const SUPPORT_TICKETS_COUNT = 60;     // Enough for all categories (6) × priorities (4) = 24 minimum
const CLIENTS_COUNT = 30;             // Enough for all client types (4) with good distribution
const ACTIVITIES_COUNT = 300;         // More activities for richer timeline
const NOTIFICATIONS_COUNT = 50;       // More notifications for better coverage
const KNOWLEDGE_BASE_ARTICLES_COUNT = 40; // More articles for knowledge base

async function ensureDirectoryExists(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function writeJsonFile(filePath: string, data: any) {
  const jsonContent = JSON.stringify(data, null, 2);
  await writeFile(filePath, jsonContent, 'utf-8');
  console.log(`✓ Generated ${filePath}`);
}

async function generateAllData() {
  console.log('Starting data generation...\n');

  // Ensure output directory exists
  await ensureDirectoryExists(OUTPUT_DIR);

  // Generate data in dependency order
  console.log('Generating work orders...');
  const workOrders = generateWorkOrders(WORK_ORDERS_COUNT);
  await writeJsonFile(join(OUTPUT_DIR, 'workOrders.json'), workOrders);

  console.log('Generating invoices...');
  const invoices = generateInvoices(workOrders, INVOICES_COUNT);
  await writeJsonFile(join(OUTPUT_DIR, 'invoices.json'), invoices);

  console.log('Generating payments...');
  const payments = generatePayments(invoices, PAYMENTS_COUNT);
  await writeJsonFile(join(OUTPUT_DIR, 'payments.json'), payments);

  console.log('Generating marketplace projects...');
  const marketplaceProjects = generateMarketplaceProjects(MARKETPLACE_PROJECTS_COUNT);
  await writeJsonFile(join(OUTPUT_DIR, 'marketplaceProjects.json'), marketplaceProjects);

  console.log('Generating bids...');
  const bids = generateBids(marketplaceProjects, BIDS_COUNT);
  await writeJsonFile(join(OUTPUT_DIR, 'bids.json'), bids);

  console.log('Generating support tickets...');
  const supportTickets = generateSupportTickets(SUPPORT_TICKETS_COUNT);
  await writeJsonFile(join(OUTPUT_DIR, 'supportTickets.json'), supportTickets);

  console.log('Generating clients...');
  const clients = generateClients(CLIENTS_COUNT);
  await writeJsonFile(join(OUTPUT_DIR, 'clients.json'), clients);

  console.log('Generating activities...');
  const activities = generateActivities(
    workOrders,
    invoices,
    payments,
    bids,
    supportTickets,
    ACTIVITIES_COUNT
  );
  await writeJsonFile(join(OUTPUT_DIR, 'activities.json'), activities);

  console.log('Generating notifications...');
  const notifications = generateNotifications(workOrders, invoices, NOTIFICATIONS_COUNT);
  await writeJsonFile(join(OUTPUT_DIR, 'notifications.json'), notifications);

  console.log('Generating vendor...');
  const vendor = generateVendor();
  await writeJsonFile(join(OUTPUT_DIR, 'vendor.json'), vendor);

  console.log('Generating dashboard metrics...');
  const metrics = generateDashboardMetrics(
    workOrders,
    invoices,
    payments,
    bids,
    supportTickets
  );
  await writeJsonFile(join(OUTPUT_DIR, 'metrics.json'), metrics);

  console.log('Generating time series data...');
  const weeklyRevenueData = generateTimeSeriesData(7);
  await writeJsonFile(join(OUTPUT_DIR, 'weeklyRevenueData.json'), weeklyRevenueData);

  const monthlyRevenueData = generateTimeSeriesData(30);
  await writeJsonFile(join(OUTPUT_DIR, 'monthlyRevenueData.json'), monthlyRevenueData);

  console.log('Generating service distribution data...');
  // Calculate service distribution from work orders
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

  const serviceDistributionData = Object.entries(categoryMap).map(([label, value]) => ({
    label,
    value,
  }));
  await writeJsonFile(join(OUTPUT_DIR, 'serviceDistributionData.json'), serviceDistributionData);

  console.log('Generating knowledge base articles...');
  const knowledgeBaseArticles = generateKnowledgeBaseArticles(KNOWLEDGE_BASE_ARTICLES_COUNT);
  await writeJsonFile(join(OUTPUT_DIR, 'knowledgeBaseArticles.json'), knowledgeBaseArticles);

  console.log('\n✅ Data generation complete!');
  console.log(`📁 All files saved to: ${OUTPUT_DIR}`);
  console.log('\nGenerated files:');
  console.log('  - workOrders.json');
  console.log('  - invoices.json');
  console.log('  - payments.json');
  console.log('  - marketplaceProjects.json');
  console.log('  - bids.json');
  console.log('  - supportTickets.json');
  console.log('  - clients.json');
  console.log('  - activities.json');
  console.log('  - notifications.json');
  console.log('  - vendor.json');
  console.log('  - metrics.json');
  console.log('  - weeklyRevenueData.json');
  console.log('  - monthlyRevenueData.json');
  console.log('  - serviceDistributionData.json');
  console.log('  - knowledgeBaseArticles.json');
}

// Run the generation
generateAllData().catch(error => {
  console.error('Error generating data:', error);
  process.exit(1);
});

