import { useState, lazy, Suspense } from 'react';
import {
  LayoutDashboard,
  Wrench,
  Receipt,
  CreditCard,
  Briefcase,
  LifeBuoy,
} from 'lucide-react';
import { DashboardLayout, LoadingSpinner, NavigationProvider } from '@/components/shared';
import { vendor } from '@/data';

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
    icon: Wrench,
  },
  {
    id: 'invoice',
    label: 'Invoice',
    icon: Receipt,
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
    icon: LifeBuoy,
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

  const ScreenComponent = screenComponents[activeScreen as keyof typeof screenComponents] || Overview;
  const activeMenuItem = menuItems.find(item => item.id === activeScreen);
  const pageTitle = activeMenuItem?.label || 'Dashboard';

  return (
    <NavigationProvider onNavigate={setActiveScreen}>
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
          notifications: {
            count: 3,
            onClick: () => console.log('Open notifications'),
          },
        }}
      >
        <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
          <ScreenComponent />
        </Suspense>
      </DashboardLayout>
    </NavigationProvider>
  );
}
