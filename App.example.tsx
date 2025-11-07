/**
 * App.tsx Example
 * 
 * Example of how to use the new navigation components in App.tsx
 * 
 * Replace the current App.tsx with this implementation
 */

import { useState, lazy, Suspense } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  CreditCard,
  Briefcase,
  Headphones,
} from 'lucide-react';
import { DashboardLayout, LoadingSpinner } from './components/shared';
import { vendor } from './data';

// Lazy load screen components
const Overview = lazy(() => import('./components/Overview').then(module => ({ default: module.Overview })));
const WorkOrders = lazy(() => import('./components/WorkOrders').then(module => ({ default: module.WorkOrders })));
const Invoice = lazy(() => import('./components/Invoice').then(module => ({ default: module.Invoice })));
const Payments = lazy(() => import('./components/Payments').then(module => ({ default: module.Payments })));
const Marketplace = lazy(() => import('./components/Marketplace').then(module => ({ default: module.Marketplace })));
const HelpDesk = lazy(() => import('./components/HelpDesk').then(module => ({ default: module.HelpDesk })));

// Navigation menu items
const menuItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
  },
  {
    id: 'work-orders',
    label: 'Work Orders',
    icon: ClipboardList,
    badge: 5, // Example: notification count
  },
  {
    id: 'invoice',
    label: 'Invoice',
    icon: FileText,
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: CreditCard,
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: Briefcase,
  },
  {
    id: 'help-desk',
    label: 'Help Desk',
    icon: Headphones,
  },
];

// Screen component mapping
const screenComponents = {
  overview: Overview,
  'work-orders': WorkOrders,
  invoice: Invoice,
  payments: Payments,
  marketplace: Marketplace,
  'help-desk': HelpDesk,
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const ScreenComponent = screenComponents[activeScreen as keyof typeof screenComponents] || Overview;
  const activeMenuItem = menuItems.find(item => item.id === activeScreen);
  const pageTitle = activeMenuItem?.label || 'Dashboard';

  return (
    <DashboardLayout
      navItems={menuItems}
      activeScreen={activeScreen}
      onScreenChange={setActiveScreen}
      logo={{
        text: 'PropertyVendor',
        subtitle: 'Pro Dashboard',
      }}
      user={{
        name: vendor.companyName,
        role: 'Premium Contractor',
        initials: vendor.companyName.split(' ').map(n => n[0]).join('').slice(0, 2),
        onViewProfile: () => console.log('View profile'),
      }}
      header={{
        title: pageTitle,
        breadcrumbs: [
          { label: 'Pages' },
          { label: pageTitle },
        ],
        search: {
          placeholder: 'Search...',
          value: searchQuery,
          onChange: setSearchQuery,
        },
        notifications: {
          count: 3,
          onClick: () => console.log('Open notifications'),
        },
      }}
      darkMode={darkMode}
      onDarkModeToggle={() => setDarkMode(!darkMode)}
    >
      <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
        <ScreenComponent />
      </Suspense>
    </DashboardLayout>
  );
}

