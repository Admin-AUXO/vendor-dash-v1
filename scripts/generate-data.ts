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

// Generate sufficient data - increased counts for better coverage
const WORK_ORDERS_COUNT = 100;
const INVOICES_COUNT = 50; // Reduced to ensure we have enough completed work orders
const PAYMENTS_COUNT = 40;
const MARKETPLACE_PROJECTS_COUNT = 40;
const BIDS_COUNT = 50;
const SUPPORT_TICKETS_COUNT = 30;
const CLIENTS_COUNT = 20;
const ACTIVITIES_COUNT = 150;
const NOTIFICATIONS_COUNT = 30;
const KNOWLEDGE_BASE_ARTICLES_COUNT = 30;

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

