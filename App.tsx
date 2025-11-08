import { useState, lazy, Suspense, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Wrench,
  Receipt,
  CreditCard,
  Briefcase,
  LifeBuoy,
} from 'lucide-react';
import { DashboardLayout, LoadingScreen, NavigationProvider } from '@/components/shared';
import { vendor } from '@/data';

// Lazy load screen components with artificial delay for better UX demonstration
const createLazyLoader = (importFn: () => Promise<any>, minDelay = 300) => {
  return lazy(() => {
    const startTime = Date.now();
    return Promise.all([
      importFn(),
      new Promise(resolve => setTimeout(resolve, minDelay))
    ]).then(([module]) => {
      const elapsed = Date.now() - startTime;
      // Add small delay if loading was too fast to ensure smooth transition
      if (elapsed < minDelay) {
        return new Promise(resolve => 
          setTimeout(() => resolve(module), minDelay - elapsed)
        );
      }
      return module;
    });
  });
};

const Overview = createLazyLoader(() => import('./components/Overview').then(module => ({ default: module.Overview })));
const WorkOrders = createLazyLoader(() => import('./components/WorkOrders').then(module => ({ default: module.WorkOrders })));
const Invoice = createLazyLoader(() => import('./components/Invoice').then(module => ({ default: module.Invoice })));
const Payments = createLazyLoader(() => import('./components/Payments').then(module => ({ default: module.Payments })));
const Marketplace = createLazyLoader(() => import('./components/Marketplace').then(module => ({ default: module.Marketplace })));
const HelpDesk = createLazyLoader(() => import('./components/HelpDesk').then(module => ({ default: module.HelpDesk })));

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

// Screen metadata for loading states
const screenMetadata = {
  overview: { name: 'overview', icon: LayoutDashboard },
  'work-orders': { name: 'work-orders', icon: Wrench },
  invoice: { name: 'invoice', icon: Receipt },
  payments: { name: 'payments', icon: CreditCard },
  marketplace: { name: 'marketplace', icon: Briefcase },
  'help-desk': { name: 'help-desk', icon: LifeBuoy },
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState('overview');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [previousScreen, setPreviousScreen] = useState<string | null>(null);
  const prevScreenRef = useRef<string>('overview');

  // Track screen changes for transition animations
  useEffect(() => {
    if (prevScreenRef.current !== activeScreen) {
      setPreviousScreen(prevScreenRef.current);
      prevScreenRef.current = activeScreen;
      setIsInitialLoad(false);
    }
  }, [activeScreen]);

  const ScreenComponent = screenComponents[activeScreen as keyof typeof screenComponents] || Overview;
  const activeMenuItem = menuItems.find(item => item.id === activeScreen);
  const pageTitle = activeMenuItem?.label || 'Dashboard';
  const screenMeta = screenMetadata[activeScreen as keyof typeof screenMetadata] || screenMetadata.overview;

  // Create loading fallback with screen-specific info
  const LoadingFallback = () => (
    <LoadingScreen
      screenName={screenMeta.name}
      screenIcon={screenMeta.icon}
      isInitialLoad={isInitialLoad && previousScreen === null}
    />
  );

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
        <div className="relative min-h-full">
          <Suspense fallback={<LoadingFallback />}>
            <div className="animate-fade-in">
              <ScreenComponent />
            </div>
          </Suspense>
        </div>
      </DashboardLayout>
    </NavigationProvider>
  );
}
